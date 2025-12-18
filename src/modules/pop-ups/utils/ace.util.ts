import { ICreateAceParams } from "../../../modules/ace/interfaces/create-ace.params";
import { AceDataDto } from "../dtos/ace-pop-up.dto";
import { Ace } from "../../../modules/ace/interfaces/ace";
import { DbUtils } from "../../../database/utils/db.utils";

export class AceUtil {
    static getAcePopUpTemplate(ace: AceDataDto) {
        const dam = ace.numero_unidad_seleccion.replace(/ {2}/g, ' ');
        return `
            <style>
                /* Reset controlado solo para el documento ACE */
                .ace-documento *,
                .ace-documento *::before,
                .ace-documento *::after {
                    box-sizing: border-box;
                    font-family: Arial, Helvetica, sans-serif;
                }

                /* Contenedor principal */
                .ace-documento {
                    max-width: 900px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border: 1px solid #cfcfcf;
                }

                /* ================= HEADER ================= */

                .ace-header {
                    background-color: #0b5fa5;
                    color: #ffffff;
                    padding: 20px;
                }

                .ace-header-titulo {
                    font-size: 18px;
                    font-weight: bold;
                    margin: 0 0 6px 0;
                }

                .ace-header-ace {
                    font-size: 13px;
                    margin-bottom: 4px;
                }

                .ace-header-tipo {
                    font-size: 13px;
                    font-weight: bold;
                }

                .ace-header-fecha {
                    margin-top: 10px;
                    font-size: 12px;
                }

                /* ================= CUERPO ================= */

                .ace-contenido {
                    padding: 25px;
                    font-size: 13px;
                    color: #000000;
                }

                .ace-parrafo {
                    margin-bottom: 12px;
                    text-align: justify;
                }

                .ace-datos-identificacion {
                    margin-bottom: 15px;
                }

                .ace-datos-identificacion strong {
                    font-weight: bold;
                }

                /* ================= LISTA ================= */

                .ace-lista-acciones {
                    margin-left: 20px;
                    padding-left: 10px;
                }

                .ace-lista-acciones li {
                    margin-bottom: 14px;
                }

                .ace-bloque-datos {
                    margin-top: 10px;
                    margin-left: 10px;
                }

                .ace-bloque-datos p {
                    margin: 4px 0;
                }

                /* ================= SEPARADOR ================= */

                .ace-separador {
                    border-top: 1px solid #000000;
                    margin: 25px 0;
                }

                /* ================= CONTACTO ================= */

                .ace-contacto {
                    font-size: 12px;
                }

                /* ================= FOOTER ================= */

                .ace-footer {
                    background-color: #b0123b;
                    color: #ffffff;
                    padding: 12px 20px;
                    font-size: 12px;
                    font-weight: bold;
                }
                .t-justify {
                    text-align: justify;                
                }
                /* ================= RESPONSIVE ================= */

                @media (max-width: 768px) {
                    .ace-documento {
                        border: none;
                    }

                    .ace-header {
                        padding: 15px;
                    }

                    .ace-header-titulo {
                        font-size: 16px;
                    }

                    .ace-contenido {
                        padding: 18px;
                        font-size: 12.5px;
                    }
                }

                @media (max-width: 480px) {
                    .ace-header-titulo {
                        font-size: 15px;
                    }

                    .ace-header-ace,
                    .ace-header-tipo,
                    .ace-header-fecha {
                        font-size: 12px;
                    }

                    .ace-contenido {
                        padding: 15px;
                    }

                    .ace-lista-acciones {
                        margin-left: 10px;
                    }
                }
            </style>
            <div class="ace-documento">
                <!-- HEADER -->
                <div class="ace-header">
                    <div class="ace-header-titulo">
                        Comunicación de una Acción de Control Extraordinario
                    </div>
                    <div class="ace-header-ace">
                        N° de ACE: ${ace.nro_ace}
                    </div>
                    <div class="ace-header-tipo">
                        Tipo de Acción: INSPECCION DE MERCANCIA
                    </div>
                    <div class="ace-header-fecha">
                        Fecha de Emisión: ${ace.fecha_registro}
                    </div>
                </div>

                <!-- CONTENIDO -->
                <div class="ace-contenido">

                    <div class="ace-datos-identificacion ace-parrafo">
                        <strong>RUC:</strong> 20254913531 - <strong>Sres.</strong> ADUANERA CAPRICORNIO S.A AG DE ADUANA<br>
                        <strong>Referencia: DAM N° ${dam}</strong> 
                    </div>

                    <div class="ace-datos-identificacion ace-parrafo">                        
                        <strong>HORA REGISTRO:</strong> ${ace.hora_registro}
                        <br>
                        
                        <strong>ESTADO TABLA:</strong> ${ace.estado_tabla}
                        <br>

                        <strong>ID ACE:</strong> ${ace.id_ace}
                        <br>

                        <strong>FLUJO CONTROL:</strong> ${ace.flujo_control}
                        <br>

                        <strong>ESTADO DETALLE:</strong> ${ace.estado_detalle}
                        <br>

                        <strong>FUNCIONARIO ASIGNADO:</strong> ${ace.funcionario_asignado}
                        <br>

                        <strong>UNIDAD SELECCIÓN:</strong> ${ace.unidad_seleccion}
                        <br>

                        <strong>MOMENTO COMUNICACIÓN:</strong> ${ace.momento_comunicacion}
                        <br>

                        <strong>FECHA HORA COMUNICACIÓN:</strong> ${ace.fecha_hora_comunicacion}
                        <br>

                        <strong>TIPO LUGAR INSPECCION:</strong> ${ace.tipo_lugar_inspeccion}
                        <br>

                        <strong>RUC INSPECCION:</strong> ${ace.ruc_inspeccion}
                        <br>

                        <strong>RAZON SOCIAL INSPECCION:</strong> ${ace.razon_social_inspeccion}
                        <br>

                        <strong>DIRECCIÓN INSPECCION:</strong> ${ace.direccion_inspeccion}
                        <br>
                    </div>

                    <p class="ace-parrafo">
                        En el marco de las Acciones de Control Extraordinarias ejecutadas por la SUNAT, conforme a lo señalado en la
                        Ley General de Aduanas, aprobado por Decreto Legislativo N° 1053 y modificatorias, y su Reglamento aprobado
                        con Decreto Supremo N° 010-2009-EF y modificatorias, se le comunica que se dispone la ejecución de tipo
                        INSPECCION DE MERCANCIA para DAM N° ${dam}, la misma que se encuentra a cargo de la
                        SECCION DE ACCIONES MASIVAS - INTENDENCIA NACIONAL DE CONTROL ADUANERO.
                    </p>

                    <p class="ace-parrafo"><strong>En ese sentido:</strong></p>

                    <ol class="ace-lista-acciones">
                        <li class="t-justify">
                            Se dispone la Inmovilización para Acción de Control Extraordinario de la mercancía. Razón por la cual,
                            no se podrá entregar o disponer de dicha carga hasta que la autoridad aduanera haya ejecutado la ACE y
                            dejado sin efecto la referida inmovilización.

                            <div class="ace-bloque-datos">
                                <p><strong>N° de Declaración:</strong> ${dam}</p>
                                <p><strong>Agencia de Aduanas / Empresa de Mensajería:</strong> ADUANERA CAPRICORNIO S.A AG DE ADUANA</p>
                                <p><strong>RUC Agencia de Aduanas / Empresa de Mensajería:</strong> 2069413931</p>
                            </div>
                        </li>

                        <li class="t-justify">
                            Deberá brindar a la autoridad aduanera las facilidades logísticas necesarias para la ejecución oportuna
                            de la referida ACE. Asimismo, de ser requerido, deberá proporcionar a la autoridad aduanera la información
                            o documentación sustentatoria que ampara y/o que es exigible según el régimen de la mercancía.
                        </li>
                    </ol>

                    <p class="ace-parrafo">
                        El incumplimiento de la presente dará lugar a la aplicación de sanciones previstas en el marco normativo
                        vigente, el mismo que se encuentra indicado en el primer párrafo de la presente.
                    </p>

                    <div class="ace-separador"></div>

                    <p class="ace-contacto ace-parrafo">
                        Para cualquier consulta contactarse con <strong>RUBEN ARECOCHEA RODRIGUEZ</strong> a la central telefónica
                        o al correo electrónico
                        <a>sam-inca@sunat.gob.pe</a>
                        o al (los) teléfono(s) <strong>943154770</strong>.
                    </p>

                    <p class="ace-contacto ace-parrafo">
                        Atentamente
                    </p>

                </div>

                <!-- FOOTER -->
                <div class="ace-footer">
                    SUNAT/Aduanas
                </div>

            </div>

        `;
    }
    static toCreateObj(dto: AceDataDto, userId: number): ICreateAceParams {
        return {
            aceCommunicationDatetime: dto.fecha_hora_comunicacion,
            aceCommunicationMoment: dto.momento_comunicacion,
            aceId: +dto.id_ace,
            aceNumber: dto.nro_ace,
            aceSelectedUnity: dto.unidad_seleccion,
            aceSelectedUnityNumber: dto.numero_unidad_seleccion,
            aceStatusDetail: dto.estado_detalle,
            aceStatusTable: dto.estado_tabla,
            controlFlujoAce: dto.flujo_control,
            dataRegisterDate: DbUtils.toMysqlDate(dto.fecha_registro),
            dataRegisterTime: dto.hora_registro,
            direccionInspeccionAce: dto.direccion_inspeccion,
            funcionarioAsignadoAce: dto.funcionario_asignado,
            razonSocialInspeccionAce: dto.razon_social_inspeccion,
            rucInspeccionAce: dto.ruc_inspeccion,
            tipoLugarInspeccionAce: dto.tipo_lugar_inspeccion,
            userId
        };
    }
    static toAceDataDto(dbData: Ace): AceDataDto {
        return {
            nro_ace: dbData.nro_ace.toString(),
            fecha_registro: DbUtils.toNormalDate(dbData.fecha_registro),
            hora_registro: DbUtils.toBasicHour(dbData.hora_registro),
            estado_tabla: dbData.estado_tabla,
            id_ace: dbData.id_ace.toString(),
            flujo_control: dbData.flujo_control,
            estado_detalle: dbData.estado_detalle,
            funcionario_asignado: dbData.funcionario_asignado,
            unidad_seleccion: dbData.unidad_seleccion,
            numero_unidad_seleccion: dbData.numero_unidad_seleccion,
            momento_comunicacion: dbData.momento_comunicacion,
            fecha_hora_comunicacion: dbData.fecha_hora_comunicacion,
            tipo_lugar_inspeccion: dbData.tipo_lugar_inspeccion,
            ruc_inspeccion: dbData.ruc_inspeccion,
            razon_social_inspeccion: dbData.razon_social_inspeccion,
            direccion_inspeccion: dbData.direccion_inspeccion
        };
    }
    static toCleanedAceDataDto(aceData: AceDataDto): AceDataDto {
        return {
            nro_ace: aceData.nro_ace,
            fecha_registro: aceData.fecha_registro,
            hora_registro: aceData.hora_registro,
            estado_tabla: aceData.estado_tabla,
            id_ace: aceData.id_ace,
            flujo_control: aceData.flujo_control,
            estado_detalle: aceData.estado_detalle,
            funcionario_asignado: aceData.funcionario_asignado,
            unidad_seleccion: aceData.unidad_seleccion,
            numero_unidad_seleccion: aceData.numero_unidad_seleccion,
            momento_comunicacion: aceData.momento_comunicacion,
            fecha_hora_comunicacion: aceData.fecha_hora_comunicacion,
            tipo_lugar_inspeccion: aceData.tipo_lugar_inspeccion,
            ruc_inspeccion: aceData.ruc_inspeccion,
            razon_social_inspeccion: aceData.razon_social_inspeccion,
            direccion_inspeccion: aceData.direccion_inspeccion
        }
    }
    static getOrderDataFromAceData(aceData: AceDataDto) {
        const numberData = aceData.numero_unidad_seleccion.replace(/ /g, '');
        const sectionedData = numberData.split('-');
        const aduana = sectionedData[0];
        const year = sectionedData[1];
        const regimen = sectionedData[2];
        const dam = sectionedData[3];
        if (!dam) return null;
        return {
            aduana,
            year,
            regimen,
            dam
        };
    }
}