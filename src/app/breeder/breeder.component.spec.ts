import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreederComponent } from './breeder.component';

describe('BreederComponent', () => {
  let component: BreederComponent;
  let fixture: ComponentFixture<BreederComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreederComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BreederComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
