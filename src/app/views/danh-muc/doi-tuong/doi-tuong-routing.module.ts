import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabDoiTuongComponent } from './tab-doi-tuong/tab-doi-tuong.component';

const routes: Routes = [
    {
        path: '',
        redirectTo:'khach-hang',
        pathMatch:'full'
    },
    {
        path: 'khach-hang',
        component: TabDoiTuongComponent,
        data: {
            breadcrumb: 'Khách hàng'
        },
    },
    {
        path: 'nhan-vien',
        component: TabDoiTuongComponent,
        data: {
            breadcrumb: 'Nhân viên'
        },
    },
    {
        path: 'hang-hoa-dich-vu',
        component: TabDoiTuongComponent,
        data: {
            breadcrumb: 'Hàng hóa dịch vụ'
        },
    },
    {
        path: 'don-vi-tinh',
        component: TabDoiTuongComponent,
        data: {
            breadcrumb: 'Đơn vị tính'
        },
    },
    {
        path: 'loai-tien',
        component: TabDoiTuongComponent,
        data: {
            breadcrumb: 'Loại tiền'
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DoiTuongRoutingModule { }
