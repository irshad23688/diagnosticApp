import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeSendModalPage } from './code-send-modal.page';

describe('CodeSendModalPage', () => {
  let component: CodeSendModalPage;
  let fixture: ComponentFixture<CodeSendModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeSendModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeSendModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
