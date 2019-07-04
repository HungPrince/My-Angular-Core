import { FORM_CONSTANTS } from 'app/core/constants/form.constant';
import { Component, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
    selector: "app-delete",
    templateUrl: "./delete.component.html",
    styleUrls: ["./delete.component.scss"],
    encapsulation: ViewEncapsulation.None
})
export class DeleteComponent implements OnInit {
    public FORM_CONSTANT = FORM_CONSTANTS;
    constructor() {}

    ngOnInit() {}
}
