import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button-icon',
  templateUrl: './button-icon.component.html',
  styleUrls: ['./button-icon.component.scss']
})
export class ButtonIconComponent implements OnInit {
  @Input() iconName!: string;
  @Input() customClasses: string[] = [];
  @Input() styleIcon: string;

  constructor() { }

  ngOnInit(): void {
    if (this.styleIcon === 'outline' || !this.styleIcon) {
      this.customClasses.unshift('material-icons-outlined');
    } else if (this.styleIcon === 'round') {
      this.customClasses.unshift('material-icons-round');
    }
  }

}
