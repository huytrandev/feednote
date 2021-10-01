import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritionDialogComponent } from './nutrition-dialog.component';

describe('NutritionDialogComponent', () => {
  let component: NutritionDialogComponent;
  let fixture: ComponentFixture<NutritionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NutritionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NutritionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
