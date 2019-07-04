import { Observable } from "rxjs";
import { DataService } from "./../../core/services/data.service";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class MediaService {
    constructor(private dataService: DataService) {}

    public getListPaging(
        pageIndex: number,
        pageSize: number,
        keyWord: string
    ): Observable<any> {
        return this.dataService.get(
            `/api/medias/getListPaging/${pageIndex}/${pageSize}?keyWord=${keyWord}`
        );
    }

    public getAll(): Observable<any> {
        return this.dataService.get(`/api/medias`);
    }

    public delete(id: Number): Observable<any> {
        return this.dataService.delete(`/api/medias/delete/${id}`);
    }

    public deleteMany(listIds: string) {
        return this.dataService.post(`/api/medias/deleteMany/${listIds}`);
    }

    public add(data: any): Observable<any> {
        return this.dataService.post(`/api/medias`, data);
    }

    public addList(data: any[]): Observable<any> {
        return this.dataService.post(`/api/medias/addList`, data);
    }
}
