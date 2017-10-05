import { Component, Input} from '@angular/core';

@Component({
    selector: 'message-dialog',
    template: `
    <div class="MessageDialog">
    <h2 md-dialog-title>{{title}}</h2>
	<md-dialog-content>{{message}}</md-dialog-content>
	<md-dialog-actions>
	  <button md-button color="primary" [md-dialog-close]="true">OK</button>
	</md-dialog-actions>
	</div>`
})

export class MessageDialog{
	@Input()
	title: string
  	@Input()
	message: string
}