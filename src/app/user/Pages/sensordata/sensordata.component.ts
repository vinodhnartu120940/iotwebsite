import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnDestroy,
} from '@angular/core';
import { UserService } from '../../user.service';
import { Chart, registerables } from 'chart.js';
import { NgClass, NgIf, NgStyle } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
Chart.register(...registerables);

@Component({
  selector: 'app-sensordata',
  standalone:true,
  imports: [NgClass,NgStyle,NgIf],
  templateUrl: './sensordata.component.html',
  styleUrls: ['./sensordata.component.scss'],
})
export class SensordataComponent implements AfterViewChecked, OnDestroy {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef;
  currentTab: string = 'all';
  sensorLatestData: any;
  chart: Chart | undefined;
  sensorDataMonthly:any=[];

  constructor(private userService: UserService, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.sensorLatestData = navigation.extras.state['sensorData'];
    } else {
      // Handle the case where there's no passed data
      console.error('No sensor data was passed!');
    }
    this.userService.GetSensorWeeklyData(this.sensorLatestData.tenantId,"month").subscribe((res: any) => {
      this.sensorDataMonthly = res;
      console.log(this.sensorDataMonthly);
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
  
    let yAxisTitle = 'Value'; // Default value
    let yAxisCallback: any;
  
    // Customize the Y-axis title and callback based on the current tab
    switch (this.currentTab) {
      case 'temp':
        yAxisTitle = 'Celsius (°C)';
        yAxisCallback = (value: number) => `${value}°C`;
        break;
      case 'moisture':
        yAxisTitle = 'Soil Moisture (%)';
        yAxisCallback = (value: number) => `${value}%`;
        break;
      case 'humidity':
        yAxisTitle = 'Humidity (%)';
        yAxisCallback = (value: number) => `${value}%`;
        break;
      case 'npk':
        yAxisTitle = 'Concentration (%)';
        yAxisCallback = (value: number) => `${value}%`;
        break;
      default:
        yAxisTitle = 'Value';
        yAxisCallback = (value: number) => value;
        break;
    }
  
    this.chart = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        scales: {
          // x: {
          //   title: {
          //     display: true,
          //     text: 'Weeks',
          //   },
          // },
          y: {
            title: {
              display: true,
              text: yAxisTitle,
            },
            ticks: {
              callback: yAxisCallback,
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
            data: this.sensorDataMonthly.map((entry: any) => entry.avgTemperature),
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
            data: this.sensorDataMonthly.map((entry: any) => entry.avgSoilMoisturePercent),
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
            data: this.sensorDataMonthly.map((entry: any) => entry.avgHumidity),
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
            data: this.sensorDataMonthly.map((entry: any) => entry.avgNitrogen),
            backgroundColor: 'orange',
            borderColor: 'orange',
            fill: false,
          },
          {
            label: 'Phosphorus',
            data: this.sensorDataMonthly.map((entry: any) => entry.avgPhosphorous),
            backgroundColor: 'purple',
            borderColor: 'purple',
            fill: false,
          },
          {
            label: 'Potassium',
            data: this.sensorDataMonthly.map((entry: any) => entry.avgPotassium),
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
      labels: this.sensorDataMonthly.map((entry: any) => `Week ${entry.week}`),
      datasets: data,
    };
}


  getNeedlePosition(value: number, thresholds: number[]): number {
    const min = thresholds[0];
    const max = thresholds[thresholds.length - 1];
    if (value < min) {
      return 0;
    }
    if (value > max) {
      return 100;
    }
    return ((value - min) / (max - min)) * 100;
  }
  getTipAndStatus(title: string, value: number, thresholds: { min: number; max: number }): { status: string, tip: string } {
    let status = '';
    let tip = '';
  
    if (value < thresholds.min) {
      status = 'Poor';
      if (title === 'Temperature') {
        tip = 'Temperature is too low; Consider providing a warm environment or insulating the crop area to increase temperature.';
      } else if (title === 'Moisture') {
        tip = 'Soil moisture is too low; increase irrigation or consider mulching.';
      } else if (title === 'Humidity') {
        tip = 'Humidity is too low; consider increasing it through misting or a humidifier.';
      } else if (title === 'Nitrogen') {
        tip = 'Nitrogen levels are low; apply nitrogen-rich fertilizers.';
      } else if (title === 'Phosphorus') {
        tip = 'Phosphorus is too low; apply phosphorus-rich fertilizers.';
      } else if (title === 'Potassium') {
        tip = 'Potassium is too low; apply potassium-rich fertilizers.';
      }
    } else if (value >= thresholds.min && value < thresholds.max) {
      status = 'Average';
      if (title === 'Temperature') {
        tip = 'Temperature is slightly below optimal; consider minor adjustments like increasing sunlight exposure.';
      } else if (title === 'Moisture') {
        tip = 'Moisture is slightly below optimal; monitor and adjust watering schedule.';
      } else if (title === 'Humidity') {
        tip = 'Humidity is slightly below optimal; consider small adjustments.';
      } else if (title === 'Nitrogen') {
        tip = 'Nitrogen is slightly below optimal; monitor and adjust as needed.';
      } else if (title === 'Phosphorus') {
        tip = 'Phosphorus levels are slightly below optimal; consider minor adjustments.';
      } else if (title === 'Potassium') {
        tip = 'Potassium levels are slightly below optimal; monitor and adjust as needed.';
      }
    } else {
      status = 'Good';
      if (title === 'Temperature') {
        tip = 'Optimal growing conditions; maintain the current environment.';
      } else if (title === 'Moisture') {
        tip = 'Moisture levels are adequate; continue regular watering schedule.';
      } else if (title === 'Humidity') {
        tip = 'Humidity is within the ideal range; no changes needed.';
      } else if (title === 'Nitrogen') {
        tip = 'Nitrogen levels are optimal; maintain current fertilization practices.';
      } else if (title === 'Phosphorus') {
        tip = 'Phosphorus levels are ideal; continue with balanced fertilization.';
      } else if (title === 'Potassium') {
        tip = 'Potassium levels are sufficient; maintain current practices.';
      }
    }
  
    return { status, tip };
  }
  


}
