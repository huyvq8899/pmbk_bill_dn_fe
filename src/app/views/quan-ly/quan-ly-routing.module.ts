import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuanLyComponent } from './quan-ly.component';

const routes: Routes = [
    {
        path: '',
        component: QuanLyComponent,
    },
    {
        path: 'thong-tin-hoa-don',
        component: QuanLyComponent,
        // data: {
        //     customBreadcrumb: 'Hóa đơn điện tử'
        // },
    },
    {
        path: 'mau-hoa-don',
        component: QuanLyComponent,
        // data: {
        //     customBreadcrumb: 'Hóa đơn điện tử'
        // },
    },
    {
        path: 'thong-diep-gui',
        component: QuanLyComponent,
        // data: {
        //     customBreadcrumb: 'Hóa đơn điện tử'
        // },
    },
    {
        path: 'thong-diep-nhan',
        component: QuanLyComponent,
        // data: {
        //     customBreadcrumb: 'Hóa đơn điện tử'
        // },
    },
    {
        path: 'bo-ky-hieu-hoa-don',
        component: QuanLyComponent,
        // data: {
        //     customBreadcrumb: 'Hóa đơn điện tử'
        // },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class QuanLyRoutingModule { }
