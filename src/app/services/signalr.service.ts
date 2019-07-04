import { SYSTEM_CONSTANT } from "app/core/constants/system.constant";
import { Injectable, EventEmitter } from "@angular/core";
import * as signalR from "@aspnet/signalr";

@Injectable({
    providedIn: "root"
})
export class SignalRService {
    private connection: signalR.HubConnection;
    private baseUrl = SYSTEM_CONSTANT.API_URL;

    public onNewMessage = new EventEmitter<any>();

    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(this.baseUrl + "/chatHub")
            .build();
    }

    public startConnection() {
        this.connection.start().then(
            res => {
                console.log(res);
                this.onReceivedMessage();
            },
            err => {
                console.log(err);
            }
        );
    }

    public closeConnection() {
        this.connection.stop().then(res => {
            console.log("Closed connection");
        });
    }

    public onReceivedMessage() {
        this.connection.on("ReceivedMessage", data => {
            this.onNewMessage.emit(data);
        });
    }
}
