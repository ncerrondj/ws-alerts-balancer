import { Injectable } from "@nestjs/common";
import { PendingRegularizationRepository } from "../../../modules/pending-regularization/repositories/pending-regularization.repository";
import { ICanThrowLockParams } from "../interfaces/can-throw-lock.params";

@Injectable()
export class LocksPostponementManagerService {
    
    constructor(
        private readonly pendingRegularizationRepo: PendingRegularizationRepository
    ){}

    async canThrowLock(params: ICanThrowLockParams) {
        const mapping: {[k: string]: (p: ICanThrowLockParams) => Promise<boolean>} = {
            7114: this.pendingRegularizacion7114.bind(this)
        };
        const handler = mapping[params.lockTypeId];
        
        if (!handler) return true;
        try {
            return await handler(params);    
        } catch (error) {
            console.log({error});
            return false;
        }
        
    }
    private async pendingRegularizacion7114(params: ICanThrowLockParams): Promise<boolean> {
        const val = await this.pendingRegularizationRepo.canThrowAlerta(+params.data.cancelMap.referenceCode);
        return val;
    }
}