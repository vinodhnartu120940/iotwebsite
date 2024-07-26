import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { UserService } from '../../user.service';

@Component({
  selector: 'app-dashboardtwo',
  standalone: true,
  imports: [NgClass, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboardtwo.component.html',
  styleUrl: './dashboardtwo.component.scss',
})
export class DashboardtwoComponent implements OnInit {
  isMenuVisible: boolean = false;
  currentRouteTitle: any;
  toggleMenu(): void {
    this.isMenuVisible = !this.isMenuVisible;
  }

  constructor(
    public auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public userService: UserService
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
  ngOnInit(): void {
    this.userService.GetUserInfo();
  }
}
