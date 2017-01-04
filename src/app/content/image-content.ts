import {Content} from './content';
import {Image} from '../image/image'

export class ImageContent extends Content {
    image: Image;
    type: string = "image_content";
    left: number;
    top: number;
    width: number;
    height: number;
}