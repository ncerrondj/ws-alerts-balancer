export class MessageDto {
  message: string = 'Mensaje vacío';
  title: string = 'Título vacío';
  userIdsToExcludeOfNotification?: string[] = [];
}