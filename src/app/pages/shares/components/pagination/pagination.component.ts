import {
    Component,
    OnInit,
    ViewEncapsulation,
    Output,
    EventEmitter
} from "@angular/core";

@Component({
    selector: "app-pagination",
    templateUrl: "./pagination.component.html",
    styleUrls: ["./pagination.component.scss"],
    encapsulation: ViewEncapsulation.None
})
export class PaginationComponent implements OnInit {
    @Output("onPageChanged") onPageChanged = new EventEmitter<number>();

    constructor() {}

    ngOnInit() {}

    public pageChanged(index: number) {
        this.onPageChanged.emit(index);
    }
}
