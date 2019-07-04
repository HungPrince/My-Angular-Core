import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { CategoryComponent } from "./category.component";
import { NgModule } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SharesModule } from "../shares/shares.module";

export const routes: Routes = [
  { path: "", redirectTo: "list", pathMatch: "full" },
  { path: "list", component: CategoryComponent, data: { breadcrum: "List" } }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgxPaginationModule,
    SharesModule
  ],
  exports: [CategoryComponent],
  declarations: [CategoryComponent]
})
export class CategoryModule {}
