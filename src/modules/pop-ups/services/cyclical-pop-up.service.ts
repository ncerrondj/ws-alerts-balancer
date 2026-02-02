import { forwardRef, Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { CyclicalPopUpRepository } from "../repositories/cyclical-pop-up.repository";
import { PopUpsService } from "./pop-ups.service";
import { IInitCycleParams } from "../interfaces/init-cycle-params";
import { PopUpTargetTypeEnum } from "../enums/pop-up-target-type.enum";
import { TaskService } from "../../tasks/services/task.service";
import { PopUpRepository } from "../repositories/pop-up.repository";
import { CyclicalPopUpAllowHandlerService } from "./cyclical-pop-up-allow-handler.service";
import { CyclicalPopUpOnFinishHandlerService } from "./cyclical-pop-up-on-finish-handler.service";
import { PopUpMappingRepository } from "../repositories/pop-up-mapping.repository";

@Injectable()
export class CyclicalPopUpService implements OnModuleInit {
    private readonly logger = new Logger(CyclicalPopUpService.name);
    constructor(
        private readonly cyclicalPopUpRepository: CyclicalPopUpRepository,
        @Inject(
            forwardRef(() => PopUpsService)
        )
        private readonly popUpService: PopUpsService,
        private readonly taskService: TaskService,
        private readonly popUpRepository: PopUpRepository,
        private readonly cyclicalPopUpAllowHandlerService: CyclicalPopUpAllowHandlerService,
        private readonly cyclicalPopUpOnFinishHandlerService: CyclicalPopUpOnFinishHandlerService,
        private readonly popUpMappingRepository: PopUpMappingRepository
    ) {}
    async onModuleInit() {
        const pendingToRestore = await this.cyclicalPopUpRepository.getAllPending();
        pendingToRestore.forEach(pending => {
            const {
                FECHA_ULTIMO_CICLO
            } = pending;
            let lastCycleDatetime: Date | null = null;
            if (FECHA_ULTIMO_CICLO && FECHA_ULTIMO_CICLO !== '0000-00-00 00:00:00') {
                lastCycleDatetime = new Date(FECHA_ULTIMO_CICLO.replace(' ', 'T').concat('-05:00'))
            }
            const intervalMs = pending.INTERVALO_SEGUNDOS * 1000;
            const now = Date.now();
            let delay = 0;
            if (lastCycleDatetime) {
                const nextExecution = lastCycleDatetime.getTime() + intervalMs;
                delay = nextExecution - now;

                if (delay < 0) delay = 0;
            }
            setTimeout(() => {
                this.initCycle({
                    cycleId: pending.CODIGO,
                    popUpId: pending.CODIGO_NOTIFICACION,
                    cyclicalPopUpDto: {
                        jsonData: JSON.parse(pending.DATA_JSON),
                        message: pending.MENSAJE_NOTIFICACION,
                        title: pending.TITULO_NOTIFICACION,
                        secondsInterval: pending.INTERVALO_SEGUNDOS,
                        targetUserIds: pending.OBJETIVOS?.map(target => target.CODIGO_USUARIO_OBJETIVO) ?? [],
                        userId: pending.CODIGO_USUARIO_CREADOR,
                        subTypeId: pending.CODIGO_SUBTIPO_NOTIFICACION,
                        height: pending.ALTO_MODAL,
                        width: pending.ANCHO_MODAL
                    }
                }, true);
            }, delay);
        });
    }
    
    
    
    private async cycle(params: IInitCycleParams) {
        const cycle = await this.cyclicalPopUpRepository.getById(params.cycleId);
        if (!cycle || cycle?.TERMINADO) {
            this.logger.warn(`Ciclo para la notificacion con id '${params.popUpId}' con intervalo de ${params.cyclicalPopUpDto.secondsInterval} segundos fue cancelado por db`);
            return;
        }
        const {
            cyclicalPopUpDto: dto
        } = params;
        const canThrow = await this.cyclicalPopUpAllowHandlerService.canThrow(params);
        if (canThrow) {
            this.popUpService.throwPopUp({
                excludeLancher: false,
                message: dto.message,
                modalHeight: dto.height,
                modalWidth: dto.width,
                popUpId: params.popUpId,
                targetType: PopUpTargetTypeEnum.USERS,
                title: dto.title,
                targetPerfilId: null,
                targetUserIds: dto.targetUserIds,
            });
            await this.cyclicalPopUpRepository.addCycleIteration(params.cycleId);
            
            for (const userTargetId of params.cyclicalPopUpDto.targetUserIds ?? []) {
                await this.popUpRepository.addPopUpTarget({
                    popUpId: params.popUpId,
                    targetUserId: userTargetId,
                    userCreationId: params.cyclicalPopUpDto.userId,
                    originCycle: params.cycleId
                });
            }
            this.initCycle(params);
        } else {
            await this.cyclicalPopUpRepository.finishCycle(params.cycleId);
            await this.cyclicalPopUpOnFinishHandlerService.handle(params);
            if (params.cyclicalPopUpDto.validateByMapping) {
                await this.popUpService.killReferenceMap({
                    chrNotificationType: '4',
                    notificationSubTypeId: dto.subTypeId,
                    referenceCode: dto.referenceCode,
                    referenceCode2: dto.referenceCode2,
                    referenceCode3: dto.referenceCode3,
                    finisherUserId: 1
                });
            }
        }
    }
    async initCycle(params: IInitCycleParams, throwImmediately = false) {
        const {
            cyclicalPopUpDto: dto,
            popUpId
        } = params;
        let scheduledCreationDate = new Date();
        scheduledCreationDate.setSeconds(scheduledCreationDate.getSeconds() + dto.secondsInterval);
        if (!params.cycleId) {
            params.cycleId = (await this.cyclicalPopUpRepository.createCycle({
                jsonData: JSON.stringify(dto.jsonData),
                popUpId,
                secondsInterval: dto.secondsInterval
            })).id;
            scheduledCreationDate = new Date();
            // scheduledCreationDate.setSeconds(scheduledCreationDate.getSeconds() + 1);
        }
        if (throwImmediately) {
            scheduledCreationDate = new Date();
            // scheduledCreationDate.setSeconds(scheduledCreationDate.getSeconds() + 1);
        }
        
        this.taskService.program(
            'cyclePopUp' + params.cycleId.toString(),
            scheduledCreationDate,
            async () => {
                this.cycle(params);
            }
        )
    }   
}