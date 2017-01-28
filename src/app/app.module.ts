import {NgModule} from "@angular/core";  
import {BrowserModule} from "@angular/platform-browser";  
import {HttpModule} from "@angular/http";  
import {FormsModule, ReactiveFormsModule } from "@angular/forms";  
import {MaterialModule} from '@angular/material'
import "rxjs/Rx";
import { RouterModule, Routes } from '@angular/router';
import { TemplateIndexComponent} from './template/template-index.component';
import { TemplateCreateComponent } from './template/create-template.component';
import { TemplateEditComponent } from './template/edit-template.component';
import { TemplateInstanceIndexComponent} from './template-instance/template-instance-index.component';
import { TemplateInstanceEditComponent} from './template-instance/edit-template-instance.component';
import { ImageIndexComponent} from './image/image-index.component';
import { TemplateInstanceCreateComponent} from './template-instance/create-template-instance.component';
import { FontIndexComponent} from './font/font-index.component';
import { AppComponent} from "./app.component";
import { NewTemplateInstanceComponent} from './template-instance/new-template-instance.component';
import { NewTemplateComponent} from './template/new-template.component';
import { SimpleTinyComponent } from './editor/simple-tiny.component'
import { DisplayContentComponent } from './content/display-content.component';
import { DisplayContentImgDragComponent } from './content/display-content-img-drag.component';
import { DisplayTableElementComponent } from './element/display-table-element.component'
import { DisplayElementComponent } from './element/display-element.component';
import { Draggable2 } from './draggable2.directive'
import { DisplayTableRowComponent } from './element/display-table-row.component'
import { NewTextElementComponent} from './element/new-text-element.component'
import { NewFrameElementComponent} from './element/new-frame-element.component'
import { Resizable } from './resizable.directive'
import { ImageListComponent} from './image/image-list.component';
import { Ng2UploaderModule} from 'ng2-uploader';
import { FontSelectorComponent} from './font/font-selector.component';
import { ColorPickerDirective, ColorPickerService} from 'angular2-color-picker'
import { TextSelectorComponent} from './editor/text-selector.component'
import { FontListComponent} from './font/font-list.component';
import { DisplayFontComponent } from './font/display-font.component' 
import { NewTableElementComponent} from './element/new-table-element.component'
import { Draggable} from './draggable.directive'
import { NewElementComponent } from './element/new-element.component';
import { DisplayGuideComponent } from './guide/display-guide.component'
import { DisplayRulerComponent } from './guide/display-ruler.component'
import { NewTableRowComponent } from './element/new-table-row.component'
import { DisplayPageComponent } from './page/display-page.component';
import { ImageSelectorComponent } from './image/image-selector.component';
import { NewPageComponent } from './page/new-page.component';
import { PageSelectorComponent } from './page/page-selector.component'
import { RulerSelectorComponent } from './guide/ruler-selector.component'
import { ElementSelectorComponent} from './element/element-selector.component';
import { TemplateListComponent} from './template/template-list.component';
import {TemplateInstanceListComponent} from './template-instance/template-instance-list.component';
import { NewImageElementComponent } from './element/new-image-element.component'
import {UserGuard} from './user/user.guard'
import {UserService} from './user/user.service'
import {UserStore} from './user/user.store'
import {UserLoginComponent} from './user/user-login.component'
import {PageService} from './page/page.service'
import {ImageSelector } from './image/image-selector'
import { MyMdMenu } from './element/my-md-menu'
import { Ng2DropdownModule } from 'ng2-material-dropdown';
import {FontService} from './font/font.service'
import {FontStore} from './font/font.store'
import {CellEditToolbar} from './element/cell-edit-toolbar.component'

const routes: Routes = [
    { path: 'templates/new', component: TemplateCreateComponent, canActivate: [UserGuard]},
    { path: 'templates', component: TemplateIndexComponent, canActivate: [UserGuard]},
    { path: 'templates/:id/edit', component: TemplateEditComponent, canActivate: [UserGuard]},
    { path: 'templates/:id/instance', component: TemplateInstanceCreateComponent, canActivate: [UserGuard] }, 
    { path: 'template-instances', component: TemplateInstanceIndexComponent, canActivate: [UserGuard] },
    { path: 'template-instances/:id', component: TemplateInstanceEditComponent, canActivate: [UserGuard] },
    { path: 'images', component: ImageIndexComponent, canActivate: [UserGuard] },
    { path: 'fonts', component: FontIndexComponent, canActivate: [UserGuard] },
    { path: 'login', component: UserLoginComponent },
    { path: '**', redirectTo: '/templates', pathMatch: 'full' },
];

@NgModule({
    // directives, components, and pipes
    declarations: [
        AppComponent, NewTemplateInstanceComponent, NewTemplateComponent,SimpleTinyComponent,DisplayContentComponent,DisplayContentImgDragComponent,DisplayTableElementComponent,DisplayElementComponent,
        Draggable2,  NewTextElementComponent, NewFrameElementComponent, NewImageElementComponent, DisplayTableRowComponent, Resizable, ImageListComponent, FontSelectorComponent, ColorPickerDirective,
        TextSelectorComponent, FontListComponent, DisplayFontComponent, NewTableElementComponent, Draggable, NewElementComponent, DisplayGuideComponent, DisplayRulerComponent,
        NewTableRowComponent, DisplayPageComponent, ImageSelectorComponent, NewPageComponent, ElementSelectorComponent, PageSelectorComponent, RulerSelectorComponent, TemplateListComponent,
        TemplateInstanceListComponent, TemplateCreateComponent, TemplateIndexComponent, TemplateEditComponent, TemplateInstanceCreateComponent, TemplateInstanceIndexComponent, TemplateInstanceEditComponent,
        ImageIndexComponent, FontIndexComponent, UserLoginComponent, MyMdMenu, CellEditToolbar
        
    ],
    // modules
    imports: [
        BrowserModule,
        HttpModule,
        RouterModule.forRoot(routes),
        FormsModule,
        ReactiveFormsModule,
        Ng2UploaderModule,
        MaterialModule.forRoot() ,
        Ng2DropdownModule      
    ],
    // providers
    providers: [
        ColorPickerService, UserService, UserGuard, UserStore, PageService, ImageSelector, FontService, FontStore
    ],
    bootstrap: [
        AppComponent
    ],
    entryComponents: [ImageSelectorComponent]
})
export class AppModule { }  


