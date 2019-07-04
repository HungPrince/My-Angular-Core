import { FORM_CONSTANTS } from "./../../core/constants/form.constant";
import { NotificationService } from "./../../services/notification.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { RoleService } from "../services/role.service";
import { SYSTEM_CONSTANT } from "app/core/constants/system.constant";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MESSAGE_CONSTANTS } from "app/core/constants/message.constant";

@Component({
  selector: "app-role",
  templateUrl: "./role.component.html",
  styleUrls: ["./role.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class RoleComponent implements OnInit {
  public listRoles: Array<any>;
  public pageIndex = SYSTEM_CONSTANT.PAGINATION.PAGE_INDEX;
  public pageSize = SYSTEM_CONSTANT.PAGINATION.PAGE_SIZE;
  public totalItems: number;
  public keyWord: string = "";
  public titleModal: string;
  public FORM_CONSTANT = FORM_CONSTANTS;
  public entitySelected: any;
  public isFlagView: boolean = false;

  public entityForm: FormGroup;

  @ViewChild("modalAddEdit", null) public modalAddEdit;
  public entityModal: NgbModalRef;
  @ViewChild("modalDelete", null) public modalDelete;
  public modalDeleteRef: NgbModalRef;

  constructor(
    private roleService: RoleService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.getListRole();
    this.initForm();
  }

  private getListRole() {
    this.roleService
      .getListPaging(this.pageIndex, this.pageSize, this.keyWord)
      .subscribe((res: any) => {
        this.listRoles = res.items;
        this.totalItems = res.totalItems;
      });
  }

  public onSearch() {
    this.pageIndex = 1;
    this.getListRole();
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
    this.getListRole();
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
      this.entityForm.setValue(entity);
    } else {
      this.titleModal = "Create";
      this.entityForm.reset();
    }
    this.entityModal = this.modalService.open(this.modalAddEdit);
  }

  public onSave() {
    let valueForm = { ...this.entityForm.value };
    if (valueForm.id) {
      this.updateRole(valueForm);
    } else {
      valueForm.id = 0;
      this.addRole(valueForm);
    }
  }

  private updateRole(role: any) {
    this.roleService.update(role).subscribe(res => {
      if (res) {
        let index = this.listRoles.findIndex(x => x.id == res.id);
        this.listRoles[index] = res;
        this.notificationService.success(
          MESSAGE_CONSTANTS.UPDATED_OK_MSG,
          MESSAGE_CONSTANTS.SUCCESS
        );
        this.entityModal.close();
      }
    });
  }

  private addRole(role: any) {
    this.roleService.add(role).subscribe(res => {
      if (res) {
        this.listRoles.push(res);
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
    this.roleService.delete(this.entitySelected.id).subscribe(res => {
      if (res) {
        this.listRoles = this.listRoles.filter(x => x.id != res);
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
