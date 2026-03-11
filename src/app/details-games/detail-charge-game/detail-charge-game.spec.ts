import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailChargeGame } from './detail-charge-game';

describe('DetailChargeGame', () => {
  let component: DetailChargeGame;
  let fixture: ComponentFixture<DetailChargeGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailChargeGame]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailChargeGame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
