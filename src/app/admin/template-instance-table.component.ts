import { Component,Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { TemplateInstance} from '../template-instance/template-instance';
import { Router } from '@angular/router'
 
@Component({
    selector: 'template-instance-table',
    template: `
        <md-toolbar style="position: fixed; z-index:1000;">
            <md-input-container><input #search mdInput type="search" placeholder="filter" (keyup)='updateFilter(search.value)'></md-input-container>
            <button  *ngIf="selected.length" md-button>Delete</button>
            <button *ngIf="selected.length == 1" md-button>Edit</button>
            <button *ngIf="selected.length == 1" md-button>Open in editor</button>
        </md-toolbar>
         <ngx-datatable
             class="material"
             style="padding-top: 64px;"
            [columnMode]="'force'"
            [headerHeight]="50"
            [loadingIndicator]="loadingIndicator"
            [footerHeight]="50"
            [rowHeight]="'auto'"
            [selected]="selected"
            [selectionType]="'multi'"
            [rows]="templateInstances"
            [columns]="columns">
          </ngx-datatable>
    `,
})

export class TemplateInstanceTableComponent  {
        
    
    @Input()
    templateInstances : TemplateInstance[] 

    selected = [];
    temp = [];

    @Input()
    loadingIndicator: boolean = true;

    columns = [
        { prop: 'id'},
        { prop: 'name'},
        { prop: 'created_at'},
        { prop: 'updated_at'},
        { prop: 'template_id'},
        { prop: 'user_id'}
    ]
    
    @Output() 
    onDeleteClicked = new EventEmitter<TemplateInstance>();

    
    constructor(private router: Router){}
    
    onSelect({ selected }) {
        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
    }

    onActivate(event) {
    }


    updateFilter(val: string) {
        if(!this.temp.length && this.templateInstances.length){
          this.temp = [...this.templateInstances];
        }
        // filter our data
        let temp = this.temp.filter(function(d) {
          return d.name.toLowerCase().indexOf(val) !== -1 || !val;
        });

        // update the rows
        this.templateInstances = temp;
    }
}