import {Content} from './content';
import {Image} from '../image/image'
import {Injectable} from '@angular/core';
import {UndoRedoService, Command, BufferCommand} from '../undo-redo.service'

@Injectable()
export class ImageContentCommands{

	constructor(private service: UndoRedoService){}

	/**sets image into the content
	@param content - content to set image to
	@param image -image to set
	*/
	SetImage(content: ImageContent, image: Image){
		this.service.execute(new SetImage(content,image))
	}

	/** starts moving the image
	@param content - content which image to move
	@param dimensions - dimensions to move image by 
	**/
	startMovingImage(content: ImageContent, dimensions){
		this.service.addToBufferAndExecute(new ChangeImageContentDimensions(content,dimensions))
	}

	/** starts resizing the image
	@param content - content which image to resize
	@param dimensions - dimensions to resize image by 
	**/
	startResizingImage(content: ImageContent, dimensions){
		this.service.addToBufferAndExecute(new ChangeImageContentDimensions(content,dimensions))
	}

	finishMovingImage(){
		this.service.saveBuffer()
	}

	finishResizingImage(){
		this.service.saveBuffer()
	}
}


//executing this command sets image into content
export class SetImage implements Command{

	oldImage: Image

	constructor(private content: ImageContent, private image: Image){}

	execute(){
		this.oldImage = this.content.image
		this.content.image = this.image
	}

	unExecute(){
		this.content.image = this.oldImage
	}

}

//executing this command adds current and new image dimensions
export class ChangeImageContentDimensions implements BufferCommand{

	constructor(private content: ImageContent, private dimensions){}

	oldDimensions

	private setDimensions(dimensions){
		if(dimensions.left != null){
			this.content.left = dimensions.left
		}
		if(dimensions.top != null){
			this.content.top = dimensions.top
		}
		if(dimensions.width != null){
			this.content.width = dimensions.width
		}
		if(dimensions.height != null){
			this.content.height = dimensions.height
		} 
	}

	private addDimensions(dimensions){
		if(dimensions.left != null){
			this.content.left += dimensions.left
		}
		if(dimensions.top != null){
			this.content.top +=  dimensions.top
		}
		if(dimensions.width != null){
			this.content.width += dimensions.width
		}
		if(dimensions.height != null){
			this.content.height += dimensions.height
		} 
	}

	execute(){
		this.oldDimensions = {left: this.content.left,top: this.content.top, width: this.content.width, height: this.content.height}
		this.addDimensions(this.dimensions)
	}

	unExecute(){
		this.setDimensions(this.oldDimensions)
	}

	getStoredState(){
		return this.oldDimensions
	}

	setStoredState(dimensions){
		this.oldDimensions = {left : dimensions.left, top: dimensions.top, width: dimensions.width, height: dimensions.height}
	}
}

//model of image content
export class ImageContent extends Content {
    image: Image;
    type: string = "image_content";
    left: number;
    top: number;
    width: number;
    height: number;
}