import { ResponseStatusEnum } from "app/core/enums/response-status.enum";
import { MediaService } from "./../services/media.service";
import { FORM_CONSTANTS } from "./../../core/constants/form.constant";
import { NotificationService } from "./../../services/notification.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { SYSTEM_CONSTANT } from "app/core/constants/system.constant";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MESSAGE_CONSTANTS } from "app/core/constants/message.constant";
import { UploadService } from "app/core/services/upload.service";
import { HttpEventType } from "@angular/common/http";

@Component({
    selector: "app-media",
    templateUrl: "./media.component.html",
    styleUrls: ["./media.component.scss"],
    encapsulation: ViewEncapsulation.None
})
export class MediaComponent implements OnInit {
    public progress: number;
    public urlFiles: Array<any> = [];

    public listFiles: Array<any>;
    public files: File[] = [];
    public pageIndex = SYSTEM_CONSTANT.PAGINATION.PAGE_INDEX;
    public pageSize = SYSTEM_CONSTANT.PAGINATION.PAGE_SIZE;
    public totalItems: number;
    public keyWord: string = "";
    public titleModal: string = "Upload Files";
    public FORM_CONSTANT = FORM_CONSTANTS;
    public entitySelected: any;
    public isFlagView: boolean = false;
    public urlImage: string;
    public isCheckedAll: boolean = false;
    public hasChecked: boolean = false;
    public isDeleteMany: boolean = false;
    public entityForm: FormGroup;

    @ViewChild("modalUpload", null) public modalUpload;
    public entityModal: NgbModalRef;

    @ViewChild("modalDelete", null) public modalDelete;
    public modalDeleteRef: NgbModalRef;

    @ViewChild("modalViewImage", null) public modalViewImage;
    public modalViewImageRef: NgbModalRef;

    constructor(
        private uploadService: UploadService,
        private modalService: NgbModal,
        private notificationService: NotificationService,
        private mediaService: MediaService,
        private formBuilder: FormBuilder
    ) {}

    public file: any;

    public onFileChange(input) {
        if (input.files.length) {
            this.files = Array.from(input.files);
        }
    }

    public onDeleteFile(index: number): void {
        this.files.splice(index, 1);
    }

    public onUpload() {
        if (this.files) {
            this.uploadService
                .upload(null, this.files, false, "media")
                .subscribe((event: any) => {
                    if (event.type === HttpEventType.UploadProgress) {
                        this.progress = Math.round(
                            (100 * event.loaded) / event.total
                        );
                    } else if (event.type === HttpEventType.Response) {
                        this.urlFiles = event.body;
                        this.mediaService
                            .addList(this.urlFiles)
                            .subscribe(res => {
                                if (res.status == ResponseStatusEnum.success) {
                                    this.getListFile();
                                    this.notificationService.success(
                                        MESSAGE_CONSTANTS.CREATED_OK_MSG,
                                        MESSAGE_CONSTANTS.SUCCESS
                                    );
                                    this.entityModal.close();
                                }
                            });
                    }
                });
        }
    }

    ngOnInit() {
        this.getListFile();
        this.initForm();
    }

    private getListFile() {
        this.mediaService
            .getListPaging(this.pageIndex, this.pageSize, this.keyWord)
            .subscribe((res: any) => {
                this.listFiles = res.items;
                this.listFiles.map(x => (x.checked = false));
                this.totalItems = res.totalItems;
            });
    }

    public onSearch() {
        this.pageIndex = 1;
        this.getListFile();
    }

    private initForm() {
        this.entityForm = this.formBuilder.group({
            id: [],
            name: [, Validators.compose([Validators.required])],
            description: []
        });
    }

    public onPageChanged(pageIndex: number) {
        this.pageIndex = pageIndex;
        this.getListFile();
    }

    public onOpenModalUpload() {
        this.files = [];
        this.entityModal = this.modalService.open(this.modalUpload, {
            size: "lg",
            backdrop: "static"
        });
    }

    public onOpenModalDelete(isDeleteMany, entity) {
        this.isDeleteMany = isDeleteMany;
        if (!isDeleteMany) {
            this.entitySelected = entity;
        }
        this.modalDeleteRef = this.modalService.open(this.modalDelete);
    }

    public onDelete() {
        this.isDeleteMany ? this.deleteMany() : this.delete();
    }

    private delete() {
        this.mediaService.delete(this.entitySelected.id).subscribe(res => {
            if (res.status == ResponseStatusEnum.success) {
                this.uploadService
                    .delete(this.entitySelected.url)
                    .subscribe(res => {
                        if (res.status == ResponseStatusEnum.success) {
                            this.listFiles = this.listFiles.filter(
                                x => x.id != res.data.id
                            );
                            this.totalItems--;
                            this.notificationService.success(
                                MESSAGE_CONSTANTS.DELETED_OK_MSG,
                                MESSAGE_CONSTANTS.SUCCESS
                            );
                            this.modalDeleteRef.close();
                        }
                    });
            }
        });
    }

    public deleteMany() {
        let listFileChecked = this.listFiles.filter(x => x.checked);

        if (listFileChecked.length > 0) {
            let listIds = [];
            let listURL = [];
            listFileChecked.map(x => {
                listIds.push(x.id);
            });
            listFileChecked.map(x => {
                listURL.push(x.url);
            });

            let ids = listIds.join(",");
            this.mediaService.deleteMany(ids).subscribe(res => {
                if (res.status == ResponseStatusEnum.success) {
                    this.uploadService.deleteMany(listURL).subscribe(res => {
                        if (res.status == ResponseStatusEnum.success) {
                            this.pageIndex = 1;
                            this.listFiles = this.listFiles.filter(
                                x => !listIds.includes(x.id)
                            );
                            this.notificationService.success(
                                MESSAGE_CONSTANTS.DELETED_OK_MSG,
                                MESSAGE_CONSTANTS.SUCCESS
                            );
                            this.modalDeleteRef.close();
                        }
                    });
                }
            });
        }
    }

    public isErrorRequired(name: string) {
        return (
            this.entityForm.get(name).touched &&
            this.entityForm.get(name).hasError("required")
        );
    }

    public onViewFile(entity) {
        if (this.isImage(entity.type)) {
            this.urlImage = SYSTEM_CONSTANT.API_URL + entity.url;
            this.modalViewImageRef = this.modalService.open(
                this.modalViewImage,
                { size: "lg" }
            );
        } else {
        }
    }

    private isImage(type: string) {
        var extentions = [".jpg", ".png", ".jpeg", ".gif"];
        return extentions.findIndex(x => x == type.toLowerCase()) != -1;
    }

    private isVideo(type: string) {
        var extentions = [".mp4"];
        return extentions.findIndex(x => x == type) != -1;
    }

    public onChangeChecked(entity) {
        entity.checked = !entity.checked;
        let lengthChecked = this.listFiles.filter(x => x.checked).length;
        this.isCheckedAll = this.listFiles.length == lengthChecked;
        this.hasChecked = lengthChecked > 0;
    }

    public onChangeSelectAll() {
        this.isCheckedAll = !this.isCheckedAll;
        this.listFiles.map(x => (x.checked = this.isCheckedAll));
        this.hasChecked = this.isCheckedAll;
    }
}
