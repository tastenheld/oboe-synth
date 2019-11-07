import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { SettingsComponent } from "./settings.component";

const ROUTES: Routes = [
	{ path: "", component: SettingsComponent }
];

@NgModule({
	imports: [NativeScriptRouterModule.forChild(ROUTES)],
	exports: [NativeScriptRouterModule]
})
export class SettingsRoutingModule { }