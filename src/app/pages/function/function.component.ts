import { SignalRService } from "./../../services/signalr.service";
import { MESSAGE_CONSTANTS } from "app/core/constants/message.constant";
import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { FunctionService } from "../services/function.service";
import { SYSTEM_CONSTANT } from "app/core/constants/system.constant";
import { FORM_CONSTANTS } from "app/core/constants/form.constant";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NotificationService } from "app/services/notification.service";
import { ResponseStatusEnum } from "app/core/enums/response-status.enum";

@Component({
    selector: "app-function",
    templateUrl: "./function.component.html",
    styleUrls: ["./function.component.scss"],
    encapsulation: ViewEncapsulation.None
})
export class FunctionComponent implements OnInit {
    public listFunctions: Array<any>;

    public pageIndex = SYSTEM_CONSTANT.PAGINATION.PAGE_INDEX;
    public pageSize = SYSTEM_CONSTANT.PAGINATION.PAGE_SIZE;
    public totalItems: number;
    public keyWord: string = "";
    public titleModal: string;
    public FORM_CONSTANT = FORM_CONSTANTS;
    public entitySelected: any;
    public permissions: any;

    public entityForm: FormGroup;

    @ViewChild("modalAddEdit", null) public modalAddEdit;
    public entityModal: NgbModalRef;
    @ViewChild("modalDelete", null) public modalDelete;
    public modalDeleteRef: NgbModalRef;
    @ViewChild("modalPermission", null) public modalPermission;
    public modalPermissionRef: NgbModalRef;

    constructor(
        private functionService: FunctionService,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private signalRService: SignalRService
    ) {}

    ngOnInit() {
        this.getListFunction();
        this.initForm();
        this.signalRService.startConnection();
        this.signalRService.onNewMessage.subscribe(data => {
            console.log(data);
        });
    }

    public clickRow() {
        this.functionService.onTestSignalR().subscribe(res => {
            console.log(res);
        });
    }

    private initForm() {
        this.entityForm = this.formBuilder.group({
            id: [, Validators.compose([Validators.required])],
            title: [, Validators.compose([Validators.required])],
            routerLink: [, Validators.compose([Validators.required])],
            displayOrder: [, Validators.compose([Validators.required])],
            href: [, Validators.compose([Validators.required])],
            parentId: [],
            icon: [],
            menu: [false],
            status: [false],
            target: [false],
            hasSubMenu: [false]
        });
    }

    private getListFunction() {
        this.functionService.getAll().subscribe((res: any[]) => {
            this.listFunctions = this.buildTree(res);
        });
    }

    private buildTree(arr: any[]): any[] {
        let roots: any[] = [];
        let parent = arr.filter(x => x.parentId == 0);
        let arrParentLength = parent.length;
        for (let i = 0; i < arrParentLength; i++) {
            parent[i].expanded = true;
            parent[i].level = 0;
            roots.push(parent[i]);
            this.tree(arr, parent[i], parent[i].level, roots);
        }
        return roots;
    }

    private tree(arr: any[], parent: any, level: number, roots: any[]) {
        let childs = arr.filter(x => x.parentId == parent.id);
        let childLength = childs.length;
        if (childs.length) {
            parent.children = true;
            parent.parentExpanded = true;
            for (let i = 0; i < childLength; i++) {
                childs[i].expanded = true;
                childs[i].level = level + 25;
                roots.push(childs[i]);
                this.tree(arr, childs[i], childs[i].level, roots);
            }
        }
    }

    public onExpanded(item: any) {
        item.parentExpanded = !item.parentExpanded;
        this.expandedBottom(this.listFunctions, item.id, item.parentExpanded);
    }

    private expandedBottom(arr: any[], id: any, expanded: boolean) {
        let childs = arr.filter(x => x.parentId == id);
        for (let child of childs) {
            child.expanded = expanded;
            child.parentExpanded = true;
            this.expandedBottom(arr, child.id, expanded);
        }
    }

    public onOpenModalAddEdit(entity: any) {
        if (entity) {
            this.titleModal = "Cập nhật";
            for (let key in this.entityForm.value) {
                this.entityForm.get(key).setValue(entity[key]);
            }
        } else {
            this.titleModal = "Thêm mới";
            this.entityForm.reset();
        }
        this.entityModal = this.modalService.open(this.modalAddEdit, {
            size: "lg"
        });
    }

    public onSave() {
        if (this.entityForm.valid) {
            let valueForm = this.entityForm.value;
            if (this.titleModal == "Cập nhật") {
                this.updateFunction(valueForm);
            } else {
                this.addFunction(valueForm);
            }
        }
    }

    private updateFunction(entity: any) {
        this.functionService.update(entity).subscribe(res => {
            if (res) {
                this.getListFunction();
                this.notificationService.success(
                    MESSAGE_CONSTANTS.UPDATED_OK_MSG,
                    MESSAGE_CONSTANTS.SUCCESS
                );
            }
            this.entityModal.close();
        });
    }

    private addFunction(entity: any) {
        this.functionService.add(entity).subscribe(res => {
            if (res) {
                this.getListFunction();
                this.notificationService.success(
                    MESSAGE_CONSTANTS.CREATED_OK_MSG,
                    MESSAGE_CONSTANTS.SUCCESS
                );
            }
            this.entityModal.close();
        });
    }

    public onOpenModalDelete(entity) {
        this.entitySelected = entity;
        this.modalDeleteRef = this.modalService.open(this.modalDelete);
    }

    public onDelete() {
        this.functionService.delete(this.entitySelected.id).subscribe(res => {
            if (res.status == ResponseStatusEnum.success) {
                this.getListFunction();
                this.notificationService.success(
                    MESSAGE_CONSTANTS.DELETED_OK_MSG,
                    MESSAGE_CONSTANTS.SUCCESS
                );
                this.modalDeleteRef.close();
            }
        });
    }

    public onOpenModalPermission(entity: any) {
        this.entitySelected = entity;
        this.functionService
            .getAllPermissionByFunctionId(entity.id)
            .subscribe(res => {
                this.permissions = res;
                this.modalPermissionRef = this.modalService.open(
                    this.modalPermission,
                    {
                        size: "lg"
                    }
                );
            });
    }

    public onSavePermission() {
        let data = {
            permissions: this.permissions,
            functionId: this.entitySelected.id
        };
        this.functionService.onSavePermission(data).subscribe((res: any) => {
            if (res) {
                this.notificationService.success(
                    MESSAGE_CONSTANTS.UPDATED_OK_MSG,
                    MESSAGE_CONSTANTS.SUCCESS
                );
            }
            this.getListFunction();
            this.modalPermissionRef.close();
        });
    }

    public isErrorRequired(name: string) {
        return (
            this.entityForm.get(name).touched &&
            this.entityForm.get(name).hasError("required")
        );
    }

    ngOnDestroy(): void {
        this.signalRService.closeConnection();
    }
}
