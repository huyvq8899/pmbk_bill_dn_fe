import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginModel } from 'src/app/models/LoginModel';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute, NavigationError } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { AuthService } from 'src/app/services/auth.service';
import { EnvService } from 'src/app/env.service';
import { CookieService } from 'ngx-cookie-service';
import { CookieConstant } from 'src/app/constants/constant';
import { CompanyService } from 'src/app/services/CusMan/company.service';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { HopDongHoaDonService } from 'src/app/services/hop-dong-hoa-don.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  url: string;
  loginForm: FormGroup;
  data: LoginModel;
  isLoadingLogin = false;
  constructor(
    private env: EnvService,
    private fb: FormBuilder,
    private usersv: UserService,
    private authsv: AuthService,
    private message: NzMessageService,
    private cookieService: CookieService,
    private companyService: CompanyService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private hopDongHoaDonService: HopDongHoaDonService,
    private router: Router, private route: ActivatedRoute) {
    router.events.subscribe((event: any) => {
      if (event instanceof NavigationError) {
        // Hide loading indicator
        // Present error to user
        this.url = 'bang-dieu-khien';
        this.router.navigate([this.url]);
      }
    });
  }
  ngOnInit(): void {
    if (this.authsv.loggedIn()) {
      this.router.navigate(['/']);
    }
    this.route.queryParams.subscribe(rs => {
      // tslint:disable-next-line: no-string-literal
      if (rs['returnUrl'] === undefined) {
        this.url = 'bang-dieu-khien';
      } else {
        // tslint:disable-next-line: no-string-literal
        this.url = rs['returnUrl'];
      }
    });
    this.loginForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      taxCode: [null, [Validators.required]]
    });

    if (this.cookieService.get(CookieConstant.TAXCODE)) {
      this.loginForm.get('taxCode').setValue(this.cookieService.get(CookieConstant.TAXCODE));
    }
  }
  async submitForm(): Promise<void> {
    // tslint:disable-next-line:forin
    if (this.loginForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.loginForm.controls) {
        this.loginForm.controls[i].markAsDirty();
        this.loginForm.controls[i].updateValueAndValidity();
      }
      // this.modal.destroy(true);
      return;
    }
    // login
    this.isLoadingLogin = true;
    this.data = this.loginForm.value;


    // const company: any = await this.companyService.GetDBNameByTaxCodeAndTypePromise(this.data.taxCode, 1);


    // if (!company) {
    //   this.message.warning('Mã số thuế không tồn tại.');
    //   this.isLoadingLogin = false;
    //   return;
    // } else {
    //   this.data.databaseName = company.dataBaseName;
    // }

    // const inforKH: any = await this.companyService.GetInforKH(company.taxCode);

    // if (inforKH) {
    //   localStorage.setItem(CookieConstant.COMPANYNAME, inforKH.hoVaTen);
    // }

    this.authsv.login(this.data).subscribe((rs: any) => {
      this.isLoadingLogin = false;
      if (rs.tokenKey === '') {
        this.router.navigate(['dang-nhap']);
      }
      if (rs.result === -1) {
        this.message.error('Tài khoản không tồn tại');
      } else if (rs.result === -2) {
        this.message.error('Mã số thuế không tồn tại.');
      } else if (rs.result === 0) {
        this.message.error('Sai mật khẩu');
      } else if (rs.result === 1) {
        this.message.success('Đăng nhập thành công');
        sessionStorage.removeItem('showAlertStart');
        localStorage.setItem(CookieConstant.TAXCODE,this.data.taxCode);
        /*Lấy hợp đồng bên quản lý khách hàng khởi tạo ban đầu vì đã có hợp đồng từ trước
          1. Kiểm tra xem Bên giải pháp đã tồn tại hợp đồng nào chưa? Nếu có rồi thì không Lấy bên quản lý khách hàng nữa
          2. Gọi hàm lấy dữ HĐồng bên quản lý khách hàng
          3. Lưu vào cơ sở dữ liệu bên giải pháp
        */

        this.hopDongHoaDonService.getHopDongByTaxcode(this.data.taxCode).subscribe((res: any) => {
          if (res.length == 0) {
            //Nếu db chưa có hợp đồng thì lấy bên QLKH
            this.hopDongHoaDonService.getListHopDongQlkhByTaxcode(this.data.taxCode).subscribe((res: any) => {
              console.log('getListHopDongByTaxcodeFromQlkh: ', res);
              if(res.length>0){
                  this.hopDongHoaDonService.InsertList(res).subscribe();
              }
            });
          }
        });
        //END
        this.checkPermisson();
        this.nhatKyTruyCapService.Insert({
          loaiHanhDong: LoaiHanhDong.DangNhap,
          refType: RefType.DangNhap,
          thamChieu: 'Tên đăng nhập: ' + this.data.userName,
          refId: localStorage.getItem('userId')
        }).subscribe();
        this.usersv.SetOnline(localStorage.getItem('userId'), true).subscribe((rs: any) => {
          if (rs) {
            setTimeout(() => {
              this.router.navigateByUrl(this.url);
            }, 1000);

          } else {
            this.message.error('Lỗi đăng nhập');
            this.router.navigate(['dang-nhap']);
          }
        });
      } else if (rs.result === 2) {
        this.message.warning('Tài khoản bị khóa');
      }
    });

  }

  checkPermisson() {
    const params = {
      userName: localStorage.getItem('userName')
    }
    this.usersv.GetPermissionByUserName(params).subscribe((res: any) => {
      if (res == true) localStorage.setItem('KTBKUserPermission', 'true');
      else
        localStorage.setItem('KTBKUserPermission', JSON.stringify(res));
    });
  }

  // updateDB() {
  //   let array: any[] = [
  //     'Server=103.63.109.19;Database=DemoAccountant;User Id=sa;Password=PhanMem@BachKhoa;MultipleActiveResultSets=true',
  //     'Server=103.63.109.19;Database=BKSOFTAccountant;User Id=sa;Password=PhanMem@BachKhoa;MultipleActiveResultSets=true'];
  //   array.forEach(element => {
  //     this.authsv.UpdateDatabaseMultilDB(element).subscribe((rs: any) => {
  //
  //     });
  //   });
  // }
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // tslint:disable-next-line: deprecation
    if ((event.ctrlKey || event.metaKey) && event.keyCode === 13) {
      this.submitForm();
    }
  }
}
