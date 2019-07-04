import { UploadService } from "./../../core/services/upload.service";
import { FORM_CONSTANTS } from "./../../core/constants/form.constant";
import { NotificationService } from "./../../services/notification.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { SYSTEM_CONSTANT } from "app/core/constants/system.constant";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MESSAGE_CONSTANTS } from "app/core/constants/message.constant";
import { HttpEventType } from "@angular/common/http";
import { WebLinkService } from "../services/weblink.service";
import { ResponseStatusEnum } from "app/core/enums/response-status.enum";

@Component({
    selector: "app-web-link",
    templateUrl: "./web-link.component.html",
    styleUrls: ["./web-link.component.scss"],
    encapsulation: ViewEncapsulation.None
})
export class WebLinkComponent implements OnInit {
    public listWebLink: Array<any>;
    public pageIndex = SYSTEM_CONSTANT.PAGINATION.PAGE_INDEX;
    public pageSize = SYSTEM_CONSTANT.PAGINATION.PAGE_SIZE;
    public totalItems: number;
    public keyWord: string = "";
    public titleModal: string;
    public FORM_CONSTANT = FORM_CONSTANTS;
    public entitySelected: any;
    public isFlagView: boolean = false;
    public isLoading: boolean = false;

    public entityForm: FormGroup;
    public imageUrl: any;
    public files: File[];

    @ViewChild("modalAddEdit", null) public modalAddEdit;
    public entityModal: NgbModalRef;
    @ViewChild("modalDelete", null) public modalDelete;
    public modalDeleteRef: NgbModalRef;

    constructor(
        private webLinkService: WebLinkService,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private uploadService: UploadService
    ) {}

    ngOnInit() {
        this.getListWebLink();
        this.initForm();
    }

    private getListWebLink() {
        this.isLoading = true;
        this.webLinkService
            .getListPaging(this.pageIndex, this.pageSize, this.keyWord)
            .subscribe((res: any) => {
                this.listWebLink = res.items;
                this.totalItems = res.totalItems;
                this.isLoading = false;
            });
    }

    public onSearch() {
        this.pageIndex = 1;
        this.getListWebLink();
    }

    private initForm() {
        this.entityForm = this.formBuilder.group({
            id: [],
            name: [, Validators.compose([Validators.required])],
            icon: [],
            url: [],
            status: []
        });
    }

    public onPageChanged(pageIndex: number) {
        this.pageIndex = pageIndex;
        this.getListWebLink();
    }

    public onOpenModalAddEdit(entity: any, isView: boolean) {
        this.isFlagView = false;
        if (entity) {
            if (isView) {
                this.titleModal = "Detail";
                this.isFlagView = true;
            } else {
                this.titleModal = "Update";
            }
            for (let key in this.entityForm.value) {
                this.entityForm.get(key).setValue(entity[key]);
                if (key == "icon") {
                    this.imageUrl = SYSTEM_CONSTANT.API_URL + entity[key];
                }
            }
        } else {
            this.titleModal = "Create";
            this.imageUrl = "";
            this.entityForm.reset();
            this.entityForm.get("status").setValue(true);
        }
        this.entityModal = this.modalService.open(this.modalAddEdit);
    }

    public onSave() {
        if (this.entityForm.valid) {
            let valueForm = { ...this.entityForm.value };
            if (this.files) {
                this.uploadService
                    .upload(null, this.files, false, "category")
                    .subscribe((event: any) => {
                        if (event.type === HttpEventType.Response) {
                            valueForm.icon = event.body[0].url;
                            this.save(valueForm);
                        }
                    });
            } else {
                this.save(valueForm);
            }
        }
    }

    private save(valueForm: any) {
        if (valueForm.id) {
            this.updateCategory(valueForm);
        } else {
            valueForm.id = 0;
            this.addCategory(valueForm);
        }
    }

    private updateCategory(entity: any) {
        this.isLoading = true;
        this.webLinkService.update(entity).subscribe(res => {
            if (res) {
                let index = this.listWebLink.findIndex(x => x.id == res.id);
                this.listWebLink[index] = res;
                this.notificationService.success(
                    MESSAGE_CONSTANTS.UPDATED_OK_MSG,
                    MESSAGE_CONSTANTS.SUCCESS
                );
                this.isLoading = false;
                this.entityModal.close();
            }
        });
    }

    private addCategory(entity: any) {
        this.isLoading = true;
        this.webLinkService.add(entity).subscribe(res => {
            if (res) {
                this.listWebLink.push(res);
                this.totalItems++;
                this.notificationService.success(
                    MESSAGE_CONSTANTS.UPDATED_OK_MSG,
                    MESSAGE_CONSTANTS.SUCCESS
                );
                this.isLoading = false;
                this.entityModal.close();
            }
        });
    }

    public onOpenModalDelete(entity) {
        this.entitySelected = entity;
        this.modalDeleteRef = this.modalService.open(this.modalDelete);
    }

    public onDelete() {
        this.isLoading = true;
        this.webLinkService.delete(this.entitySelected.id).subscribe(res => {
            if (res.status == ResponseStatusEnum.success) {
                this.listWebLink = this.listWebLink.filter(
                    x => x.id != res.data.id
                );
                this.totalItems--;
                this.notificationService.success(
                    MESSAGE_CONSTANTS.DELETED_OK_MSG,
                    MESSAGE_CONSTANTS.SUCCESS
                );
                this.isLoading = false;
                this.modalDeleteRef.close();
            }
        });
    }

    public onFileChange(input) {
        const reader = new FileReader();
        if (input.files.length) {
            this.files = input.files;
            const file = input.files[0];
            reader.onload = () => {
                this.imageUrl = reader.result;
            };
            reader.readAsDataURL(file);
        }
    }

    public removeImage(): void {
        this.imageUrl = "";
    }
    public isErrorRequired(name: string) {
        return (
            this.entityForm.get(name).touched &&
            this.entityForm.get(name).hasError("required")
        );
    }
}
