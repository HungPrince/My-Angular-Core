import { DataService } from "./data.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class UploadService {
    constructor(private dataService: DataService) {}

    public upload(
        postData: any,
        files: File[],
        isStreaming: boolean,
        folder: string
    ): Observable<any> {
        const formData = new FormData();
        for (let file of files) {
            formData.append(file.name, file);
        }

        if (postData) {
            for (let property in postData) {
                if (postData.hasOwnProperty(property)) {
                    formData.append(property, postData[property]);
                }
            }
        }
        let uri = isStreaming ? `/api/streaming` : `/api/upload`;

        return this.dataService.uploadFileProgress(
            `${uri}/${folder}`,
            formData
        );
    }

    public delete(url: string): Observable<any> {
        url = encodeURIComponent(url);
        return this.dataService.delete(`/api/upload/delete/${url}`);
    }

    public deleteMany(listUrl: any[]): Observable<any> {
        return this.dataService.post(`/api/upload/deleteMany`, listUrl);
    }
}
