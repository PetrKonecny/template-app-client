import {NgModule} from "@angular/core";  
import {BrowserModule} from "@angular/platform-browser";  
import {HttpModule} from "@angular/http";  
import {FormsModule} from "@angular/forms";  
import "rxjs/Rx";
import { RouterModule, Routes } from '@angular/router';
import { TemplateIndexComponent} from './template-index.component';
import { TemplateCreateComponent } from './create-template.component';
import { TemplateEditComponent } from './edit-template.component';
import { TemplateInstanceIndexComponent} from './template-instance-index.component';
import { TemplateInstanceEditComponent} from './edit-template-instance.component';
import { ImageIndexComponent} from './image-index.component';
import { TemplateInstanceCreateComponent} from './create-template-instance.component';
import { FontIndexComponent} from './font-index.component';
import { AppComponent} from "./app.component";
import { NewTemplateInstanceComponent} from './new-template-instance.component';
import { NewTemplateComponent} from './new-template.component';
import { SimpleTinyComponent } from './simple-tiny.component'
import { DisplayContentComponent } from './display-content.component';
import { DisplayContentImgDragComponent } from './display-content-img-drag.component';
import { DisplayTableElementComponent } from './display-table-element.component'
import { DisplayElementComponent } from './display-element.component';
import { Draggable2 } from './draggable2.directive'
import { DisplayTableRowComponent } from './display-table-row.component'
import { NewTextElementComponent} from './new-text-element.component'
import { NewFrameElementComponent} from './new-frame-element.component'
import { Resizable } from './resizable.directive'
import { ImageListComponent} from './image-list.component';
import { UPLOAD_DIRECTIVES} from 'ng2-uploader/ng2-uploader';
import { FontSelectorComponent} from './font-selector.component';
import { ColorPickerDirective, ColorPickerService} from 'angular2-color-picker'
import { TextSelectorComponent} from './text-selector.component'
import { FontListComponent} from './font-list.component';
import { DisplayFontComponent } from './display-font.component' 
import { NewTableElementComponent} from './new-table-element.component'
import { Draggable} from './draggable.directive'
import { NewElementComponent } from './new-element.component';
import { DisplayGuideComponent } from './display-guide.component'
import { DisplayRulerComponent } from './display-ruler.component'
import { NewTableRowComponent } from './new-table-row.component'
import { DisplayPageComponent } from './display-page.component';
import { ImageSelectorComponent } from './image-selector.component';
import { NewPageComponent } from './new-page.component';
import { PageSelectorComponent } from './page-selector.component'
import { RulerSelectorComponent } from './ruler-selector.component'
import { ElementSelectorComponent} from './element-selector.component';
import { TemplateListComponent} from './template-list.component';
import {TemplateInstanceListComponent} from './template-instance-list.component';
import { NewImageElementComponent } from './new-image-element.component'

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
        Draggable2,  NewTextElementComponent, NewFrameElementComponent, NewImageElementComponent, DisplayTableRowComponent, Resizable, ImageListComponent, FontSelectorComponent, UPLOAD_DIRECTIVES, ColorPickerDirective,
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
        FormsModule
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


