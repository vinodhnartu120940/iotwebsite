import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss'
})
export class PieChartComponent {
  @Input() chartData!: ChartData<'pie'>;
  @Input() chartOptions!: ChartOptions<'pie'>;
  @Input() width: number | undefined; 
  @Input() height: number | undefined;
  @ViewChild('pieCanvas', { static: true }) pieCanvas!: ElementRef;
  private chart: Chart<'pie'> | undefined;

  constructor() { }

  ngOnInit(): void {
    this.createChart();
    Chart.register(...registerables);
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  createChart(): void {
    const context = this.pieCanvas.nativeElement.getContext('2d');
    context.canvas.width = this.width;
    context.canvas.height = this.height;

    this.chart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: this.chartData,
      options: {
        ...this.chartOptions,
        maintainAspectRatio: false,
        responsive: true
      }
    });
  }
}
