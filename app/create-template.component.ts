import { Component, OnInit} from '@angular/core';
import {NewTemplateComponent} from './new-template.component';
import { Template} from './template';

@Component({
    selector: 'template-edit',
    template: `
        <h2>Edit Template</h2>
        <create-new-template [template] = template></create-new-template>
    `,
    directives: [NewTemplateComponent]
})

export class TemplateCreateComponent implements OnInit  {
    
    template : Template;
    
    ngOnInit(){
        this.template = new Template();
    }
}