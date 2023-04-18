import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HoaDonDienTuComponent } from './hoa-don-dien-tu.component';
import { TabThongDiepHoaDonComponent } from './tabs/tab-thong-diep-hoa-don/tab-thong-diep-hoa-don.component';

const routes: Routes = [
    {
        path: '',
        component: HoaDonDienTuComponent,
    },
    {
        path: 'thong-diep',
        loadChildren: () => import('./tabs/tab-thong-diep-hoa-don/tab-thong-diep-hoa-don.module').then(m => m.TabThongDiepHoaDonModule)
    },
    {
        path: 'quan-li-hoa-don-dien-tu',
        component: HoaDonDienTuComponent,
        // data: {
        //     customBreadcrumb: 'Hóa đơn điện tử'
        // },
    },
    {
        path: 'hoa-don-xoa-bo',
        component: HoaDonDienTuComponent,
        // data: {
        //     customBreadcrumb: 'Hóa đơn điện tử'
        // },
    },
    {
        path: 'hoa-don-thay-the',
        component: HoaDonDienTuComponent,
        // data: {
        //     customBreadcrumb: 'Hóa đơn điện tử'
        // },
    },
    {
        path: 'hoa-don-dieu-chinh',
        component: HoaDonDienTuComponent,
        // data: {
        //     customBreadcrumb: 'Hóa đơn điện tử'
        // },
    },
    {
        path: 'bang-tong-hop-du-lieu-hoa-don',
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
export class HoaDonDienTuRoutingModule { }
