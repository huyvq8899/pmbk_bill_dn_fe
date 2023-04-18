/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GetInfoEsigncloudComponent } from './get-info-esigncloud.component';

describe('GetInfoEsigncloudComponent', () => {
  let component: GetInfoEsigncloudComponent;
  let fixture: ComponentFixture<GetInfoEsigncloudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetInfoEsigncloudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetInfoEsigncloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
