import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { SYSTEM_CONSTANT } from '../constants/system.constant';

@Injectable({
    providedIn: 'root'
})

export class JwtInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        let user: any = JSON.parse(localStorage.getItem(SYSTEM_CONSTANT.USER_CURRENT));
        if (user && user.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${user.token}`
                }
            })
        }
        return next.handle(request);
    }
}