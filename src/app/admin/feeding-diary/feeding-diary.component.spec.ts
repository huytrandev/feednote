import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedingDiaryComponent } from './feeding-diary.component';

describe('FeedingDiaryComponent', () => {
  let component: FeedingDiaryComponent;
  let fixture: ComponentFixture<FeedingDiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedingDiaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedingDiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
