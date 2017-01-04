import {NgModule} from "@angular/core";  
import {BrowserModule} from "@angular/platform-browser";  
import {HttpModule} from "@angular/http";  
import {FormsModule} from "@angular/forms";  
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

const routes: Routes = [
    { path: 'templates/new', component: TemplateCreateComponent },
    { path: 'templates', component: TemplateIndexComponent },
    { path: 'templates/:id/edit', component: TemplateEditComponent },
    { path: 'templates/:id/instance', component: TemplateInstanceCreateComponent }, 
    { path: 'template-instances', component: TemplateInstanceIndexComponent },
    { path: 'template-instances/:id', component: TemplateInstanceEditComponent },
    { path: 'images', component: ImageIndexComponent },
    { path: 'fonts', component: FontIndexComponent },
];

@NgModule({
    // directives, components, and pipes
    declarations: [
        AppComponent, NewTemplateInstanceComponent, NewTemplateComponent,SimpleTinyComponent,DisplayContentComponent,DisplayContentImgDragComponent,DisplayTableElementComponent,DisplayElementComponent,
        Draggable2,  NewTextElementComponent, NewFrameElementComponent, NewImageElementComponent, DisplayTableRowComponent, Resizable, ImageListComponent, FontSelectorComponent, ColorPickerDirective,
        TextSelectorComponent, FontListComponent, DisplayFontComponent, NewTableElementComponent, Draggable, NewElementComponent, DisplayGuideComponent, DisplayRulerComponent,
        NewTableRowComponent, DisplayPageComponent, ImageSelectorComponent, NewPageComponent, ElementSelectorComponent, PageSelectorComponent, RulerSelectorComponent, TemplateListComponent,
        TemplateInstanceListComponent, TemplateCreateComponent, TemplateIndexComponent, TemplateEditComponent, TemplateInstanceCreateComponent, TemplateInstanceIndexComponent, TemplateInstanceEditComponent,
        ImageIndexComponent, FontIndexComponent
        
    ],
    // modules
    imports: [
        BrowserModule,
        HttpModule,
        RouterModule.forRoot(routes),
        FormsModule,
        Ng2UploaderModule      
    ],
    // providers
    providers: [
        ColorPickerService
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }  


