import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from 'src/app/env.service';

@Injectable({
    providedIn: 'root'
})
export class CompanyService {

    constructor(
        private http: HttpClient,
        private env: EnvService
    ) { }

    public getHeader() {
        return {
            // tslint:disable-next-line:object-literal-key-quotes
            headers: new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('tokenKey')}` })
        };
    }    
}
