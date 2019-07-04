import { DataService } from './../../core/services/data.service';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class RoleService {
    constructor(private dataService: DataService) {

    }

    public getAll(): Observable<Array<any>> {
        return this.dataService.get(`/api/roles`);
    }

    public getListPaging(pageIndex: number, pageSize: number, keyWord: string): Observable<Array<any>> {
        return this.dataService.get(`/api/roles/${pageIndex}/${pageSize}?keyWord=${keyWord}`);
    }

    public getById(id: number): Observable<any> {
        return this.dataService.get(`/api/roles/${id}`);
    }

    public update(data: any) {
        return this.dataService.put(`/api/roles`, data);
    }

    public add(data: any) {
        return this.dataService.post(`/api/roles`, data);
    }

    public delete(id: number){
        return this.dataService.delete(`/api/roles/${id}`);
    }
}