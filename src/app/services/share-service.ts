import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { EnvService } from '../env.service';
@Injectable({
    providedIn: 'root'
})
export class SharedService {

    constructor(
        private http: HttpClient,
        private env: EnvService) { }
    // Observable string sources
    private emitChangeSource = new Subject<any>();
    private subjectNotification = new Subject<any>();
    private subjectChangeLoaiTien = new Subject<any>();
    private subjectLoadKiemKeQuyTable = new Subject<any>();
    private subjectChangeTabHeThong = new Subject<any>();
    // Observable string streams
    changeEmitted$ = this.emitChangeSource.asObservable();
    changeEmittedNotification$ = this.subjectNotification.asObservable();
    changeEmittedLoaiTien$ = this.subjectChangeLoaiTien.asObservable();
    changeEmittedLoadKiemKeQuyTable$ = this.subjectLoadKiemKeQuyTable.asObservable();
    changeEmittedTabHeThong$ = this.subjectChangeTabHeThong.asObservable();
    // Service message commands
    emitChange(change: any) {
        
        this.emitChangeSource.next(change);
    }
    // emitChangeNotification(change: any) {
    //     this.subjectNotification.next(change);
    // }
    emitChangeLoaiTien(change: any) {
        this.subjectChangeLoaiTien.next(change);
    }

    emitLoadKiemKeQuyTable(change: any) {
        this.subjectLoadKiemKeQuyTable.next(change);
    }

    emitChangeTabHeThong(change: any){
        this.subjectChangeTabHeThong.next(change);
    }

    
    DownloadPdf(url: string){
        console.log("path " + url);
        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/pdf');
        return this.http.get(url, { headers: headers, responseType: 'blob' });
    }

    DownloadXML(url: string){
        console.log("path " + url);
        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'text/xml');
        return this.http.get(url, { headers: headers, responseType: 'blob' });
    }

    async getFile(url: string) {  
        const httpOptions = {  
          responseType: 'blob' as 'json'  
        };  
        const res = await this.http.get(url, httpOptions).toPromise().catch((err: HttpErrorResponse) => {  
          const error = err.error;  
          return error;  
        });  
        return res;  
      }  
}
