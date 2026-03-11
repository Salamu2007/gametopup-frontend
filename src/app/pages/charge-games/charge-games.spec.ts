import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeGames } from './charge-games';

describe('ChargeGames', () => {
  let component: ChargeGames;
  let fixture: ComponentFixture<ChargeGames>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargeGames]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChargeGames);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
