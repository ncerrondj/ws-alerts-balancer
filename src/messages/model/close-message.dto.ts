import { SuscribePayload } from "../../modules/alerts-request-management/model/suscribe.payload";

export class CloseMessageDto extends SuscribePayload {
  popUpId: number;
}