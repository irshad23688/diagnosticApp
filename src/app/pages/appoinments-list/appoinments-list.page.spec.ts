import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppoinmentsListPage } from './appoinments-list.page';

describe('AppoinmentsListPage', () => {
  let component: AppoinmentsListPage;
  let fixture: ComponentFixture<AppoinmentsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppoinmentsListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppoinmentsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
