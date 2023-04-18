import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account.component';
import { AccountCenterComponent } from './account-center/account-center.component';
import { AccountSettingComponent } from './account-setting/account-setting.component';
//import { AccountListComponent } from './account-list/account-list.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path:'',
                redirectTo:'center',
                pathMatch:'full'
            },
            {
                path:'center',
                component: AccountCenterComponent,
                // data: {
                //     customBreadcrumb: 'Center'
                // },
            },
            {
                path:'setting',
                component: AccountSettingComponent,
                // data: {
                //     customBreadcrumb: 'Setting'
                // },
            },
            // {
            //     path:'list',
            //     component: AccountListComponent,
            //     // data: {
            //     //     customBreadcrumb: 'List'
            //     // },
            // }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountRoutingModule { }
