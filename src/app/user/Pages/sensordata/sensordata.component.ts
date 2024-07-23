import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-sensordata',
  templateUrl: './sensordata.component.html',
  styleUrl: './sensordata.component.scss',
  animations: [
    trigger('scroll', [
      state('start', style({ transform: 'translateY(0)' })),
      state('end', style({ transform: 'translateY(-100%)' })),
      transition('start <=> end', animate('20s linear')),
    ])
  ]
})
export class SensordataComponent {

  scrollState = 'start';
  sensorLatestData: any;
  currentTab: string = 'all';
  showTab(tabName: string) {
    this.currentTab = tabName;
  }


  constructor(private userService: UserService) {
    this.userService.GetSensorLatestData().subscribe((res: any) => {
      this.sensorLatestData = res;
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      [
        this.scrollState = this.scrollState === 'start' ? 'end' : 'start'
      ]
    }, 5000)
  }
}
