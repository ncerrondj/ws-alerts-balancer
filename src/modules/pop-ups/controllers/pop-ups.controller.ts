import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AcePopUpDto } from "../dtos/ace-pop-up.dto";
import { PopUpsService } from "../services/pop-ups.service";
import { IGetAllPopUpsParams } from "../interfaces/get-all-pop-ups-params";
import { AcePopUpExtDto } from "../dtos/ace-pop-up-ext.dto";
import { MessageDto } from "../../../messages/model/message.dto";
import { CyclicalPopUpDto } from "../../../messages/model/cyclical-pop-up.dto";

@Controller('pop-up')
export class PopUpsController {

    constructor(
        private readonly popUpService: PopUpsService
    ){}

    // @Post('ace')
    // async acePopUp(
    //     @Body() dto: AcePopUpDto
    // ) {
    //     return await this.popUpService.acePopUp(dto);
    // }
    @Post('ace')
    async acePopUp(
        @Body() dto: AcePopUpExtDto
    ) {
        return await this.popUpService.throwAcePopUpFromExternarl(dto);
    }

    @Post()
    async popUp(
        @Body() dto: MessageDto
    ) {
        return await this.popUpService.popUp(dto);
    }

    @Post('cyclical')
    async ciclicalPopUp(
        @Body() dto: CyclicalPopUpDto
    ) {
        return await this.popUpService.cyclicalPopUp(dto);
    }

    @Get('ace')
    async getAcePopUps(
        @Query() query: IGetAllPopUpsParams
    ) {
        return await this.popUpService.getAcePopUps(query);
    }
}