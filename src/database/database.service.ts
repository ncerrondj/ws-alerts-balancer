import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPool, Pool } from 'mysql2/promise';
import { DbUtils } from './utils/db.utils';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {

  constructor(
    private readonly configService: ConfigService, 
  ) {
    this.pool = createPool({
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      user: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
      dateStrings: true,
      connectionLimit: 10
    });
  }
  private pool: Pool;

  onModuleInit() {
    
  }
  async onModuleDestroy() {
    await this.pool.end();
  }

  async callProcedure(spName: string, params: any[] = []): Promise<any> {
    params = params?.map(DbUtils.spParamBooleanHandler);
    const [rows] = await this.pool.query(`CALL ${spName}(${params.map(() => '?').join(',')})`, params);
    return rows;
  }
  
}