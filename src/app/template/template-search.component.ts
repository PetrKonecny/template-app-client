import { Component, OnInit} from '@angular/core';
import {TemplateListComponent} from './template-list.component';
import { TemplateService } from './template.service';
import { Template} from './template';
import { Observable }     from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router'
import {UserStore} from '../user/user.store'

@Component({
    selector: 'template-index',
    template: `
        <md-toolbar>
            <form (ngSubmit)="onSearchKeyUp(search.value)">
                <md-input-container><input #search mdInput value={{query}} type="search"></md-input-container>
                <button md-icon-button><md-icon>search</md-icon></button>
            </form>
        </md-toolbar>
        <md-progress-bar mode="indeterminate" *ngIf="loading && !error"></md-progress-bar>
        <div class="shutter" *ngIf="error">
                <md-icon style="font-size: 96px; opacity: 0.1;">error</md-icon>
        </div>
        <div class="index-content">
        <div style="opacity: 0.5; width: 100%; height: 20%; display: flex; align-items: center; justify-content: center;" *ngIf="!loading && !templates.length">
            <h3>Žádné výsledky na dotaz "{{query}}"</h3>
        </div>
        <template-list [templates] = "templates" [user]="userStore.user | async" (onDeleteClicked) = "onDeleteClicked($event)"></template-list>
    `,
    providers: []
})
//displays search results for the templates
export class TemplateSearchComponent implements OnInit  {
    
    //error while searching
    error: string;
    //loading indicator
    loading: boolean = true;

    query: string;
    //array of serched templates
    templates : Template[];

    /**
     @param tempalteService - injected service that calls API search
     @param router - injects router to refresh search url
     @param route - injects service to get search query from param
     @param userStore - injects store that stores current user
    */
    constructor(
        private templateService: TemplateService, private router: Router, private route: ActivatedRoute, private userStore: UserStore
    ){ }
    
    
    ngOnInit(){
        this.getTemplates();
        this.route.params.subscribe((params)=>{
            this.query = params['query']
        })
    }

    //triggers on search field submit
    onSearchKeyUp(query: string){
        this.router.navigate(['/templates/search', {query:query}]);
    }
    
    //triggers actions on the templates
    onDeleteClicked(template: Template){
        this.templateService.removeTemplate(template.id).subscribe(res => this.deleteFromList(template));
    }
    
    //removes template from the search list
    deleteFromList(template: Template){
        var index = this.templates.indexOf(template);
        this.templates.splice(index,1);
    }
    
    //calls API search to get templates
    getTemplates(){      
        this.route.params.subscribe(params => {
            this.loading =true
            let query = params['query'];
            this.templateService.searchTemplates(query).subscribe(
                               templates => {
                                   this.templates = templates
                                   this.loading = false
                               },
                               error =>  {
                                   this.error = <any>error
                                   this.loading = false
                               }
            ); 
        });
    }
     
}