import { Component, ViewEncapsulation, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SYSTEM_CONSTANT } from 'app/core/constants/system.constant';
import { AuthService } from 'app/core/services/auth.service';
import { URL_CONSTANT } from 'app/core/constants/Url.Constant';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class LoginComponent implements OnInit, AfterViewInit {
    public formLogin: FormGroup;
    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router) {
        if (this.checkRemmember()) {
            this.router.navigate([URL_CONSTANT.DASHBOARD]);
        }
    }

    private checkRemmember(): boolean {
        let user = JSON.parse(localStorage.getItem(SYSTEM_CONSTANT.USER_CURRENT));
        return user && user.rememberMe;
    }

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.formLogin = this.formBuilder.group({
            'username': [, Validators.compose([Validators.required])],
            'password': [, Validators.compose([Validators.required, Validators.minLength(6)])],
            'rememberMe': [true]
        });
    }

    public onSubmit() {
        if (this.formLogin.valid) {
            let formLoginValue = { ...this.formLogin.value };
            this.authService.login(formLoginValue.username, formLoginValue.password).subscribe((res: any) => {
                if (res && res.token) {
                    res.rememberMe = formLoginValue.rememberMe;
                    localStorage.setItem(SYSTEM_CONSTANT.USER_CURRENT, JSON.stringify(res));
                    this.router.navigate([URL_CONSTANT.DASHBOARD]);
                }
            })
        }
    }

    ngAfterViewInit() {
        document.getElementById('preloader').classList.add('hide');
    }
}
