import { UploadService } from "./../../core/services/upload.service";
import { HttpEventType } from "@angular/common/http";
import { FORM_CONSTANTS } from "./../../core/constants/form.constant";
import { NotificationService } from "./../../services/notification.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    NgZone
} from "@angular/core";
import { SYSTEM_CONSTANT } from "app/core/constants/system.constant";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MESSAGE_CONSTANTS } from "app/core/constants/message.constant";
import { ArticleService } from "../services/article.service";
import { CategoryService } from "../services/category.service";

import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import CKFinder from "@ckeditor/ckeditor5-ckfinder/src/ckfinder";

@Component({
    selector: "app-article",
    templateUrl: "./article.component.html",
    styleUrls: ["./article.component.scss"],
    encapsulation: ViewEncapsulation.None
})
export class ArticleComponent implements OnInit {
    public listArticle: Array<any>;
    public listCategory: Array<any> = [];
    public pageIndex = SYSTEM_CONSTANT.PAGINATION.PAGE_INDEX;
    public pageSize = SYSTEM_CONSTANT.PAGINATION.PAGE_SIZE;
    public totalItems: number;
    public keyWord: string = "";
    public categoryId;
    public titleModal: string;
    public FORM_CONSTANT = FORM_CONSTANTS;
    public entitySelected: any;
    public isFlagView: boolean = false;
    public configCk: any;

    public baseUrl = SYSTEM_CONSTANT.API_URL;

    public entityForm: FormGroup;
    public editor = ClassicEditor;

    @ViewChild("modalAddEdit", null) public modalAddEdit;
    public entityModal: NgbModalRef;
    @ViewChild("modalDelete", null) public modalDelete;

    @ViewChild("ckeditor", { static: true }) public ckeditorVC;
    public modalDeleteRef: NgbModalRef;

    constructor(
        private articleService: ArticleService,
        private categoryService: CategoryService,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private uploadService: UploadService,
        private ngZone: NgZone
    ) {}

    ngOnInit() {
        var self = this;
        this.configCk = {
            toolbar: [
                "ckfinder",
                "imageUpload",
                "heading",
                "|",
                "bold",
                "italic"
            ],
            extraPlugins: [this.theUploadAdapterPlugin.bind(this, self)]
            // plugins: [this.editor.CKFinder]
        };
        this.getListArticle();
        this.getListCategory();
        this.initForm();
    }

    private theUploadAdapterPlugin(self: any, editor) {
        console.log(
            self.editor.builtinPlugins.map(plugin => plugin.pluginName)
        );
        editor.plugins.get("FileRepository").createUploadAdapter = loader => {
            return new UploadAdapter(loader, self);
        };
    }

    private getListArticle() {
        let categoryId = this.categoryId ? this.categoryId : 0;
        this.articleService
            .getListPaging(
                categoryId,
                this.pageIndex,
                this.pageSize,
                this.keyWord
            )
            .subscribe((res: any) => {
                this.listArticle = res.items;
                this.totalItems = res.totalItems;
            });
    }

    private getListCategory() {
        this.categoryService.getAll(this.keyWord).subscribe(res => {
            this.listCategory = [...res];
        });
    }

    public onSearch() {
        this.pageIndex = 1;
        this.getListArticle();
    }

    public onSelectCategory() {
        this.pageIndex = 1;
        this.getListArticle();
    }

    private initForm() {
        this.entityForm = this.formBuilder.group({
            id: [],
            title: [, Validators.compose([Validators.required])],
            categoryId: [, Validators.compose([Validators.required])],
            content: []
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
            }
        } else {
            this.titleModal = "Create";
            this.entityForm.reset();
        }
        this.entityModal = this.modalService.open(this.modalAddEdit, {
            size: "lg",
            backdrop: "static"
        });
    }

    public onSave() {
        let valueForm = { ...this.entityForm.value };
        if (valueForm.id) {
            this.updateArticle(valueForm);
        } else {
            valueForm.id = 0;
            this.addArticle(valueForm);
        }
    }

    private updateArticle(entity: any) {
        this.articleService.update(entity).subscribe(res => {
            if (res) {
                let index = this.listArticle.findIndex(x => x.id == res.id);
                this.listArticle[index] = res;
                this.notificationService.success(
                    MESSAGE_CONSTANTS.UPDATED_OK_MSG,
                    MESSAGE_CONSTANTS.SUCCESS
                );
                this.entityModal.close();
            }
        });
    }

    private addArticle(entity: any) {
        this.articleService.add(entity).subscribe(res => {
            if (res) {
                this.listArticle.push(res);
                this.totalItems++;
                this.notificationService.success(
                    MESSAGE_CONSTANTS.UPDATED_OK_MSG,
                    MESSAGE_CONSTANTS.SUCCESS
                );
                this.entityModal.close();
            }
        });
    }

    public onOpenModalDelete(entity) {
        this.entitySelected = entity;
        this.modalDeleteRef = this.modalService.open(this.modalDelete);
    }

    public onDelete() {
        this.articleService.delete(this.entitySelected.id).subscribe(res => {
            if (res) {
                this.listArticle = this.listArticle.filter(x => x.id != res);
                this.totalItems--;
                this.notificationService.success(
                    MESSAGE_CONSTANTS.DELETED_OK_MSG,
                    MESSAGE_CONSTANTS.SUCCESS
                );
                this.modalDeleteRef.close();
            }
        });
    }

    public isErrorRequired(name: string) {
        return (
            this.entityForm.get(name).touched &&
            this.entityForm.get(name).hasError("required")
        );
    }
}

class UploadAdapter {
    loader;
    self;
    private baseUrl = SYSTEM_CONSTANT.API_URL;
    constructor(loader, self) {
        this.loader = loader;
        this.self = self;
    }

    upload() {
        return new Promise((resolve, reject) => {
            this.loader.file.then(res => {
                if (this.self.uploadService) {
                    this.self.uploadService
                        .upload(null, [res], false, "article")
                        .subscribe(event => {
                            if (event.type === HttpEventType.Response) {
                                let url = this.baseUrl + event.body[0].url;
                                resolve({ default: url });
                            }
                        });
                }
            });
        });
    }

    abort() {
        console.log("UploadAdapter abort");
    }
}
