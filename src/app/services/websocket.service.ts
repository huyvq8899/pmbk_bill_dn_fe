
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieConstant } from '../constants/constant';
import { ESignCloudService } from './Config/eSignCloud.service';
import { getcks, isSelectChuKiCung } from '../shared/SharedFunction';
import { TuyChonService } from './Config/tuy-chon.service';
import { HttpClient } from '@aspnet/signalr';
import { EnvService } from '../env.service';

@Injectable()
export class WebSocketService {
    isSelectChuKiCung = "KiCung";

    constructor(
        private eSignCloudService: ESignCloudService,
        private tuyChonService: TuyChonService,
    ) {
        getcks(tuyChonService);
    }

    ws: WebSocket;
    socketIsOpen = 1; // WebSocket's open

    createObservableSocket(url: string, message: any = null): Observable<any> {
        console.log(url);
        if (url == '') {
            //this.isSelectChuKiCung = await this.isSelectKiCung();
            message.userkeySign = isSelectChuKiCung(this.tuyChonService).split('|')[1];
            message.passCode = isSelectChuKiCung(this.tuyChonService).split('|')[2];
            return this.eSignCloudService.SignCloudFile(JSON.stringify(message));
        } else {

            this.ws = new WebSocket(url);

            return new Observable(
                observer => {
                    this.ws.onmessage = (event) => { console.log(event); observer.next(event.data); }
                    this.ws.onerror = (event) => { console.log(event); observer.error(event) };
                    this.ws.onclose = (event) => { console.log(event); observer.complete(); }
                    console.log('connected');
                    // a callback invoked on unsubscribe()
                    return () => this.ws.close(1000, "The user disconnected");
                }
            );
        }

    }

    isConnecting() {
        if (isSelectChuKiCung(this.tuyChonService) != 'KiCung') {
            return true;
        } else {
            if (this.ws) {
                return this.ws.readyState == 0
            }
            else return false;
        }
    }
    isOpenSocket() {
        if (isSelectChuKiCung(this.tuyChonService) != 'KiCung') {
            return true;
        } else {
            if (this.ws) {
                console.log('websocket - readyState', this.ws.readyState);
                return this.ws.readyState == this.socketIsOpen;
            }
            else return false;
        }
    }

    sendMessage(message: string) {
        if (this.ws && this.ws.readyState == this.socketIsOpen) {
            console.log("send message:", message);
            this.ws.send(message);
            return `Sent to server ${message}`;
        }
        return false;
    }
}
