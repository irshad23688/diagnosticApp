import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NearSalonListPage } from './near-salon-list.page';

describe('NearSalonListPage', () => {
  let component: NearSalonListPage;
  let fixture: ComponentFixture<NearSalonListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NearSalonListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NearSalonListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
