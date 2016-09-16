import {Element} from './element';
import {TemplateInstance} from './template-instance';

export class Content {
    id: number;
    element: Element;
    element_id: number;
    templateInstance: TemplateInstance;
    type: string;
}