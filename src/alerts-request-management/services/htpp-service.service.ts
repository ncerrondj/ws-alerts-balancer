import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { HttpPostParams } from './interfaces/http-post-params';

@Injectable()
export class HttpServiceImpl {
  private baseUrl: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ){
    this.baseUrl = configService.get<string>('BACKEND_URL');
    console.log({
      backend: this.baseUrl
    });
  }

  async post<T, R>({path, data}: HttpPostParams<T>): Promise<R> {
    const response = await firstValueFrom(
      this.httpService.post(this.baseUrl + '/' + path, data)
    );
    return response.data as R;
  }
  
}