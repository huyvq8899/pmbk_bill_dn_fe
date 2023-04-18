import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';

import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { EnvService } from '../env.service';

@Injectable({
    providedIn: 'root'
})
export class SignalRService {
    private hubConnection: signalR.HubConnection;

    constructor(
        private env: EnvService,
        private authService: AuthService,
        private router: Router) { }
    startConnection() {
        if (!localStorage.getItem('tokenKey')) {
            return null;
        }
        this.hubConnection = new signalR.HubConnectionBuilder()
            .configureLogging(signalR.LogLevel.Information)
            .withUrl(`${this.env.apiUrl}/signalr`, { accessTokenFactory: () => localStorage.getItem('tokenKey') })
            .build();

        this.hubConnection.start().then(() => {
            
        }).catch((err) => {
            
            this.stopConnection();
            this.hubConnection = null;
            if (!this.hubConnection) {
                setTimeout(() => this.startConnection(), 2000);
            }
        });

        this.hubConnection.onclose(() => {
            
            this.stopConnection();
            this.hubConnection = null;
            if (!this.hubConnection) {
                setTimeout(() => this.startConnection(), 2000);
            }
        });
    }

    stopConnection() {
        if (this.hubConnection) {
            this.hubConnection.stop().then(() => {
                
                // localStorage.removeItem(SessionConstant.TOKEN);
                // this.authService.decodedToken = null;
                // const apiURL = location.origin + '/dang-nhap';
                // const link = document.createElement('a');
                // link.href = apiURL;
                // link.click();
            }).catch((err) => {
                
            });
        }
    }

    ReceiveProgressMessage(callback: (total: number, count: number) => any) {
        this.hubConnection.on('ReceiveProgressMessage', (res1: number, res2: number) => {
            callback(res1, res2);
        });
    }
}
