export enum OpePostNumerationConditions {
  LIST_PENDING = 'P',
  GET_ORDERS_FROM_LOCKS = 'O'
} 
export interface IOpePostNumerationSpParams {
    condition: OpePostNumerationConditions;
    userId: number,
    liquidatorUserId: number,
    reviewerUserId: number,
    statusCode: number,
    subTypeId: number
    requestNumerationId: number,
}