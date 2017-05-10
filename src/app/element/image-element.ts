import {Element} from './element';
import { Image } from '../image/image'

//image element model
export class ImageElement extends Element {
    
    type: string = 'image_element';
    image: Image
 
}