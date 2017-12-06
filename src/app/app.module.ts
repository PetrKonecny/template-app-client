import {NgModule, ElementRef} from "@angular/core"  
import {BrowserModule} from "@angular/platform-browser"  
import {HttpModule} from "@angular/http"  
import {FormsModule, ReactiveFormsModule } from "@angular/forms"  
import {MaterialModule} from '@angular/material'
import 'hammerjs'
import { RouterModule, Routes } from '@angular/router'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TemplateIndexComponent} from './template/template-index.component'
import { TemplateCreateComponent } from './template/create-template.component'
import { TemplateEditComponent } from './template/edit-template.component'
import { TemplateInstanceIndexComponent} from './template-instance/template-instance-index.component'
import { TemplateInstanceEditComponent} from './template-instance/edit-template-instance.component'
import { TemplateInstanceCreateComponent} from './template-instance/create-template-instance.component'
import { FontIndexComponent} from './font/font-index.component'
import { AppComponent} from "./app.component"
import { NewTemplateInstanceComponent} from './template-instance/new-template-instance.component'
import { NewTemplateComponent} from './template/new-template.component'
import { SimpleTinyComponent } from './editor/simple-tiny.component'
import { DisplayContentComponent } from './content/display-content.component'
import { DisplayContentImgDragComponent } from './content/display-content-img-drag.component'
import { DisplayTableElementComponent } from './element/display-table-element.component'
import { DisplayElementComponent } from './element/display-element.component'
import { Draggable2 } from './draggable.directive'
import { DisplayTableRowComponent } from './element/display-table-row.component'
import { NewTextElementComponent} from './element/new-text-element.component'
import { NewFrameElementComponent} from './element/new-frame-element.component'
import { ImageListComponent} from './image/image-list.component'
import { Ng2UploaderModule} from 'ng2-uploader' 
import { FontToolbarComponent} from './font/font-toolbar.component'
import { ColorPickerModule} from 'ngx-color-picker'
import { EditorToolbarComponent} from './editor/editor-toolbar.component'
import { FontListComponent} from './font/font-list.component'
import { DisplayFontComponent } from './font/display-font.component' 
import { NewTableElementComponent} from './element/new-table-element.component'
import { NewElementComponent } from './element/new-element.component'
import { DisplayGuideComponent } from './guide/display-guide.component'
import { DisplayRulerComponent } from './guide/display-ruler.component'
import { NewTableRowComponent } from './element/new-table-row.component'
import { DisplayPageComponent } from './page/display-page.component'
import { NewPageComponent } from './page/new-page.component'
import { PageSelectorComponent } from './page/page-selector.component'
import { ElementToolbarComponent} from './element/element-toolbar.component'
import { TemplateListComponent} from './template/template-list.component'
import { TemplateInstanceListComponent} from './template-instance/template-instance-list.component'
import { NewImageElementComponent } from './element/new-image-element.component'
import { UserGuard} from './user/user.guard'
import { UserService} from './user/user.service'
import { UserStore} from './user/user.store'
import { UserLoginComponent} from './user/user-login.component'
import { PageService} from './page/page.service'
import { Ng2DropdownModule } from 'ng2-material-dropdown'
import { FontService} from './font/font.service'
import { FontStore} from './font/font.store'
import { CellEditToolbar} from './element/cell-edit-toolbar.component'
import { AppConfig} from './app.config'
import { APP_INITIALIZER } from '@angular/core'
import { TagInputModule } from 'ngx-chips'
import { SaveTemplateModal } from './template/save-template.modal'
import { TemplateInstanceStore } from './template-instance/template-instance.store'
import { TemplateInstanceService } from './template-instance/template-instance.service'
import { TemplateService } from './template/template.service'
import { DisplayImageElementComponent} from './element/display-image-element.component'
import { DisplayTextElementComponent} from './element/display-text-element.component'
import { DisplayFrameElementComponent} from './element/display-frame-element.component'
import { UserListComponent } from './user/user-list.component'
import { UserIndexComponent } from './user/user-index.component'
import { UserTemplatesComponent } from './template/user-templates.component'
import { UserTemplateInstancesComponent } from './template-instance/user-template-instances.component'
import { TemplateSearchComponent } from './template/template-search.component'
import { FileUploadModule } from 'ng2-file-upload/file-upload/file-upload.module'
import { ElementHandleComponent } from './element/element-handle.component'
import { ImageHandleComponent } from './content/image-handle.component'
import { NgxDatatableModule } from '@swimlane/ngx-datatable'
import {TemplateEditForm} from './template/template-edit-form.component'
import {CreateTableModal} from './element/create-table-element.modal'
import {PageFactory} from './page/page.factory'
import {CreateTemplateModal} from './template/create-template.modal'
import { ImageService } from './image/image.service'
import { ImageComponent} from './image/image.component'
import { UploadComponent } from './uploader.component'
import { ColorPickerComponent } from './color-picker.component'
import { PositionForm } from './element/position-form.component'
import {ElementHttpService} from './element/element-http.service'
import {ContentHttpService} from './content/content-http.service'
import {PageHttpService} from './page/page-http.service'
import { SaveTemplateInstanceModal} from './template-instance/save-template-instance.modal'
import { AlbumHttpService } from './album/album-http.service'
import { AlbumIndexComponent } from './album/album-index.component'
import { AlbumGridComponent } from './album/album-grid.component'
import { DisplayAlbumComponent } from './album/display-album.component'
import { DisplayAlbumSidenavComponent } from './album/display-album-sidenav.component'
import { AlbumIndexSidenavComponent } from './album/album-index-sidenav.component'
import { SaveAlbumModal } from './album/save-album.modal'
import { SelectAlbumModal } from './album/select-album.modal'
import { NewTableCellComponent } from './element/new-table-cell.component'
import {ImageUploadComponent} from './image/image-uploader.component'
import { LOCALE_ID } from '@angular/core';
import {DisplayUserComponent} from './user/display-user.component'
import {AlbumMenuComponent} from './album/album-menu.component'
import {AlbumStore} from './album/album.store'
import {AboutComponent} from './about.component'
import {TemplateDemoComponent} from './template/template-demo.component'
import { MessageDialog } from './message.dialog'
import { AlbumListComponent } from './album/album-list.component'
import { TemplateStore } from './template/template.store'
import { InframeImageUploaderComponent } from './image/inframe-image-uploader.component'
/** defines every route in the application and redirects if 
no route matches
*/ 
const routes: Routes = [
    { path: 'users', component: UserIndexComponent},
    { path: 'users/:id/templates', component: UserTemplatesComponent},
    { path: 'users/:id/template-instances', component: UserTemplateInstancesComponent},
    { path: 'templates/new', component: TemplateCreateComponent},
    { path: 'templates', component: TemplateIndexComponent},
    { path: 'templates/:id/edit', component: TemplateEditComponent},
    { path: 'templates/:id/form-edit', component: TemplateEditForm},
    { path: 'templates/search', component: TemplateSearchComponent},
    { path: 'templates/:id/instance', component: TemplateInstanceCreateComponent }, 
    { path: 'template-instances', component: TemplateInstanceIndexComponent },
    { path: 'template-instances/:id', component: TemplateInstanceEditComponent },
    { path: 'albums', component: AlbumIndexComponent },
    { path: 'albums/:id',component: DisplayAlbumComponent },
    { path: 'users/:id',component: DisplayUserComponent },
    { path: 'about', component: AboutComponent},
    { path: 'demo', component: TemplateDemoComponent},
    { path: '**', redirectTo: '/about', pathMatch: 'full' },
]

@NgModule({
    // directives, components, and pipes
    declarations: [
        AppComponent, NewTemplateInstanceComponent, NewTemplateComponent,SimpleTinyComponent,DisplayContentComponent,DisplayContentImgDragComponent,DisplayTableElementComponent,DisplayElementComponent,
        Draggable2,  NewTextElementComponent, NewFrameElementComponent, NewImageElementComponent, DisplayTableRowComponent, ImageListComponent, FontToolbarComponent,
        EditorToolbarComponent, FontListComponent, DisplayFontComponent, NewTableElementComponent, NewElementComponent, DisplayGuideComponent, DisplayRulerComponent,
        NewTableRowComponent, DisplayPageComponent, NewPageComponent, ElementToolbarComponent, PageSelectorComponent, TemplateListComponent,
        TemplateInstanceListComponent, TemplateCreateComponent, TemplateIndexComponent, TemplateEditComponent, TemplateInstanceCreateComponent, TemplateInstanceIndexComponent, TemplateInstanceEditComponent,
        FontIndexComponent, UserLoginComponent, CellEditToolbar, SaveTemplateModal, DisplayImageElementComponent, DisplayTextElementComponent, DisplayFrameElementComponent,
        UserListComponent,UserTemplatesComponent, UserIndexComponent, UserTemplateInstancesComponent, TemplateSearchComponent, ElementHandleComponent, ImageHandleComponent,
        TemplateEditForm, CreateTableModal, CreateTemplateModal, ImageComponent, UploadComponent, ColorPickerComponent, PositionForm,
        SaveTemplateInstanceModal, AlbumIndexComponent, AlbumGridComponent, DisplayAlbumComponent,
        DisplayAlbumSidenavComponent,AlbumIndexSidenavComponent, SaveAlbumModal, SelectAlbumModal, NewTableCellComponent, ImageUploadComponent,
        DisplayUserComponent, AlbumMenuComponent, AboutComponent, TemplateDemoComponent, MessageDialog, AlbumListComponent, InframeImageUploaderComponent
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
        Ng2DropdownModule,
        TagInputModule,
        FileUploadModule,
        NgxDatatableModule,
        ColorPickerModule,
        BrowserAnimationsModule       
    ],
    // providers
    providers: [
        {provide: LOCALE_ID, useValue: "cz-EU" }, AlbumStore, ImageService, TemplateInstanceService, UserService, ElementHttpService, AlbumHttpService, ContentHttpService, PageHttpService, UserGuard, UserStore, PageService, FontService, FontStore, AppConfig, PageFactory, TemplateService, TemplateInstanceService, TemplateInstanceStore, TemplateStore, TemplateService         
    ],
    bootstrap: [
        AppComponent
    ],
    //these components are used as dialogs
    entryComponents: [SaveTemplateModal, CreateTableModal, CreateTemplateModal, UploadComponent, ImageUploadComponent, ColorPickerComponent, SaveTemplateInstanceModal, SaveAlbumModal, SelectAlbumModal, DisplayUserComponent, MessageDialog]
})

export class AppModule { }  

