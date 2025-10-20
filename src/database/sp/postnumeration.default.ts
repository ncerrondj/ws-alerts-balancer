import { IOpePostNumerationSpParams } from "./interfaces/ope-postnumeration-params.sp";

export class PostNumerationSpDefaults {
    static readonly opePostNumeration: IOpePostNumerationSpParams = {
        condition: null,
        liquidatorUserId: null,
        requestNumerationId: null,
        reviewerUserId: null,
        statusCode: null,
        subTypeId: null,
        userId: null
    };
}