import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { AuthService } from '../services/auth.service';
import { SignalRService } from '../services/signalr.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router, 
        private message: NzMessageService,
        private authService: AuthService,
        private signalRService: SignalRService,
        ) { }
    // tokenKey
    // canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    //     if (localStorage.getItem('tokenKey')) {
    //         return true;
    //     }
    //     this.message.remove();
    //     this.message.error('Bạn cần phải đăng nhập');
    //     this.router.navigate(['/dang-nhap'], { queryParams: { returnUrl: state.url } });
    //     return false;
    // }
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.authService.decodedToken) {
            // const userRoles = this.authService.decodedToken.role as Array<string>;
            // if (!userRoles) {
            //     this.message.error('Bạn không có quyền vào trang này');
            //     this.router.navigate(['/dang-nhap'], { queryParams: { returnUrl: state.url } });
            //     return false;
            // }
            
        }
        if (this.authService.loggedIn()) {
            // GetCookie(this.cookieService, this.userService);
            return true;
        }
        this.message.remove();
        this.signalRService.stopConnection();
        this.message.error('Bạn cần phải đăng nhập');
        this.router.navigate(['/dang-nhap'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
