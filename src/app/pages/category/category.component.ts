import { UploadService } from "./../../core/services/upload.service";
import { CategoryService } from "./../services/category.service";
import { FORM_CONSTANTS } from "./../../core/constants/form.constant";
import { NotificationService } from "./../../services/notification.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { SYSTEM_CONSTANT } from "app/core/constants/system.constant";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MESSAGE_CONSTANTS } from "app/core/constants/message.constant";
import { HttpEventType } from "@angular/common/http";

@Component({
    selector: "app-category",
    templateUrl: "./category.component.html",
    styleUrls: ["./category.component.scss"],
    encapsulation: ViewEncapsulation.None
})
export class CategoryComponent implements OnInit {
    public listCategory: Array<any>;
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
        private categoryService: CategoryService,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private uploadService: UploadService
    ) {}

    ngOnInit() {
        this.getListArticle();
        this.initForm();
    }

    private getListArticle() {
        this.isLoading = true;
        this.categoryService
            .getListPaging(this.pageIndex, this.pageSize, this.keyWord)
            .subscribe((res: any) => {
                this.listCategory = res.items;
                this.totalItems = res.totalItems;
                this.isLoading = false;
            });
    }

    public onSearch() {
        this.pageIndex = 1;
        this.getListArticle();
    }

    private initForm() {
        this.entityForm = this.formBuilder.group({
            id: [],
            name: [, Validators.compose([Validators.required])],
            status: [true],
            description: [],
            imageUrl: []
        });
    }

    public onPageChanged(pageIndex: number) {
        this.pageIndex = pageIndex;
        this.getListArticle();
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
                if (key == "imageUrl") {
                    this.imageUrl = SYSTEM_CONSTANT.API_URL + entity[key];
                }
            }
        } else {
            this.titleModal = "Create";
            this.imageUrl = "";
            this.entityForm.reset();
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
                            valueForm.imageUrl = event.body[0].url;
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
        this.categoryService.update(entity).subscribe(res => {
            if (res) {
                let index = this.listCategory.findIndex(x => x.id == res.id);
                this.listCategory[index] = res;
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
        this.categoryService.add(entity).subscribe(res => {
            if (res) {
                this.listCategory.push(res);
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
        this.categoryService.delete(this.entitySelected.id).subscribe(res => {
            if (res) {
                this.listCategory = this.listCategory.filter(x => x.id != res);
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
