import { SuscribePayload } from './suscribe.payload';
export class AlertTargets {
  codigosUsuariosObjetivos: string[];
  codigosPerfilesObjectivos: string[];
  codigosAreasObjetivos: string[]
}
export class MapeoFinalizacion {
  codigoReferencia: string;
  codigoReferencia2: string;
}
export class EmitAlertMessagePayload extends SuscribePayload {
  codigoTipoAlerta: number;
  codigoUsuarioOrigen: number;
  titulo: string;
  urlRedireccion: string;
  fechaAutoDestruccion: string;
  data: any;
  codigoAlerta: string;
  codigoPlantilla: string;
  objetivos: AlertTargets;
  mapeoFinalizacion: MapeoFinalizacion;
  fechaHoraProgramacion?: string;
  informacionAdicional: string;
}
