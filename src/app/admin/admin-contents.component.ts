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

//displays contents index in the admin section
export class AdminContentsComponent implements OnInit {
    
    //error when loading the contents
    errorMessage: string;
    //array of contents to display
    contents : Content[];
    //loading indicator
    loading = true;

    /**
    @param contentService - content service to get contents from API
    */
    constructor(
        private contentService: ContentHttpService
    ){}

    //gets contents from the API
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
