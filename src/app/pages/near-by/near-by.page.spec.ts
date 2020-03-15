import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NearByPage } from './near-by.page';

describe('NearByPage', () => {
  let component: NearByPage;
  let fixture: ComponentFixture<NearByPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NearByPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NearByPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
