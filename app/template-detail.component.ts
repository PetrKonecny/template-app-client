import { Component, Input, OnInit } from '@angular/core';
import {Template} from './template';
import { RouteParams } from '@angular/router-deprecated';
import { TemplateService } from './template.service';


@Component({
    selector: 'my-hero-detail',
    template: `
          <h2>{{template.name}} details!</h2>
          <div><label>id: </label>{{template.id}}</div>
          <div>
            <label>name: </label>
            <input [(ngModel)]="template.name" placeholder="name"/>
          </div>
    `

})
export class TemplateDetailComponent implements OnInit {

    @Input()
    template: Template;
    errorMessage: string;

    ngOnInit() {
        let id = + this._routeParams.get('id');
        this._templateService.getTemplate(id)
            .subscribe(
            template => this.template = template,
            error => this.errorMessage = <any>error);
    }

    constructor(
        private _templateService: TemplateService,
        private _routeParams: RouteParams) {
    }
}