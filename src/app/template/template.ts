import {Page} from '../page/page';
import {User} from '../user/user'
import {Tag} from '../tag/tag'

export class Template {
  id: number;
  name: string;
  pages: Page[];
  user: User
  tagged: Tag[]
  public: boolean
}