import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
