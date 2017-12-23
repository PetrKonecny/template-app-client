export class PageHelper{

	static getPageContainingElement(pages,element){
		var result;
		Object.keys(pages).forEach( pageId => {
            var element2 = pages[pageId].elements.find(id => element.id === id);
            if(element2){
                result = pages[pageId];          
            }
        })
        return result;
	}

}