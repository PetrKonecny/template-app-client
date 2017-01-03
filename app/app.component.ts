import { Component }       from '@angular/core';
import { TemplateInstanceService } from './template-instance.service';
import { TemplateService } from './template.service';
import { TemplateInstanceStore } from './template-instance.store';
import { Draggable} from './draggable.directive'

@Component({
    selector: 'my-app',
    template: `
    <h1>{{title}}</h1>
        <a routerLink="/templates" routerLinkActive="active">Templates</a>
        <a routerLink="/template-instances" routerLinkActive="active">Template Instances</a>\n\
        <a routerLink="/images" routerLinkActive="active">Images</a>\n\
        <a routerLink="/fonts" routerLinkActive="active">Fonts</a>
        <router-outlet></router-outlet>
    `,
    providers: [
        TemplateInstanceService,TemplateInstanceStore,TemplateService,Draggable ]
})

export class AppComponent {
    title = 'Template App';
}
