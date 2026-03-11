import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailBuyGame } from './detail-buy-game';

describe('DetailBuyGame', () => {
  let component: DetailBuyGame;
  let fixture: ComponentFixture<DetailBuyGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailBuyGame]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailBuyGame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
