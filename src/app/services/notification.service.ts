import { Injectable } from '@angular/core';
import { ToastrService, GlobalConfig } from 'ngx-toastr';


@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    options: GlobalConfig;
    title = '';
    message = '';
    opt: any;
    private lastInserted: number[] = [];
    constructor(public toastrService: ToastrService) {
        this.options = this.toastrService.toastrConfig;
        this.opt = JSON.parse(JSON.stringify(this.options));
    }
    
    success(message: string, title: string) {
        const inserted = this.toastrService['success'](message, title, this.opt);
        if (inserted) {
            this.lastInserted.push(inserted.toastId);
        }
        return inserted;
    }

    error(message: string, title: string) {
        const inserted = this.toastrService['error'](message, title, this.opt);
        if (inserted) {
            this.lastInserted.push(inserted.toastId);
        }
        return inserted;
    }

    info(message: string, title: string) {
        const inserted = this.toastrService['info'](message, title, this.opt);
        if (inserted) {
            this.lastInserted.push(inserted.toastId);
        }
        return inserted;
    }

    warning(message: string, title: string) {
        const inserted = this.toastrService['warning'](message, title, this.opt);
        if (inserted) {
            this.lastInserted.push(inserted.toastId);
        }
        return inserted;
    }

    clearToasts() {
        this.toastrService.clear();
    }
    clearLastToast() {
        this.toastrService.clear(this.lastInserted.pop());
    }

}
