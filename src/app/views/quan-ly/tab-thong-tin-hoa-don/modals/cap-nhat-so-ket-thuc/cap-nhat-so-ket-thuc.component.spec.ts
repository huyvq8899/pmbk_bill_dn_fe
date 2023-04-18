/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CapNhatSoKetThucComponent } from './cap-nhat-so-ket-thuc.component';

describe('CapNhatSoKetThucComponent', () => {
  let component: CapNhatSoKetThucComponent;
  let fixture: ComponentFixture<CapNhatSoKetThucComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapNhatSoKetThucComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapNhatSoKetThucComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
