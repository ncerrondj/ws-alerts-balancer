export interface IThrowCyclicalPopUpParams {
    title: string;
    message: string;
    // targetType: PopUpTargetTypeEnum;
    targetUserIds?: number[];
    modalWidth: number;
    modalHeight: number;
    popUpId: number;
    popUp: any;
    jsonData: any;
}