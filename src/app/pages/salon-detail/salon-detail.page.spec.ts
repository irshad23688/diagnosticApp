import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalonDetailPage } from './salon-detail.page';

describe('SalonDetailPage', () => {
  let component: SalonDetailPage;
  let fixture: ComponentFixture<SalonDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalonDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalonDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
