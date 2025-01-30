import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { WsConnectionsService } from './ws-connections.service';

@Injectable()
export class AlertsBodyCacheService implements OnModuleInit {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly wsConnectionsService: WsConnectionsService,
  ) {}
  onModuleInit() {
    this.cacheManager.reset();
  }
  async getAlertBodyByUserIdFromCache(userId: string) {
    const clientParameters =
      this.wsConnectionsService.getClientParameters(userId);
    if (!clientParameters) {
      return null;
    }
    const isSet = await this.cacheManager.get<boolean>(userId + '_is_set');
    console.log({ isSet });
    if (!isSet) {
      return null;
    }
    try {
      const body = await this.cacheManager.get<string>(userId);
      return JSON.parse(body);
    } catch {
      this.cacheManager.del(userId);
      this.cacheManager.del(userId + '_is_set');
      return null;
    }
  }
  async rawCache(userId: string) {
    return JSON.parse(await this.cacheManager.get(userId));
  }
  async setAlertBodyByUserIdInCache(userId: string, body: any) {
    await this.cacheManager.set(userId, JSON.stringify(body));
    await this.cacheManager.set(userId + '_is_set', true);
    this.wsConnectionsService.setLastTimeCached(userId);
    return { success: true, message: 'Body setted in cache' };
  }
}
