//TO-DO : proof of concept, this should be done through one core module 
import { NgModule, ElementRef} from "@angular/core"  
import { BrowserModule} from "@angular/platform-browser"  
import { HttpModule} from "@angular/http"  
import { FormsModule, ReactiveFormsModule } from "@angular/forms"  
import { MaterialModule} from '@angular/material'
import 'hammerjs'
import { RouterModule, Routes } from '@angular/router'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent} from "./app.component"
import { Ng2UploaderModule} from 'ng2-uploader' 
import { UserService} from '../../src/app/user/user.service'
import { UserStore} from '../../src/app/user/user.store'
import { PageService} from '../../src/app/page/page.service'
import { FontService} from '../../src/app/font/font.service'
import { FontStore} from '../../src/app/font/font.store'
import { AppConfig} from '../../src/app/app.config'
import { APP_INITIALIZER } from '@angular/core'
import { TagInputModule } from 'ng2-tag-input'
import { TemplateInstanceStore } from '../../src/app/template-instance/template-instance.store'
import { TemplateInstanceService } from '../../src/app/template-instance/template-instance.service'
import { TemplateService } from '../../src/app/template/template.service'
import { FileUploadModule } from 'ng2-file-upload/file-upload/file-upload.module'
import { NgxDatatableModule } from '@swimlane/ngx-datatable'
import { AdminIndexComponent} from './admin-index.component'
import { AdminTemplatesComponent} from './template/admin-templates.component'
import { AdminUsersComponent} from './user/admin-users.component'
import { AdminTemplateInstancesComponent} from './template-instance/admin-template-instances.component'
import { UserTableComponent} from './user/user-table.component'
import { TemplateInstanceTableComponent} from './template-instance/template-instance-table.component'
import { TemplateTableComponent } from './template/template-table.component'
import { ImageService } from '../../src/app/image/image.service'
import { ElementHttpService} from '../../src/app/element/element-http.service'
import { ElementTableComponent} from './element/element-table.component'
import { AdminElementsComponent} from './element/admin-elements.component'
import { ContentHttpService} from '../../src/app/content/content-http.service'
import { ContentTableComponent} from './content/content-table.component'
import { AdminContentsComponent} from './content/admin-contents.component'
import { FontTableComponent} from './font/font-table.component'
import { AdminFontsComponent} from './font/admin-fonts.component'
import { PageHttpService} from '../../src/app/page/page-http.service'
import { PageTableComponent} from './page/page-table.component'
import { AdminPagesComponent} from './page/admin-pages.component'
import { AlbumHttpService } from '../../src/app/album/album-http.service'
import { AdminAlbumsComponent} from './album/admin-albums.component'
import { AlbumTableComponent} from './album/album-table.component'
import { LOCALE_ID } from '@angular/core';
import { AlbumStore} from '../../src/app/album/album.store'
import { TemplateStore } from '../../src/app/template/template.store'
import { UserGuard } from '../../src/app/user/user.guard'
/** defines every route in the application and redirects if 
no route matches
*/ 
const routes: Routes = [
    { path: 'admin', redirectTo: 'admin/templates',},
    { path: 'admin/templates', component: AdminTemplatesComponent },
    { path: 'admin/template-instances', component: AdminTemplateInstancesComponent },
    { path: 'admin/users', component: AdminUsersComponent },
    { path: 'admin/elements', component: AdminElementsComponent },
    { path: 'admin/contents', component: AdminContentsComponent },
    { path: 'admin/fonts', component: AdminFontsComponent },
    { path: 'admin/pages', component: AdminPagesComponent },
    { path: 'admin/albums', component: AdminAlbumsComponent },
    { path: '**', redirectTo: '/admin', pathMatch: 'full' },
]

@NgModule({
    // directives, components, and pipes
    declarations: [
        AppComponent, AdminIndexComponent, AdminTemplatesComponent, AdminUsersComponent, AdminTemplateInstancesComponent, UserTableComponent, TemplateInstanceTableComponent
        , ElementTableComponent, AdminElementsComponent, ContentTableComponent, AdminContentsComponent, TemplateTableComponent,
        FontTableComponent,AdminFontsComponent, PageTableComponent, AdminPagesComponent,  AdminAlbumsComponent, AlbumTableComponent
    ],
    // modules
    /**
    using 5 external libraries
    1 - Ng2Uploader - library used for uploading images/fonts to the server
    2 - Ng2Dropdown - provides easy dropdown menu used in font toolbar
    3 - TagInput - provides field in forms for adding tags
    4 - NgXDatatable - used in administrative section to provide tables
    5 - ColorPicker - used in the editor for picking colors
    */
    imports: [
        BrowserModule,
        HttpModule,
        RouterModule.forRoot(routes),
        FormsModule,
        ReactiveFormsModule,
        Ng2UploaderModule,
        MaterialModule,
        TagInputModule,
        FileUploadModule,
        NgxDatatableModule,
        BrowserAnimationsModule       
    ],
    // providers
    providers: [
        AppConfig, FontStore, {provide: LOCALE_ID, useValue: "cz-EU" }, AlbumStore, ImageService, TemplateInstanceService, UserService, ElementHttpService, AlbumHttpService, ContentHttpService, PageHttpService, UserStore, PageService, FontService, TemplateService, TemplateInstanceService, TemplateInstanceStore, TemplateStore, TemplateService, UserGuard         
    ],
    bootstrap: [
        AppComponent
    ],
    //these components are used as dialogs
})

export class AppModule { }  

export function initConfig(config: AppConfig){
 //return () => config.load() 
}
//loads config from the root of this app
