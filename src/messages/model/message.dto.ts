export class MessageDto {
  message: string = 'Mensaje vacío';
  title: string = 'Título vacío';
  userIdsToExcludeOfNotification?: string[] = [];
  targetUserIds: string[] = [];
  targetType: 'U' | 'P' = 'P';
  width?: string;
  height?: string;
}