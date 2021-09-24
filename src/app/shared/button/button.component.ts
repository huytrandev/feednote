import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() customClasses: string[] = [];
  @Input() iconName: string = '';
  @Input() buttonContent: string = '';
  @Input() buttonType: string = '';
  @Input() disabledCondition: boolean = false;
  @Input() showSpinner: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
