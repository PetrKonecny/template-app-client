import {Element} from '../element/element'
import {TextContent} from '../content/text-content'
import {ImageContent} from '../content/image-content'
import {Content} from '../content/content'
import {Page} from '../page/page'
import {TableElement} from '../element/table-element'
import {TableContent, RowContent, CellContent} from '../content/table-content'
import {Guide} from '../guide/guide'
import {TemplateStore} from '../template/template.store'
import {Template} from '../template/template';
import {TemplateInstance} from './template-instance';

export class TemplateInstanceHelper {

    /* Adds elements from the stored template to the TemplateInstance
    */
    static copyContentsFromTemplate(templateInstance: TemplateInstance, template: Template){
        if(!template.pages) {
            return
        }
        if(templateInstance.contents == null){
            templateInstance.contents = new Array<Content>();
        }
        
        for (var page of template.pages){
            for (var element of page.elements){
                if (templateInstance.contents.find(content=>(content && content.element_id == element.id)) == null && element.content){
                    if (element.content.type == 'table_content'){
                        TableContent.fillEmptyCells(<TableContent>element.content)
                    }
                    element.content.id = null;
                    templateInstance.contents.push(element.content);
                }
            }
        }
    }


    static copyIds(templateInstance: TemplateInstance, templateInstance2: TemplateInstance){
        templateInstance.id = templateInstance2.id
        templateInstance.contents.forEach((content,index) =>{
            content.id = templateInstance2.contents[index].id
        })
        if(templateInstance.tagged){
            templateInstance.tagged.forEach((tag,index)=>{
                tag.id = templateInstance2.tagged[index].id
            })
        }
    }
    
    /* Adds corresponding content from stored Template Instance to each element of stored Template 
       Validates if the stored template has any pages
    */
    static getContentsFromTemplateInstance(templateInstance: TemplateInstance, template: Template){
        if(template.pages == null) {
            return
        }
        for (var page of template.pages){
            for (var element of page.elements){
                element.content = TemplateInstanceHelper.getContentForElement(element, templateInstance);
            }
        }        
    }
    

    static getContentForElement(element: Element, templateInstance: TemplateInstance){
        if (templateInstance.contents == null){
            templateInstance.contents = new Array<Content>();
        }
        
        for (var content of templateInstance.contents){
            if(content && content.element_id === element.id){
                if (content.type == 'table_content'){
                    TableContent.fillEmptyCells(<TableContent>content)
                }
                console.log(content)
                return content;
            }        
        }
        templateInstance.contents.push(this.createNewContentForElement(element));
    }

    /*

    */
    
    static createNewContentForElement(element: Element){
        var content;
        if (element.type == 'text_element'){
            content = new TextContent();           
        }       
        if (element.type == 'image_element'){
            content = null
        }
        if (element.type == 'frame_element'){
            content = new ImageContent()
        }
        if (element.type == 'table_element'){
            var tableContent = new TableContent()
            var tableElement = <TableElement>element
            tableElement.rows.forEach(
                (row) => {
                    var rowContent = new RowContent()
                    row.cells.forEach(() => rowContent.cells.push(new CellContent()))
                    tableContent.rows.push(new RowContent)
                }
            )
            content = tableContent
        }
        element.content = content;
        return content;
    }

}