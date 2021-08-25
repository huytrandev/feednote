import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss'],
})
export class StatisticComponent implements OnInit, AfterViewInit {
  canvas: any;
  ctx: any;
  @ViewChild('mychart') mychart: any;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.canvas = this.mychart.nativeElement;
    this.ctx = this.canvas.getContext('2d');

    new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: [
          'Tháng 1',
          'Tháng 2',
          'Tháng 3',
          'Tháng 5',
          'Tháng 6',
          'Tháng 7',
          'Tháng 8',
          'Tháng 9',
          'Tháng 10',
          'Tháng 11',
          'Tháng 12',
        ],
        datasets: [
          {
            label: 'Lương thực',
            data: [12, 19, 3, 5, 2, 3, 10, 12, 6, 10, 7, 8],
            backgroundColor: [
              '#9E7777',
              '#BD4B4B',
              '#FDE49C',
              '#DAD5AB',
              '#5C527F',
              '#F6A9A9',
              '#368B85',
              '#6B7AA1',
              '#93B5C6',
              '#C68B59',
              '#D5EEBB',
              '#DF711B',
            ],
          },
        ],
      },
    });
  }
}
