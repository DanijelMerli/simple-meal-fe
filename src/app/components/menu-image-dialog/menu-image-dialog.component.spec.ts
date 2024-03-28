import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuImageDialogComponent } from './menu-image-dialog.component';

describe('MenuImageDialogComponent', () => {
  let component: MenuImageDialogComponent;
  let fixture: ComponentFixture<MenuImageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuImageDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
