import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreedersComponent } from './breeders.component';

describe('BreedersComponent', () => {
  let component: BreedersComponent;
  let fixture: ComponentFixture<BreedersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreedersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BreedersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
