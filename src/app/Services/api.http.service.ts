import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable()
export class ApiHttpService {
  public readonly AUTHORISATION: string = 'Authorization';
  public readonly BEARER: string = 'bearer';
  private readonly DATA_RESP: string = 'json';
  public tokenData: any;
  constructor(private _httpClient: HttpClient) {}

  public get<T>(requestUrl: string): Observable<any> {
    let options: any = this.getHeaders();
    return this._httpClient.get(environment.serviceURL + requestUrl, options);
  }
  public getExt<T>(requestUrl: string): Observable<any> {
    let options: any = this.getHeaders();
    console.log('Request URL', requestUrl);
    return this._httpClient.get(requestUrl, options);
  }
  public delete<T>(requestUrl: string, event: any): Observable<any> {
    let options: any = this.getHeaders();
    return this._httpClient.delete(
      environment.serviceURL + requestUrl,
      options
    );
  }
  public post<T>(requestUrl: string, requestBody: T): Observable<any> {
    let options: any = this.getHeaders();
    return this._httpClient.post(
      environment.serviceURL + requestUrl,
      requestBody,
      options
    );
  }

  public patch<T>(requestUrl: string, requestBody: T): Observable<any> {
    let options: any = this.getHeaders();
    return this._httpClient.patch(
      environment.serviceURL + requestUrl,
      requestBody,
      options
    );
  }
  public put<T>(requestUrl: string, requestBody: T): Observable<any> {
    let options: any = this.getHeaders();
    return this._httpClient.put(
      environment.serviceURL + requestUrl,
      requestBody,
      options
    );
  }
  getImage(imageUrl: string): Observable<Blob> {
    return this._httpClient.get(imageUrl, { responseType: 'blob' });
  }
  public getHeaders() {
    let headerOptions: HttpHeaders = new HttpHeaders()
      .set('Allow-Control-Allow-Origin', '*')
      .set(
        'Access-Control-Allow-Headers',
        'Content-Type,Access-Control-Allow-Headers,Authorisation,x-Requested-with'
      )
      .set('Access-Control-Allow-Methods', 'DELETE,POST,GET,OPTIONS,PUT');
    return { headers: headerOptions, responseType: this.DATA_RESP };
  }

  public handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occured:', error.error.message);
    } else {
      console.error('Backend returned code :', error.status);
    }
    return throwError('something bad happened: please try again later.');
  }
}
