import { Component, OnInit, Input} from '@angular/core';
import {TemplateListComponent} from '../template/template-list.component';
import { TemplateService } from '../template/template.service';
import { Content} from '../content/content';
import { Observable }     from 'rxjs/Observable';
import {User } from '../user/user'
import {ActivatedRoute} from '@angular/router';
import {ContentHttpService} from '../content/content-http.service'

@Component({
    selector: 'admin-contents',
    template: `
        <content-table [rows] = "contents" [loadingIndicator]="loading" (onDeleteClicked) = "onDeleteClicked($event)"></content-table>
    `,
    providers: []
})

export class AdminContentsComponent implements OnInit {
    
    errorMessage: string;
    contents : Content[];
    loading = true;

    constructor(
        private contentService: ContentHttpService
    ){}

    ngOnInit(){
        this.contentService.getContents().subscribe(
        contents=>{
            this.contents = contents
            this.loading = false
        },
        error =>{
            this.errorMessage = error
            this.loading = false
        })
    }
}
