import {TemplateInstance} from '../template-instance/template-instance';

//content model
export class Content  {
    id: number;
    element_id: number;
    templateInstance: TemplateInstance;
    type: string;
}