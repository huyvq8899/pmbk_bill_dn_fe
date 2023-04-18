/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TepDinhKemModalComponent } from './tep-dinh-kem-modal.component';

describe('TepDinhKemModalComponent', () => {
  let component: TepDinhKemModalComponent;
  let fixture: ComponentFixture<TepDinhKemModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TepDinhKemModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TepDinhKemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
