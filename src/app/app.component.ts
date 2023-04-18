import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { ConnectionService } from 'ng-connection-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { EnvService } from './env.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loadingRoute = false;
  isConnected = true;
  constructor(
    private userService: UserService,
    private router: Router,
    private connectionService: ConnectionService,
    private spinner: NgxSpinnerService,
    private env: EnvService
  ) {
    this.router.events.subscribe((event: any) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loadingRoute = true;
          // this.loadingsv.createBasicMessage();
          break;
        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loadingRoute = false;
          // this.loadingsv.removeBasicMessage();
          break;
        }
        default: {
          break;
        }
      }
    });
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.spinner.hide();
      } else {
        this.spinner.show();
      }
    });
    document.body.style.setProperty("--data-color", 'red');
  }

  ngOnInit(): void {
    
    
  }
}
