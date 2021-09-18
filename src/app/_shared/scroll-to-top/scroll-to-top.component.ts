import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.scss'],
})
export class ScrollToTopComponent {

  constructor() {}
  @HostListener('window:scroll', []) onWindowScroll() {
    this.scrollFunction();
  }
  
  scrollFunction() {
    if (
      document.body.scrollTop > 100 ||
      document.documentElement.scrollTop > 100
    ) {
      document.getElementById('scroll-to-top')!.style.display = 'block';
    } else {
      document.getElementById('scroll-to-top')!.style.display = 'none';
    }
  }

  topFunction() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
