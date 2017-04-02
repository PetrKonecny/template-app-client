import {Element} from '../element/element'

export class ElementHelper {

    static getDimensions(element: Element){
        return {width: element.width, height: element.height, left: element.positionX, top: element.positionY}
    } 
	
}