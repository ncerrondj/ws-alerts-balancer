import { SuscribePayload } from './suscribe.payload';

export class EmitAlertMessagePayload extends SuscribePayload {
  codigoTipoAlerta: number;
  codigoUsuarioOrigen: number;
  titulo: string;
  urlRedireccion: string;
  fechaAutodestruccion: string;
  data: any;
  codigoAlerta: string;
  codigosUsuariosObjetivos: number[]
}