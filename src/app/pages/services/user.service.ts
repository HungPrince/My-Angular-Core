import { DataService } from "./../../core/services/data.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class UserService {
    constructor(private dataService: DataService) {}

    public getAll(): Observable<any> {
        return this.dataService.get(`/api/users`);
    }

    public getById(id: number): Observable<any> {
        return this.dataService.get(`/api/users/${id}`);
    }

    public add(data: any) {
        return this.dataService.post(`/api/users/register`, data);
    }

    public update(data: any) {
        return this.dataService.put(`/api/users/${data.id}`, data);
    }

    public delete(id: number) {
        return this.dataService.delete(`/api/users/${id}`);
    }
}
