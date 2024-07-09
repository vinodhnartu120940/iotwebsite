import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

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



  ngOnInit(): void {
    // setInterval(() => {
    //   this.scrollState = this.scrollState === 'start' ? 'end' : 'start';    
    // }, 5000); // Adjust interval as needed
    setTimeout(() => {
      [
        this.scrollState = this.scrollState === 'start' ? 'end' : 'start'
      ]
    }, 5000)
  }
}
