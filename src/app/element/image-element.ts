import {Element} from './element';
import { Image } from '../image/image'

export class ImageElement extends Element {
    
    type: string = 'image_element';
    image: Image
 
}