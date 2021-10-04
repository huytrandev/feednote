import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateNutritionComponent } from './dialog-create-nutrition.component';

describe('DialogCreateNutritionComponent', () => {
  let component: DialogCreateNutritionComponent;
  let fixture: ComponentFixture<DialogCreateNutritionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCreateNutritionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCreateNutritionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
