import { Component }       from '@angular/core';
import { HTTP_PROVIDERS }    from '@angular/http';
import { ROUTER_DIRECTIVES} from '@angular/router'
import { NewTemplateComponent } from './new-template.component';

@Component({
    selector: 'my-app',
    template: `
    <h1>{{title}}</h1>
        <a routerLink="/templates" routerLinkActive="active">Templates</a>
        <a routerLink="/template-instances" routerLinkActive="active">Template Instances</a>\n\
        <a routerLink="/images" routerLinkActive="active">Images</a>
        <router-outlet></router-outlet>
    `,
    directives: [ROUTER_DIRECTIVES],
    providers: [
        HTTP_PROVIDERS
    ]
})

export class AppComponent {
    title = 'Template App';
}
