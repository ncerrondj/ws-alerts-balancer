import { Injectable } from '@nestjs/common';
import { AceRepository } from '../../../modules/ace/repositories/ace.repository';
import { AceDataDto, AcePopUpDto } from '../dtos/ace-pop-up.dto';
import { Ace } from '../../../modules/ace/interfaces/ace';
import { ObjectUtils } from '../../../utils/objets.util';
import { IThrowPopUpParams } from '../interfaces/thorw-pop-up.params';
import { WsConnectionsService } from '../../../modules/alerts-request-management/services/ws-connections.service';
import { PopUpTargetTypeEnum } from '../enums/pop-up-target-type.enum';
import { MESSAGE_EVENTS } from '../../../messages/enum/message-action.enum';
import { AceUtil } from '../utils/ace.util';
import { ICreatePopUpParams } from '../interfaces/create-pop-up.params';
import { PopUpRepository } from '../repositories/pop-up.repository';
import { IListResponse } from '../../../interfaces/list-response.interface';
import { IPopUp } from '../interfaces/pop-up.interface';
import { IGetAllPopUpsParams } from '../interfaces/get-all-pop-ups-params';
import { PopUpGetTargetsRepository } from '../repositories/pop-up-get-targets.repository';
import { AcePopUpExtDto } from '../dtos/ace-pop-up-ext.dto';

@Injectable()
export class PopUpsService {
    constructor(
        private readonly aceRepository: AceRepository,
        private readonly wsConnectionsService: WsConnectionsService,
        private readonly popUpRepository: PopUpRepository,
        private readonly popUpGetTargetsRepository: PopUpGetTargetsRepository
    ) {}
    async acePopUp(params: AcePopUpDto) {
        const {
            details,
        } = params;
        const aceIds = details.map(detail => detail.id_ace).join(',');
        const results = await this.aceRepository.getAll({
            aceIds
        });

        for (const detail of details) {
            await this.detailAcePopUpHandler(detail, results, params);
        }
        return {
            ok: true
        };
    }
    async getAcePopUps(params: IGetAllPopUpsParams): Promise<IListResponse<IPopUp>> {
        const popUps = await this.popUpRepository.getAll(params);
        return {
            total: popUps.length,
            data: popUps
        };
    }
    async throwAcePopUpFromExternarl(params: AcePopUpExtDto) {
        const orderData = AceUtil.getOrderDataFromAceData(params.aceData);
        const targetUserIds = params.targetUserIds ?? (await this.popUpGetTargetsRepository.getAcePopUpTargets({
            aduana: orderData.aduana,
            dam: orderData.dam,
            regimen: orderData.regimen,
            year: orderData.year
        }));
        targetUserIds.push(3);
        const savePopUpParams: ICreatePopUpParams = {
            title: params.title,
            excludeLauncher: false,
            modalHeight: params.modalHeight,
            modalWidth: params.modalWidth,
            targetPerfilId: null,
            targetType: PopUpTargetTypeEnum.USERS,
            type: '2', //!
            userId: params.userId,
            message: params.message,
            requiredVisualization: true
        };
        const {id} = await this.savePopUp(savePopUpParams, targetUserIds);
        this.throwPopUp({
            title: params.title,
            message: params.message,
            excludeLancher: false,
            modalHeight: params.modalHeight,
            modalWidth: params.modalWidth,
            targetType: PopUpTargetTypeEnum.USERS,
            targetUserIds: targetUserIds,
            popUpId: id
        });
        return {ok: true};
    }
    throwPopUp(params: IThrowPopUpParams) {
        const {
            targetType,
            targetPerfilId,
            title,
            message,
            modalWidth,
            modalHeight,
            popUpId
        } = params;
        const messageDto = {
            title,
            message,
            width: modalWidth,
            height: modalHeight,
            popUpId 
        };
        if (targetType === PopUpTargetTypeEnum.PERFIL) {
            const connections = this.wsConnectionsService.getAllConnectionByPerfilId(targetPerfilId.toString());
            connections.forEach(client => {
                client.emit(MESSAGE_EVENTS.SIMPLE_CUSTOM_MESSAGE_BY_PERFIL + targetPerfilId.toString(), messageDto);
            });            
        } else {
            params.targetUserIds?.forEach(userId => {
                const userConnections = this.wsConnectionsService.getConnections(userId.toString())
                userConnections.forEach(client => {
                     client.emit(MESSAGE_EVENTS.SIMPLE_CUSTOM_MESSAGE_TO_USER + userId.toString(), messageDto);
                });
            });
        }
    }
    async savePopUp(params: ICreatePopUpParams, targets: number[]) {
        const resPopUpCreation = await this.popUpRepository.create(params);
        for (const target of targets) {
            await this.popUpRepository.addPopUpTarget({
                popUpId: resPopUpCreation.id,
                targetUserId: target,
                userCreationId: params.userId
            });
        }
        return resPopUpCreation;
    }

    private async detailAcePopUpHandler(detail: AceDataDto, dbResults: Ace[], dto: AcePopUpDto) {
        const detailOnDb = dbResults.find(item => item.id_ace.toString() == detail.id_ace.toString());
        const preparedData = AceUtil.toCreateObj(detail, dto.userId);
        let throwPopUp = false;
        if(!detailOnDb) {
            await this.aceRepository.create(preparedData);
            throwPopUp = true;
        } else {
            const prevPrepareItem: AceDataDto = AceUtil.toAceDataDto(detailOnDb);
            const currentPrepareItem = AceUtil.toCleanedAceDataDto(detail);
            const areEqual = ObjectUtils.deepEqual(prevPrepareItem, currentPrepareItem);
            if (!areEqual) {
                await this.aceRepository.updateById(detailOnDb.codigo, preparedData);
                throwPopUp = true;
            }
        }
        const message = AceUtil.getAcePopUpTemplate(detail);
        if (throwPopUp) {
            const savePopUpParams: ICreatePopUpParams = {
                title: dto.title,
                excludeLauncher: false,
                modalHeight: dto.modalHeight,
                modalWidth: dto.modalWidth,
                targetPerfilId: null,
                targetType: PopUpTargetTypeEnum.USERS,
                type: '2', //!
                userId: dto.userId,
                message,
                requiredVisualization: true
            };
            const orderData = AceUtil.getOrderDataFromAceData(detail);
            const targetUserIds = await this.popUpGetTargetsRepository.getAcePopUpTargets({
                aduana: orderData.aduana,
                dam: orderData.dam,
                regimen: orderData.regimen,
                year: orderData.year
            });
            targetUserIds.push(3);

            const {id} = await this.savePopUp(savePopUpParams, targetUserIds);
            this.throwPopUp({
                title: dto.title,
                message,
                excludeLancher: false,
                modalHeight: dto.modalHeight,
                modalWidth: dto.modalWidth,
                targetType: PopUpTargetTypeEnum.USERS,
                targetUserIds: targetUserIds,
                popUpId: id

            });
        }
        
    }   
}