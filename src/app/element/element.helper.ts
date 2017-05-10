import {Element} from '../element/element'


/*
Helper class for element model
*/
export class ElementHelper {

    static getDimensions(element: Element){
        return {width: element.width, height: element.height, left: element.positionX, top: element.positionY}
    } 
	
}