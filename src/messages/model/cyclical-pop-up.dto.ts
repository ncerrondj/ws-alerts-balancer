export class CyclicalPopUpDto {
  message: string = 'Mensaje vacío';
  title: string = 'Título vacío';
  targetUserIds: number[] = [];
  width?: number;
  height?: number;
  userId: number;
  jsonData: any;
  subTypeId: number;
  secondsInterval: number;
  validateByMapping?: boolean;
  referenceCode?: string;
  referenceCode2?: string;
  referenceCode3?: string;
}