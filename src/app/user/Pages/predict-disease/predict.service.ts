import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PredictService {
  constructor(private http: HttpClient) { }

  uploadFile(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<any>(
      `${environment.serviceUrl}/Prediction/predict`,
      formData
    );
  }
  LeafDetection(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<any>(
      `${environment.serviceUrl}/Prediction/LeafDetection`,
      formData
    );
  }

  GetDiseases() {
    return this.http.get(`${environment.serviceUrl}/Data/GetDiseases`);
  }
}
