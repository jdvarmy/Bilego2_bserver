import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import * as qs from 'qs';
import { BILEGO_URL } from '../constants/env';

@Injectable()
export class ApiService {
  apiUrl = BILEGO_URL;

  constructor(private readonly httpService: HttpService) {}

  get<T>(url: string, options?: any, config?: AxiosRequestConfig) {
    return new Promise<T>((resolve, reject) => {
      let fullUrl = `${this.apiUrl}/${url}`;

      if (options) {
        fullUrl += qs.stringify(options, { addQueryPrefix: true });
      }

      this.httpService.get<T>(fullUrl, config).subscribe(
        ({ data }) => resolve(data as T),
        (err) => reject(err),
      );
    });
  }

  post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return new Promise<T>((resolve, reject) => {
      this.httpService.post<T>(`${this.apiUrl}/${url}`, data, config).subscribe(
        ({ data }) => resolve(data as T),
        (err) => reject(err),
      );
    });
  }
}
