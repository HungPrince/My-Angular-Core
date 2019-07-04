import { NgxPaginationModule } from "ngx-pagination";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ArticleComponent } from "./article.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NgSelectModule } from "@ng-select/ng-select";
import { PipesModule } from "app/pipes/pipes.module";

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

export const routes: Routes = [
  { path: "", redirectTo: "list", pathMatch: "full" },
  { path: "list", component: ArticleComponent, data: { breadcrum: "List" } }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgxPaginationModule,
    NgSelectModule,
    RouterModule.forChild(routes),
    CKEditorModule,
    PipesModule
  ],
  exports: [ArticleComponent],
  declarations: [ArticleComponent]
})
export class ArticleModule {}
