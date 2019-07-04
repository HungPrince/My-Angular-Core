import { Injectable } from "@angular/core";
import { DataService } from "app/core/services/data.service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class WebLinkService {
    constructor(private dataService: DataService) {}

    public getAll(keyWord: string): Observable<any> {
        return this.dataService.get(`/api/weblinks?keyWord=${keyWord}`);
    }

    public getListPaging(
        pageIndex: number,
        pageSize: number,
        keyWord: string
    ): Observable<any> {
        return this.dataService.get(
            `/api/weblinks/getListPaging/${pageIndex}/${pageSize}?keyWord=${keyWord}`
        );
    }

    public getById(id: number): Observable<any> {
        return this.dataService.get(`/api/weblinks/${id}`);
    }

    public add(data: any): Observable<any> {
        return this.dataService.post(`/api/weblinks`, data);
    }

    public update(data: any): Observable<any> {
        return this.dataService.put(`/api/weblinks`, data);
    }

    public delete(id: number) {
        return this.dataService.delete(`/api/weblinks/${id}`);
    }

    public deleteMany() {}
}
