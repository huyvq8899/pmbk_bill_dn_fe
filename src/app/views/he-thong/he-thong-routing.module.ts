import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabHeThongComponent } from './tab-he-thong/tab-he-thong.component';

const routes: Routes = [
    {
        path: '',
        component: TabHeThongComponent,
    },
    {
        path: 'thong-tin-nguoi-nop-thue',
        component: TabHeThongComponent,
    },
    {
        path: 'quan-ly-nguoi-dung',
        component: TabHeThongComponent,
    },
    {
        path: 'quan-ly-vai-tro',
        component: TabHeThongComponent,
    },
    {
        path: 'loai-chung-tu',
        component: TabHeThongComponent,
    },
    {
        path: 'nhap-khau-chung-tu',
        component: TabHeThongComponent,
    },
    {
        path: 'tuy-chon',
        component: TabHeThongComponent,
    },
    {
        path: 'lich-su-phien-ban',
        component: TabHeThongComponent,
    },
    // {
    //     path: 'thiet-lap-tai-khoan-xu-ly-chenh-lech',
    //     component: TabHeThongComponent,
    // },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HeThongRoutingModule { }
