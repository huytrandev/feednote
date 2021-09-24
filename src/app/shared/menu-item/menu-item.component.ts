import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {
  @Input() iconName: string = '';
  @Input() menuItemContent: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
