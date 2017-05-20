import {User} from '../user/user'

//image model
export class Image {
    id: number;
    name: string;
    image_key: number;
    extension: string;
    originalWidth: number;
    originalHeight: number;
    user: User
    selected: boolean  
}
