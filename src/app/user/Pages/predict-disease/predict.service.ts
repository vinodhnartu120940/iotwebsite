import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { APIEndPoints } from '../../../utils/api-endpoint';
import { ApiHttpService } from '../../../Services/api.http.service';

@Injectable({
  providedIn: 'root',
})
export class PredictService {
  constructor(private http: ApiHttpService) {}

  uploadFile(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<any>(`${APIEndPoints.Prediction}/predict`, formData);
  }
  LeafDetection(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<any>(
      `${APIEndPoints.Prediction}/LeafDetection`,
      formData
    );
  }

  GetDiseases() {
    return this.http.get(`${APIEndPoints.Data}/GetDiseases`);
  }
}
