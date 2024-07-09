import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { HttpClient } from '@angular/common/http';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  // animations: [
  //   trigger('scroll', [
  //     state('start', style({ transform: 'translateY(0)' })),
  //     state('end', style({ transform: 'translateY(-100%)' })),
  //     transition('start <=> end', animate('20s linear')),
  //   ])
  // ]
})
export class DashboardComponent implements OnInit {
  currentRouteTitle: any;

  constructor(private auth: AuthService, private http: HttpClient, private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      let route = this.activatedRoute.firstChild;
      while (route?.firstChild) {
        route = route.firstChild;
      }
      this.currentRouteTitle = route?.snapshot.data['title'] || 'Default Title';
    });

  }

  ClimateData: any;
  myDate: Date = new Date();
  state: any;
  country: any;
  // ngOnInit(): void {
  //   this.auth.getClimateData().subscribe(res => {
  //     this.ClimateData = res;
  //   })
  //   this.getLocation();
  // }
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Call reverse geocoding API
        this.http.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          .subscribe((data: any) => {
            const address = data.address;
            this.state = address.state;
            this.country = address.country;

            console.log("State: " + this.state);
            console.log("Country: " + this.country);
          }, (error) => {
            console.log("Error fetching data:", error);
          });
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }









  ngOnInit() {
    //   this.router.events.pipe(
    //     filter(event => event instanceof NavigationEnd)
    //   ).subscribe(() => {
    //     let route = this.activatedRoute.firstChild;
    //     while (route?.firstChild) {
    //       route = route.firstChild;
    //     }
    //     this.currentRouteTitle = route?.snapshot.data['title'] || 'Default Title';
    //   });
    // }
    //   this.router.events.subscribe(
    //     value => {
    //       if (value instanceof NavigationEnd)
    //         console.log(this.router.url.toString());
    //     });
  }
}
