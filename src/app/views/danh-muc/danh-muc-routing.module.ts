import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        data: {
            breadcrumb: 'Danh mục'
        },
        children: [
            {
                path: '',
                loadChildren: () => import('./doi-tuong/doi-tuong.module').then(m => m.DoiTuongModule)
            },
            // {
            //     path: 'hang-hoa-dich-vu',
            //     loadChildren: () => import('./hang-hoa-dich-vu/hang-hoa-dich-vu.module').then(m => m.HangHoaDichVuModule)
            // },
            // {
            //     path: 'loai-tien',
            //     loadChildren: () => import('./loai-tien/loai-tien.module').then(m => m.LoaiTienModule)
            // },
            // {
            //     path: 'hinh-thuc-thanh-toan',
            //     loadChildren: () => import('./hinh-thuc-thanh-toan/hinh-thuc-thanh-toan.module').then(m => m.HinhThucThanhToanModule)
            // },
            // {
            //     path: 'quan-ly-hoa-don-dien-tu',
            //     loadChildren: () => import('./quan-ly-hoa-don-dien-tu/quan-ly-hoa-don-dien-tu.module').then(m => m.QuanLyHoaDonDienTuModule)
            // },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DanhMucRoutingModule { }
