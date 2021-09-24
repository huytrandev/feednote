import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button-icon',
  templateUrl: './button-icon.component.html',
  styleUrls: ['./button-icon.component.scss']
})
export class ButtonIconComponent implements OnInit {
  @Input() iconName!: string;
  @Input() customClasses: string[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
