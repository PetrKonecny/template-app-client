import {Content} from './content';
import {Image} from './image'

export class ImageContent extends Content {
    image: Image;
    type: string = "image_content";
}