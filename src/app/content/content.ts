import {TemplateInstance} from '../template-instance/template-instance';
import {StateSubject} from '../step-selector'

export class Content implements StateSubject{
    id: number;
    element_id: number;
    templateInstance: TemplateInstance;
    type: string;
    changing = false;
    redoing = false;
}