import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaoCaoComponent } from './bao-cao.component';

const routes: Routes = [
    {
        path: '',
        component: BaoCaoComponent,
    },
    {
        path: 'thong-ke-so-luong-hoa-don-da-phat-hanh',
        component: BaoCaoComponent,
        // data: {
        //     customBreadcrumb: 'Hóa đơn điện tử'
        // },
    },
    {
        path: 'bang-ke-chi-tiet-hoa-don-su-dung',
        component: BaoCaoComponent,
        // data: {
        //     customBreadcrumb: 'Hóa đơn điện tử'
        // },
    },
    {
        path: 'tong-hop-gia-tri-hoa-don-da-su-dung',
        component: BaoCaoComponent,
        // data: {
        //     customBreadcrumb: 'Hóa đơn điện tử'
        // },
    },
    {
        path: 'tinh-hinh-su-dung-hoa-don',
        component: BaoCaoComponent,
        // data: {
        //     customBreadcrumb: 'Hóa đơn điện tử'
        // },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BaoCaoRoutingModule { }
