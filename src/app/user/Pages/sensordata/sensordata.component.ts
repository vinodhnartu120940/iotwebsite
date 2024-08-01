import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnDestroy,
} from '@angular/core';
import { UserService } from '../../user.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-sensordata',
  templateUrl: './sensordata.component.html',
  styleUrls: ['./sensordata.component.scss'],
})
export class SensordataComponent implements AfterViewChecked, OnDestroy {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef;
  currentTab: string = 'all';
  sensorLatestData: any;
  chart: Chart | undefined;

  constructor(private userService: UserService) {
    this.userService.GetSensorLatestData().subscribe((res: any) => {
      this.sensorLatestData = res;
    });
  }

  ngAfterViewChecked(): void {
    this.renderChart();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  showTab(tabName: string) {
    this.currentTab = tabName;
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
  }

  renderChart() {
    if (!this.chartCanvas || this.chart) {
      return;
    }

    const canvasElement = this.chartCanvas.nativeElement;
    const ctx = canvasElement.getContext('2d');

    const chartData = this.getChartData();

    this.chart = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Weeks',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Percentage',
            },
            ticks: {
              callback: function (value) {
                return value + '%';
              },
            },
          },
        },
      },
    });
  }

  getChartData() {
    let data;
    switch (this.currentTab) {
      case 'temp':
        data = [
          {
            label: 'Temperature',
            data: [22, 30, 15, 32, 25],
            backgroundColor: 'red',
            borderColor: 'red',
            fill: false,
          },
        ];
        break;
      case 'moisture':
        data = [
          {
            label: 'Moisture',
            data: [30, 15, 38, 40, 27],
            backgroundColor: 'blue',
            borderColor: 'blue',
            fill: false,
          },
        ];
        break;
      case 'humidity':
        data = [
          {
            label: 'Humidity',
            data: [70, 40, 29, 45, 65],
            backgroundColor: 'green',
            borderColor: 'green',
            fill: false,
          },
        ];
        break;
      case 'npk':
        data = [
          {
            label: 'Nitrogen',
            data: [10, 5, 16, 32, 23],
            backgroundColor: 'orange',
            borderColor: 'orange',
            fill: false,
          },
          {
            label: 'Phosphorus',
            data: [20, 15, 18, 38, 25],
            backgroundColor: 'purple',
            borderColor: 'purple',
            fill: false,
          },
          {
            label: 'Potassium',
            data: [30, 35, 32, 38],
            backgroundColor: 'brown',
            borderColor: 'brown',
            fill: false,
          },
        ];
        break;
      default:
        data = [
          {
            label: 'Sensor Data',
            data: [0, 0, 0, 0],
            backgroundColor: 'grey',
            borderColor: 'grey',
            fill: false,
          },
        ];
        break;
    }

    return {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
      datasets: data,
    };
  }
}
