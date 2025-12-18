import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AcePopUpDto } from "../dtos/ace-pop-up.dto";
import { PopUpsService } from "../services/pop-ups.service";
import { IGetAllPopUpsParams } from "../interfaces/get-all-pop-ups-params";

@Controller('pop-up')
export class PopUpsController {

    constructor(
        private readonly popUpService: PopUpsService
    ){}

    @Post('ace')
    async acePopUp(
        @Body() dto: AcePopUpDto
    ) {
        return await this.popUpService.acePopUp(dto);
    }

    @Get('ace')
    async getAcePopUps(
        @Query() query: IGetAllPopUpsParams
    ) {
        return await this.popUpService.getAcePopUps(query);
    }
}