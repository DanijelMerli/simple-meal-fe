import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWeeklyMenuComponent } from './create-weekly-menu.component';

describe('CreateWeeklyMenuComponent', () => {
  let component: CreateWeeklyMenuComponent;
  let fixture: ComponentFixture<CreateWeeklyMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateWeeklyMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateWeeklyMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
