import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  private apiUrl = 'https://internalportaldevapi.smbxl.com/Prediction/predict';
  constructor(private http: HttpClient) { }
  uploadFile(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<any>(this.apiUrl, formData);
  }
}
