/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ListLapBienBanHuyHoaDonComponent } from './list-lap-bien-ban-huy-hoa-don.component';

describe('ListLapBienBanHuyHoaDonComponent', () => {
  let component: ListLapBienBanHuyHoaDonComponent;
  let fixture: ComponentFixture<ListLapBienBanHuyHoaDonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListLapBienBanHuyHoaDonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLapBienBanHuyHoaDonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
