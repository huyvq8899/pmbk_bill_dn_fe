import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HoaDonDienTuComponent } from '../hoa-don-dien-tu/hoa-don-dien-tu.component';

const routes: Routes = [
    {
        path: '',
        component: HoaDonDienTuComponent,
    },
    {
        path: 'quan-li-hoa-don-tu-mtt',
        component: HoaDonDienTuComponent,
        // data: {
        //     customBreadcrumb: 'Hóa đơn điện tử'
        // },
    },
    {
        path: 'hoa-don-tu-mtt-xoa-bo',
        component: HoaDonDienTuComponent,
        // data: {
        //     customBreadcrumb: 'Hóa đơn điện tử'
        // },
    },
    {
        path: 'hoa-don-tu-mtt-thay-the',
        component: HoaDonDienTuComponent,
        // data: {
        //     customBreadcrumb: 'Hóa đơn điện tử'
        // },
    },
    {
        path: 'hoa-don-tu-mtt-dieu-chinh',
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
export class HoaDonTuMayTinhTienRoutingModule { }
