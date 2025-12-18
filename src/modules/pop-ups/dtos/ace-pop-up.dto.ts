import { PopUpOperationTypeEnum } from "../enums/pop-up-operation-types.enum";
import { PopUpTargetTypeEnum } from "../enums/pop-up-target-type.enum";

export class AcePopUpDto {
    userId: number;
    //code?: number;
    //operationType?: PopUpOperationTypeEnum;
    //targetType: PopUpTargetTypeEnum;
    title: string;
    //message: string;
    //targetPerfilId?: number;
    //excludeLauncher: boolean; // 1 o 0
    //targetUserIds: number[];
    modalWidth: number;
    modalHeight: number;
    details: AceDataDto[];
}
export class AceDataDto {
    nro?: string;
    nro_ace: string;
    fecha_registro: string;
    hora_registro: string;
    estado_tabla: string;
    id_ace: string;
    flujo_control: string;
    estado_detalle: string;
    funcionario_asignado: string;
    unidad_seleccion: string;
    numero_unidad_seleccion: string;
    momento_comunicacion: string;
    fecha_hora_comunicacion: string;
    tipo_lugar_inspeccion: string;
    ruc_inspeccion: string;
    razon_social_inspeccion: string;
    direccion_inspeccion: string;
}