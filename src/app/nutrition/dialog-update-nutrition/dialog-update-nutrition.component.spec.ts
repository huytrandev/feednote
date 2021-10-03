import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUpdateNutritionComponent } from './dialog-update-nutrition.component';

describe('DialogEditComponent', () => {
  let component: DialogUpdateNutritionComponent;
  let fixture: ComponentFixture<DialogUpdateNutritionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogUpdateNutritionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUpdateNutritionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
