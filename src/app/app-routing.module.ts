import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/AuthGuard';
import { Page404Component } from './page404/page404.component';
import { LayoutComponent } from './layout/layout.component';
import { TraCuuHoaDonComponent } from './views/hoa-don-dien-tu/tabs/tra-cuu-hoa-don/tra-cuu-hoa-don.component';
import { KHKyBienBanXoaBoHoaDonComponent } from './views/hoa-don-dien-tu/tabs/kh-ky-bien-ban-xoa-bo-hoa-don/kh-ky-bien-ban-xoa-bo-hoa-don.component';
import { ClientKyBienBanDieuChinhComponent } from './views/hoa-don-dien-tu/tabs/client-ky-bien-ban-dieu-chinh/client-ky-bien-ban-dieu-chinh.component';

const routes: Routes = [
    {
        path: '', redirectTo: 'bang-dieu-khien', pathMatch: 'full',
    },
    {
        path: 'dang-nhap',
        loadChildren: () => import('./user/login/login.module').then(m => m.LoginModule)
    },
    {
        path: '', component: LayoutComponent,
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'bang-dieu-khien', pathMatch: 'full' },
            {
                path: 'bang-dieu-khien',
                loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule),
                // data: {
                //     breadcrumb: 'Bàn làm việc'
                // },
            },
            {
                path: 'version-detail',
                loadChildren: () => import('./user/version-detail/version-detail.module').then(m => m.VersionDetailModule),
                // data: {
                //     breadcrumb: 'Thông tin phiên bản'
                // },
            },
            {
                path: 'account',
                loadChildren: () => import('./user/account/account.module').then(m => m.AccountModule),
                // data: {
                //     breadcrumb: 'Account'
                // },
            },
            {
                path: 'tro-giup',
                loadChildren: () => import('./user/tro-giup/tro-giup.module').then(m => m.TroGiupModule),

            },
            {
                path: 'he-thong',
                loadChildren: () => import('./views/he-thong/he-thong.module').then(m => m.HeThongModule),
                data: {
                    breadcrumb: 'Hệ thống'
                },
            },
            {
                path: 'danh-muc',
                loadChildren: () => import('./views/danh-muc/danh-muc.module').then(m => m.DanhMucModule),
                data: {
                    breadcrumb: 'Danh mục'
                },
            },
            {
                path: 'quan-ly',
                loadChildren: () => import('./views/quan-ly/quan-ly.module').then(m => m.QuanLyModule),
                data: {
                    breadcrumb: 'Quản lý'
                },
            },
            {
                path: 'hoa-don-dien-tu',
                loadChildren: () => import('./views/hoa-don-dien-tu/hoa-don-dien-tu.module').then(m => m.HoaDonDienTuModule),
                data: {
                    breadcrumb: 'Hệ thống'
                },
            },
            {
                path: 'phieu-xuat-kho',
                loadChildren: () => import('./views/phieu-xuat-kho/phieu-xuat-kho.module').then(m => m.PhieuXuatKhoModule),
                data: {
                    breadcrumb: 'Hệ thống'
                },
            },
            {
                path: 'hoa-don-tu-mtt',
                loadChildren: () => import('./views/hoa-don-tu-mtt/hoa-don-tu-mtt.module').then(m => m.HoaDonTuMayTinhTienModule),
                data: {
                    breadcrumb: 'Hệ thống'
                },
            },
            {
                path: 'bao-cao',
                loadChildren: () => import('./views/bao-cao/bao-cao.module').then(m => m.BaoCaoModule),
                data: {
                    breadcrumb: 'Hệ thống'
                },
            },
            {
                path: 'tien-ich',
                loadChildren: () => import('./views/tien-ich/tien-ich.module').then(m => m.TienIchModule),
                data: {
                    breadcrumb: 'Tiện ích'
                },
            },
        ]
    },
    { path: '404', component: Page404Component },
    { path: 'tra-cuu-hoa-don', component: TraCuuHoaDonComponent },
    { path: 'tra-cuu-hoa-don/:maTraCuu', component: TraCuuHoaDonComponent },
    { path: 'xem-chi-tiet-bbxb/:id', component: KHKyBienBanXoaBoHoaDonComponent },
    { path: 'xem-chi-tiet-bbdc/:id', component: ClientKyBienBanDieuChinhComponent },
    { path: '**', redirectTo: '/404' }
];
@NgModule({
    // imports: [RouterModule.forRoot(routes, { useHash: true })],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
// export const routingComponents = [
//     LayoutComponent, LoginComponent
// ];
