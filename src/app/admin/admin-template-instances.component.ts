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

export class AdminTemplateInstancesComponent implements OnInit {
    
    errorMessage: string;
    templateInstances : TemplateInstance[];
    loading = true;

    constructor(
        private templateInstanceService: TemplateInstanceService, private snackBar: MdSnackBar, private router: Router
    ){}

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

    onEdit(selected){
        this.router.navigate(['/admin/template-instances',selected.id,'edit'])
    }

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
