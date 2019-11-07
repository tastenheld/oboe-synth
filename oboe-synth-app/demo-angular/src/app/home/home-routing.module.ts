import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { HomeComponent } from "./home.component";

const ROUTES: Routes = [
    { path: "", component: HomeComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(ROUTES)],
    exports: [NativeScriptRouterModule]
})
export class HomeRoutingModule { }
