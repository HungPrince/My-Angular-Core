import { SYSTEM_CONSTANT } from '../constants/system.constant';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";

const headers = new HttpHeaders({ 'content-type': 'application/json' })

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    public redirectUrl: string;
    constructor(private httpClient: HttpClient) {

    }
    public login(username: string, password: string) {
        let url = SYSTEM_CONSTANT.API_URL + `/api/users/authenticate?username=${username}&password=${password}`;
        return this.httpClient.post(url, { headers: headers });
    }

    public logout() {
        localStorage.removeItem(SYSTEM_CONSTANT.USER_CURRENT);
    }

    public checkLoggedInUser(): boolean {
        return localStorage.getItem(SYSTEM_CONSTANT.USER_CURRENT) ? true : false;
    }
}