import { Injectable } from "@angular/core";
import { DataService } from "app/core/services/data.service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class CategoryService {
    constructor(private dataService: DataService) {}

    public getAll(keyWord: string): Observable<any> {
        return this.dataService.get(`/api/categories?keyWord=${keyWord}`);
    }

    public getListPaging(
        pageIndex: number,
        pageSize: number,
        keyWord: string
    ): Observable<any> {
        return this.dataService.get(
            `/api/categories/getListPaging/${pageIndex}/${pageSize}?keyWord=${keyWord}`
        );
    }

    public getById(id: number): Observable<any> {
        return this.dataService.get(`/api/categories/${id}`);
    }

    public add(data: any): Observable<any> {
        return this.dataService.post(`/api/categories`, data);
    }

    public update(data: any): Observable<any> {
        return this.dataService.put(`/api/categories`, data);
    }

    public delete(id: number) {
        return this.dataService.delete(`/api/categories/${id}`);
    }

    public deleteMany() {}
}
