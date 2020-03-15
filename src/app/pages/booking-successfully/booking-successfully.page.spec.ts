import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingSuccessfullyPage } from './booking-successfully.page';

describe('BookingSuccessfullyPage', () => {
  let component: BookingSuccessfullyPage;
  let fixture: ComponentFixture<BookingSuccessfullyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingSuccessfullyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingSuccessfullyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
