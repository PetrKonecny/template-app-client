import { Component }       from '@angular/core';
import { HTTP_PROVIDERS }    from '@angular/http';
import { ROUTER_DIRECTIVES} from '@angular/router'
import { TemplateInstanceService } from './template-instance.service';
import { TemplateService } from './template.service';
import { TemplateInstanceStore } from './template-instance.store';
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
    directives: [ROUTER_DIRECTIVES],
    providers: [
        HTTP_PROVIDERS, TemplateInstanceService,TemplateInstanceStore,TemplateService ]
})

export class AppComponent {
    title = 'Template App';
}
