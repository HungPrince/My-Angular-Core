import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, identity } from "rxjs";
import { SYSTEM_CONSTANT } from "../constants/system.constant";

const headers = new HttpHeaders({ "Content-Type": "application/json" });

@Injectable({
    providedIn: "root"
})
export class DataService {
    constructor(private httpClient: HttpClient) {}

    public post(uri: string, data?: any): Observable<any> {
        let url = SYSTEM_CONSTANT.API_URL + uri;
        return this.httpClient.post(url, JSON.stringify(data), {
            headers: headers
        });
    }

    public put(uri: string, data?: any): Observable<any> {
        let url = SYSTEM_CONSTANT.API_URL + uri;
        return this.httpClient.put(url, JSON.stringify(data), {
            headers: headers
        });
    }

    public get(uri: string): Observable<any> {
        let url = SYSTEM_CONSTANT.API_URL + uri;
        return this.httpClient.get(url, { headers: headers });
    }

    public delete(uri: string): Observable<any> {
        let url = SYSTEM_CONSTANT.API_URL + uri;
        return this.httpClient.delete(url, { headers: headers });
    }

    public postFile(uri: string, data?: any) {
        let url = SYSTEM_CONSTANT.API_URL + uri;
        return this.httpClient.post(url, data);
    }

    public uploadFileProgress(uri: string, data?: any) {
        let url = SYSTEM_CONSTANT.API_URL + uri;
        return this.httpClient.post(url, data, {
            reportProgress: true,
            observe: "events"
        });
    }
}
