import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { HttpClient } from '@angular/common/http';
import { filter } from 'rxjs';

@Component({
  selector: 'app-dashboardtwo',
  standalone: true,
  imports: [NgClass, RouterOutlet,RouterLink,RouterLinkActive],
  templateUrl: './dashboardtwo.component.html',
  styleUrl: './dashboardtwo.component.scss',
})
export class DashboardtwoComponent {
  isMenuVisible: boolean = false;
  currentRouteTitle: any;
  toggleMenu(): void {
    this.isMenuVisible = !this.isMenuVisible;
  }

  constructor(
    public auth: AuthService,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        let route = this.activatedRoute.firstChild;
        while (route?.firstChild) {
          route = route.firstChild;
        }
        this.currentRouteTitle =
          route?.snapshot.data['title'] || 'Default Title';
      });
  }

  // ngAfterViewInit(): void {
  //   this.initCharts();
  //   this.setWeatherData();
  // }

  // initCharts() {
  //   const ctx1 = document.getElementById('agriculturalSpendingChart') as HTMLCanvasElement;
  //   const myPieChart = new Chart(ctx1, {
  //     type: 'pie',
  //     data: {
  //       labels: ['Humidity', 'Cash', 'Agri/Retail', 'Data'],
  //       datasets: [{
  //         data: [75, 50, 30, 90],
  //         backgroundColor: ['#007bff', '#28a745', '#dc3545', '#17a2b8']
  //       }]
  //     },
  //     options: {
  //       responsive: true,
  //       plugins: {
  //         legend: {
  //           position: 'top',
  //         }
  //       }
  //     }
  //   });

  //   const ctx2 = document.getElementById('cropStatisticsChart') as HTMLCanvasElement;
  //   const myBarChart = new Chart(ctx2, {
  //     type: 'bar',
  //     data: {
  //       labels: ['Moi', 'Hu', 'Tem', 'NP', 'Cro', 'Dise', 'Pre'],
  //       datasets: [{
  //         label: 'Disease',
  //         data: [5, 10, 8, 12, 15, 6, 9],
  //         backgroundColor: '#e5e7eb',
  //         barPercentage: 0.6
  //       }, {
  //         label: 'Growth',
  //         data: [3, 7, 4, 10, 13, 5, 8],
  //         backgroundColor: '#e5e7eb',
  //         barThickness: 20,
  //         maxBarThickness: 30,

  //       }]
  //     },
  //     options: {
  //       responsive: true,
  //       scales: {
  //         y: {
  //           beginAtZero: true
  //         }
  //       },
  //       plugins: {
  //         legend: {
  //           position: 'top',
  //         }
  //       }
  //     }
  //   });
  // }

  // setWeatherData() {
  //   const weatherData = {
  //     location: "XYZ",
  //     temperature: "25°C",
  //     iconUrl: "https://via.placeholder.com/50"
  //   };

  //   document.querySelector(".weather-location")!.innerHTML = "Location: " + weatherData.location;
  //   document.querySelector(".weather-temperature")!.innerHTML = weatherData.temperature;
  //   (document.querySelector(".weather-card-content img") as HTMLImageElement).src = weatherData.iconUrl;
  // }
}
