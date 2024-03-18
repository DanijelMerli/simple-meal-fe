import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMealFormComponent } from './edit-meal-form.component';

describe('EditMealFormComponent', () => {
  let component: EditMealFormComponent;
  let fixture: ComponentFixture<EditMealFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditMealFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditMealFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
