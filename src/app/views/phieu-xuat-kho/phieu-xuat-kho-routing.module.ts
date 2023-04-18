import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HoaDonDienTuComponent } from '../hoa-don-dien-tu/hoa-don-dien-tu.component';

const routes: Routes = [
    {
        path: '',
        component: HoaDonDienTuComponent,
    },
    {
        path: 'quan-li-phieu-xuat-kho',
        component: HoaDonDienTuComponent,
        // data: {
        //     customBreadcrumb: 'Hóa đơn điện tử'
        // },
    },
    {
        path: 'pxk-xoa-bo',
        component: HoaDonDienTuComponent,
        // data: {
        //     customBreadcrumb: 'Hóa đơn điện tử'
        // },
    },
    {
        path: 'pxk-thay-the',
        component: HoaDonDienTuComponent,
        // data: {
        //     customBreadcrumb: 'Hóa đơn điện tử'
        // },
    },
    {
        path: 'pxk-dieu-chinh',
        component: HoaDonDienTuComponent,
        // data: {
        //     customBreadcrumb: 'Hóa đơn điện tử'
        // },
    },
    {
        path: 'bang-tong-hop-du-lieu-pxk',
        component: HoaDonDienTuComponent,
        // data: {
        //     customBreadcrumb: 'Hóa đơn điện tử'
        // },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PhieuXuatKhoRoutingModule { }
