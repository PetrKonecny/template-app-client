import { Component, OnInit, Input} from '@angular/core'
import { TemplateInstanceService } from '../template-instance/template-instance.service'
import { TemplateInstance } from '../template-instance/template-instance'
import { MdSnackBar } from '@angular/material'
import { Router } from '@angular/router'

@Component({
    selector: 'admin-template-instances',
    template: `
        <template-instance-table [rows] = "templateInstances" [loadingIndicator]="loading" (onDelete) = "onDelete($event)" (onEdit)="onEdit($event)"></template-instance-table>
    `,
    providers: []
})

//displays documents in the admin section
export class AdminTemplateInstancesComponent implements OnInit {
    
    //error thrown when loading documents
    errorMessage: string;
    //array of documents to be displayed
    templateInstances : TemplateInstance[];
    //loading indicators
    loading = true;

    /**
    @param templateInstanceService - service to get documents from the API
    @param snackBar - snack bar to display errors on
    @param router - router used for navigating in the app
    */
    constructor(
        private templateInstanceService: TemplateInstanceService, private snackBar: MdSnackBar, private router: Router
    ){}

    //triggered when delete is clicked
    onDelete(selected){
        selected.forEach((templateInst)=>{
           this.templateInstanceService.removeTemplateInstance(templateInst.id).subscribe(
               ()=>{
                   this.templateInstances.splice(this.templateInstances.indexOf(templateInst),1)
               },
               error =>{
                   this.errorMessage = error
               }
           )
        })
    }

    //trigered when edit is clicked
    onEdit(selected){
        this.router.navigate(['/admin/template-instances',selected.id,'edit'])
    }

    //loads documents form the API
    ngOnInit(){
        this.templateInstanceService.getTemplateInstances().subscribe(
        templateInstances=>{
            templateInstances.forEach(templateInst =>(<any>templateInst).tagged = templateInst.tagged.map((tag)=>tag.tag_name))
            this.templateInstances = templateInstances
            this.loading = false
        },
        error =>{
            this.errorMessage = error
            this.loading = false
        })
    }
}
