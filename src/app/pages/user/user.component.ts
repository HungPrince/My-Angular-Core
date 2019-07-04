import { ResponseStatusEnum } from "app/core/enums/response-status.enum";
import { UserService } from "./../services/user.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import { FORM_CONSTANTS } from "app/core/constants/form.constant";
import { SYSTEM_CONSTANT } from "app/core/constants/system.constant";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RoleService } from "../services/role.service";
import { NotificationService } from "app/services/notification.service";
import { MESSAGE_CONSTANTS } from "app/core/constants/message.constant";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"]
})
export class UserComponent implements OnInit {
  public listUsers: any[] = [];
  public listRoles: Array<any>;
  public pageIndex = SYSTEM_CONSTANT.PAGINATION.PAGE_INDEX;
  public pageSize = SYSTEM_CONSTANT.PAGINATION.PAGE_SIZE;
  public totalItems: number;
  public keyWord: string = "";
  public titleModal: string;
  public FORM_CONSTANT = FORM_CONSTANTS;
  public entitySelected: any;

  public entityForm: FormGroup;

  @ViewChild("modalAddEdit", null) public modalAddEdit;
  public entityModal: NgbModalRef;
  @ViewChild("modalDelete", null) public modalDelete;
  public modalDeleteRef: NgbModalRef;
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private notificationService: NotificationService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.getListUser();
    this.getListRole();
    this.initForm();
  }

  private initForm() {
    this.entityForm = this.formBuilder.group({
      username: [, Validators.compose([Validators.required])],
      fullname: [, Validators.compose([Validators.required])],
      roleId: [, Validators.compose([Validators.required])]
    });
  }

  private getListUser() {
    this.userService.getAll().subscribe(data => {
      this.listUsers = data;
    });
  }

  private getListRole() {
    this.roleService.getAll().subscribe(res => {
      this.listRoles = res;
    });
  }

  public onPageChanged(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.getListRole();
  }

  public onOpenModalAddEdit(entity: any) {
    if (entity) {
      this.titleModal = "Cập nhật";
      this.entityForm.removeControl("password");
      this.entityForm.removeControl("confirmPassword");
      for (let key in this.entityForm.value) {
        this.entityForm.get(key).setValue(entity[key]);
      }
    } else {
      this.titleModal = "Thêm mới";
      this.entityForm.addControl(
        "password",
        new FormControl("abc", Validators.compose([Validators.required]))
      );
      this.entityForm.addControl(
        "confirmPassword",
        new FormControl("123", Validators.compose([Validators.required]))
      );
      this.entityForm.reset();
    }
    this.entityModal = this.modalService.open(this.modalAddEdit);
  }

  public onSave() {
    let valueForm = { ...this.entityForm.value };
    if (valueForm.id) {
      this.updateUser(valueForm);
    } else {
      valueForm.id = 0;
      this.addUser(valueForm);
    }
  }

  private updateUser(user: any) {
    this.userService.update(user).subscribe(res => {
      if (res) {
        let index = this.listUsers.findIndex(x => x.id == res.id);
        this.listUsers[index] = res;
        this.notificationService.success(
          MESSAGE_CONSTANTS.UPDATED_OK_MSG,
          MESSAGE_CONSTANTS.SUCCESS
        );
        this.entityModal.close();
      }
    });
  }

  private addUser(user: any) {
    this.userService.add(user).subscribe(res => {
      if (res) {
        this.listUsers.push(res);
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
    this.userService.delete(this.entitySelected.id).subscribe(res => {
      if (res.status == ResponseStatusEnum.success) {
        this.listUsers = this.listUsers.filter(x => x.id != res.data.id);
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

  public isErrorPasswordPattern(name) {
    return (
      this.entityForm.get("password").value &&
      this.entityForm.get(name).value &&
      this.entityForm.get(name).value != this.entityForm.get("password").value
    );
  }
}
