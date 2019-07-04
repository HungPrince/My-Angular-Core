import { Routes, RouterModule } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";

import { PagesComponent } from "./pages.component";
import { BlankComponent } from "./blank/blank.component";

export const routes: Routes = [
    {
        path: "",
        component: PagesComponent,
        children: [
            { path: "", redirectTo: "dashboard", pathMatch: "full" },
            {
                path: "dashboard",
                loadChildren:
                    "app/pages/dashboard/dashboard.module#DashboardModule",
                data: { breadcrumb: "Dashboard" }
            },
            // {
            //     path: "users",
            //     loadChildren: () =>
            //         import("app/pages/user/user.module").then(
            //             m => m.UserModule
            //         ),
            //     data: { breadcrumb: "Users" }
            // },
            {
                path: "users",
                loadChildren: "app/pages/user/user.module#UserModule",
                data: { breadcrumb: "Users" }
            },
            {
                path: "roles",
                loadChildren: "app/pages/role/role.module#RoleModule",
                data: { breadcrumb: "Roles" }
            },
            {
                path: "functions",
                loadChildren:
                    "app/pages/function/function.module#FunctionModule",
                data: { breadcrumb: "Functions" }
            },
            {
                path: "categories",
                loadChildren:
                    "app/pages/category/category.module#CategoryModule",
                data: { breadcrumb: "Categories" }
            },
            {
                path: "articles",
                loadChildren: "app/pages/article/article.module#ArticleModule",
                data: { breadcrumb: "Articles" }
            },
            {
                path: "media",
                loadChildren: "app/pages/media/media.module#MediaModule",
                data: { breadcrumb: "Media" }
            },
            {
                path: "web-link",
                loadChildren: "app/pages/web-link/web-link.module#WebLinkModule"
            },
            {
                path: "blank",
                component: BlankComponent,
                data: { breadcrumb: "Blank page" }
            }
        ]
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
