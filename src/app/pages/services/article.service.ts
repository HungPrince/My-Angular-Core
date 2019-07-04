import { Injectable } from "@angular/core";
import { DataService } from "app/core/services/data.service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class ArticleService {
    constructor(private dataService: DataService) {}

    public getAll(keyWord: string): Observable<any> {
        return this.dataService.get(`/api/articles?keyWord=${keyWord}`);
    }

    public getListPaging(
        categoryId: number,
        pageIndex: number,
        pageSize: number,
        keyWord: string
    ): Observable<any> {
        return this.dataService.get(
            `/api/articles/getListPaging/category/${categoryId}/${pageIndex}/${pageSize}?keyWord=${keyWord}`
        );
    }

    public getById(id: number): Observable<any> {
        return this.dataService.get(`/api/articles/${id}`);
    }

    public add(data: any): Observable<any> {
        return this.dataService.post(`/api/articles`, data);
    }

    public update(data: any): Observable<any> {
        return this.dataService.put(`/api/articles`, data);
    }

    public delete(id: number) {
        return this.dataService.delete(`/api/articles/${id}`);
    }
}
