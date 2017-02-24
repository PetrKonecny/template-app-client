import { Component, OnInit} from '@angular/core';


@Component({
    selector: 'admin-index',
    template: `
        <md-card><md-card-title>Users
        </md-card-title>
        	<md-card-content>	
	        	<div>
	        		Total users:
	        	</div>
	        	<div>
	        		Last added:
	        	</div>
	        	<div>
	        		Last updated:
	        	</div>
	        	<div>
	        		Currently online:
	        	</div>
        	</md-card-content>
        	<md-card-actions>
        		<a md-raised-button color="accent" routerLink="users">Manage users</a>
        	</md-card-actions>
    	</md-card>
        <md-card><md-card-title>Templates</md-card-title>
        	<md-card-content>	
	        	<div>
	        		Total templates:
	        	</div>
	        	<div>
	        		Last added:
	        	</div>
	        	<div>
	        		Last updated:
	        	</div>	      
	        	</md-card-content>
        	<md-card-actions>
        		<a md-raised-button color="accent" routerLink="templates">Manage templates</a>
        	</md-card-actions>
    	</md-card>
        <md-card><md-card-title>Documents</md-card-title>
        	<md-card-content>	
	        	<div>
	        		Total templates:
	        	</div>
	        	<div>
	        		Last added:
	        	</div>
	        	<div>
	        		Last updated:
	        	</div>	      
	        	</md-card-content>
        	<md-card-actions>
        		<a md-raised-button color="accent" routerLink="template-instances">Manage templates</a>
        	</md-card-actions>
        </md-card>
        <md-card><md-card-title>Images</md-card-title>
        	<md-card-content>	
	        	<div>
	        		Total templates:
	        	</div>
	        	<div>
	        		Last added:
	        	</div>
	        	<div>
	        		Last updated:
	        	</div>	      
	        	</md-card-content>
        	<md-card-actions>
        		<a md-raised-button color="accent">Manage images</a>
        	</md-card-actions>
        </md-card>
        <md-card><md-card-title>Fonts</md-card-title>

        </md-card>        
    `,
    styles: [`
    	md-card{
    		margin: 6px;
    		width: 40%;
    		height: 20%;
    	}

    `]
})

export class AdminIndexComponent {
    
     
}