import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabThongDiepHoaDonComponent } from './tab-thong-diep-hoa-don.component';

const routes: Routes = [
    {
        path: '',
        redirectTo:'gui-du-lieu-hddt-khong-ma',
        pathMatch:'full'
    },
    {
        path: 'gui-du-lieu-hddt-khong-ma',
        component: TabThongDiepHoaDonComponent,
        data: {
            breadcrumb: 'Gửi gữi liệu hóa đơn điện tử không mã'
        },
    },
    {
        path: 'gui-du-lieu-hddt-de-cap-ma',
        component: TabThongDiepHoaDonComponent,
        data: {
            breadcrumb: 'Gửi dữ liệu hóa đơn điện tử để cấp mã'
        },
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TabThongDiepHoaDonRoutingModule { }
