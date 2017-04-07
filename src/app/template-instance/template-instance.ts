import {Template} from '../template/template';
import {Content} from '../content/content';
import {User} from '../user/user'
import {Tag} from '../tag/tag'

export class TemplateInstance {
  id: number;
  name: string;
  template: Template;
  template_id: number;
  contents: Content[];
  user: User
  tagged: Tag[]
}