import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiHttpService } from '../../Services/api.http.service';
import { APIEndPoints } from '../../utils/api-endpoint';
@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  //private apiUrl = 'https://localhost:7090'
  constructor(private http:ApiHttpService) {
    
  }

  addNewCalendarEvent(event:any){
    return this.http.post(`${APIEndPoints.Calander}/SaveUserCalendarEvents`,event);
  }
  getCalendarEvents(){
    return this.http.get(`${APIEndPoints.Calander}/GetCalendarEvents`);
  }
  deleteCalendarEvent(eventId:any){
    return this.http.delete(`${APIEndPoints.Calander}/DeleteCalendarEvent/${eventId}`,eventId);
  }
}
