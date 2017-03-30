import {User} from '../user/user'

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
