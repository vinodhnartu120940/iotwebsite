import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private apiUrl = 'https://internalportaldevapi.smbxl.com'
  constructor(private http:HttpClient) {
    
  }

  addNewCalendarEvent(event:any){
    return this.http.post(`${this.apiUrl}/api/Calendar/SaveUserCalendarEvents`,event);
  }
  getCalendarEvents(){
    return this.http.get(`${this.apiUrl}/api/Calendar/GetCalendarEvents`);
  }
  deleteCalendarEvent(event:any){
    return this.http.delete(this.apiUrl,event);
  }
}
