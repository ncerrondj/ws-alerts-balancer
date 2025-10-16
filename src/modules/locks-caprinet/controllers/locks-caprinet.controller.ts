import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { LockCaprinetService } from '../services/lock-caprinet.service';
import { ProgramLockDto } from '../dtos/program-lock.dto';
import { GetLocksDto } from '../dtos/get-locks.dto';
import { KillMapReferencesDto } from '../dtos/kill-map-references.dto';
import { NotifyLocksCloseDto } from '../dtos/notify-locks-close.dto';
import { ReprogramLockByMapDto, ReprogramLockDto } from '../dtos/reprogram-lock.dto';

@Controller('locks-caprinet')
export class LocksCaprinetController {

  constructor(
    private readonly lockCaprinetService: LockCaprinetService
  ){}

  @Post('program-lock')
  async programLock(
    @Body() data: ProgramLockDto
  ) {
    return await this.lockCaprinetService.programLock(data);
  }

  @Get()
  async getLocks(
    @Query() query: GetLocksDto
  ) {
    return await this.lockCaprinetService.getLocks(query);
  }
  
  @Get('actives/:userTargetId')
  async getActivesLocksByTargetUserId(
    @Param('userTargetId') userTargetId: number,
  ) {
    return await this.lockCaprinetService.getActivesByUserTargetId(userTargetId);
  }

  @Post('killMapReferences')
  async killMapReferences(
    @Body() data: KillMapReferencesDto
  ) {
    return await this.lockCaprinetService.killMapReferences(data);
  }
  @Post('notify-locks-close')
  async notifyLocksClose(
    @Body() data: NotifyLocksCloseDto
  ) {
    return await this.lockCaprinetService.notifyLocksClose(data);
  }
  @Post('reprogram')
  async reprogram(
    @Body() data: ReprogramLockDto
  ) {
    return await this.lockCaprinetService.reprogram(data);
  }
  @Post('reprogram-by-map')
  async reprogramByMap(
    @Body() data: ReprogramLockByMapDto
  ){
    return await this.lockCaprinetService.reprogramByMap(data);
  }
  @Delete('cancel/:bkId')
  async cancel(
    @Param('bkId') bkId: number
  ) {
    return await this.lockCaprinetService.cancelLock(bkId);
  } 
}