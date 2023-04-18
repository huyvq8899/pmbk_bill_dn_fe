import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TienIchComponent } from './tien-ich.component';

const routes: Routes = [
    {
        path: '',
        redirectTo:'nhat-ky-truy-cap',
        pathMatch:'full'
    },
    {
        path: 'nhat-ky-truy-cap',
        component: TienIchComponent,
        data: {
            breadcrumb: 'Nhật ký truy cập'
        },
    },
    {
        path: 'nhat-ky-gui-email',
        component: TienIchComponent,
        data: {
            breadcrumb: 'Nhật yks gửi email'
        },
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TienIchRoutingModule { }
