import { NgxPaginationModule } from "ngx-pagination";
import { NgModule } from "@angular/core";
import { NgxLoadingModule, ngxLoadingAnimationTypes } from "ngx-loading";
import { PaginationComponent } from "./components/pagination/pagination.component";
import { DeleteComponent } from "./components/delete/delete.component";
import { CommonModule } from "@angular/common";

@NgModule({
    imports: [
        CommonModule,
        NgxPaginationModule,
        NgxLoadingModule.forRoot({
            animationType: ngxLoadingAnimationTypes.wanderingCubes,
            backdropBackgroundColour: "rgba(0,0,0,0.1)",
            backdropBorderRadius: "4px",
            primaryColour: "#ffffff",
            secondaryColour: "#ffffff",
            tertiaryColour: "#ffffff"
        })
    ],
    exports: [NgxLoadingModule, PaginationComponent, DeleteComponent],
    declarations: [PaginationComponent, DeleteComponent]
})
export class SharesModule {}
