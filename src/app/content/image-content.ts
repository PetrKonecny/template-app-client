import {Content} from './content';
import {Image} from '../image/image'
import {NormalizerAddAction, changeOneParamOnObj, changeMoreParamsOnObjNotNull} from '../normalizers'

export class SetImage extends NormalizerAddAction {
	constructor(content,image){
		super()
		this.data = changeOneParamOnObj(content,'contents','image',image) 	
	}
}

class ChangeImageDimensions extends NormalizerAddAction {
    constructor(content,dimensions){
        super();
        this.data = changeMoreParamsOnObjNotNull(content,'contents', ['left','top','width','height'],
        [content.left + dimensions.left,
         content.top + dimensions.top,
         content.width + dimensions.width,
         content.height + dimensions.height]);
    }
}

export class MoveImage extends ChangeImageDimensions {
	subtype = "MOVE_IMAGE"
}

export class ResizeImage extends ChangeImageDimensions{
	subtype = "RESIZE_IMAGE"
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