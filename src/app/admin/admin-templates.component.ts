import { Component, OnInit, Input} from '@angular/core';
import {TemplateListComponent} from '../template/template-list.component';
import { TemplateService } from '../template/template.service';
import { Template} from '../template/template';
import { Observable }     from 'rxjs/Observable';
import {User } from '../user/user'
import {ActivatedRoute} from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router'

@Component({
    selector: 'admin-templates',
    template: `
        <template-table [rows]="templates" [loadingIndicator]="loading" (onDelete) = "onDelete($event)" (onEdit)="onEdit($event)"></template-table>
    `,
    providers: []
})

//displays template section in the admin section
export class AdminTemplatesComponent implements OnInit {
    
    //error thrown on loading templates
    errorMessage: string;
    //array of templates to be displayed
    templates : Template[];
    //loading indicator
    loading = true;

    /**
    @param tempalteService - service that loads documents from the API
    @param snackBar - snack bar to display error on
    @param router - router used to navigate
    @
    */
    constructor(
        private templateService: TemplateService, private snackBar: MdSnackBar, private router: Router
    ){}

    //triggered when delete clicked
    onDelete(selected){
        selected.forEach((template)=>{
           this.templateService.removeTemplate(template.id).subscribe(
               ()=>{
                   this.templates.splice(this.templates.indexOf(template),1)
               },
               error =>{
                   this.errorMessage = error
               }
           )
        })
    }

    //triggered when edit clicked
    onEdit(selected){
        this.router.navigate(['/admin/templates',selected.id,'edit'])
    }

    //loads templates from the api
    ngOnInit(){
        this.templateService.getTemplates().subscribe(
        templates=>{
            this.templates = templates
            this.templates.forEach(template=>{              
                (<any>template).tagged = template.tagged.map((tag)=>tag.tag_name)
            })
            this.loading = false
        },
        error =>{
            this.errorMessage = error
            this.loading = false
        })
    }
}
