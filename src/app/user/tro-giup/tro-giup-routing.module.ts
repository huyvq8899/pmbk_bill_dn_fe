import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TroGiupComponent } from './tro-giup.component';

const routes: Routes = [
    {
        path: '',
        component: TroGiupComponent,
        data: {
            title: ''
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TroGiupRoutingModule { }
