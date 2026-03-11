import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCharges } from './admin-charges';

describe('AdminCharges', () => {
  let component: AdminCharges;
  let fixture: ComponentFixture<AdminCharges>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCharges]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCharges);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
