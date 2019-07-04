import { DataService } from "./../../core/services/data.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class FunctionService {
    constructor(private dataService: DataService) {}

    public getAll(): Observable<Array<any>> {
        return this.dataService.get(`/api/functions`);
    }

    public getById(id: number): Observable<any> {
        return this.dataService.get(`/api/functions/${id}`);
    }

    public update(data: any) {
        return this.dataService.put(`/api/functions`, data);
    }

    public add(data: any) {
        return this.dataService.post(`/api/functions`, data);
    }

    public delete(id: number) {
        return this.dataService.delete(`/api/functions/${id}`);
    }

    public getAllPermissionByFunctionId(id: string) {
        return this.dataService.get(
            `/api/roles/getAllPermission?functionId=${id}`
        );
    }

    public onSavePermission(data: any) {
        return this.dataService.post(`/api/roles/savePermission`, data);
    }

    public onTestSignalR() {
        return this.dataService.get(`/api/functions/testSignalR`);
    }
}
