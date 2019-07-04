import { AuthService } from './../services/auth.service';
import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras, Route } from '@angular/router';
import { SYSTEM_CONSTANT } from '../constants/system.constant';

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthService) {}

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;
        return this.checkLogin(url);
    }

    public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    public canLoad(route: Route): boolean {
        let url = `/${route.path}`;
        return this.checkLogin(url);
    }

    checkLogin(url: string) {
        if (localStorage.getItem(SYSTEM_CONSTANT.USER_CURRENT)) {
            return true;
        }

        let sessionId = 123456789;
        this.authService.redirectUrl = url;
        let navigationExtrax: NavigationExtras = {
            queryParams: { 'session_id': sessionId },
            fragment: 'anchor'
        }

        this.router.navigate(['/login'], navigationExtrax);
        return false;
    }
}