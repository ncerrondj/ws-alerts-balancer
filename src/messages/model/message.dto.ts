export class MessageDto {
  message: string = 'Mensaje vacío';
  title: string = 'Título vacío';
  userIdsToExcludeOfNotification?: number[] = [];
  targetUserIds: number[] = [];
  targetType: 'U' | 'P' = 'P';
  width?: number;
  height?: number;
  userId: number;
}