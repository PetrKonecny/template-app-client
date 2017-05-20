import {Image} from '../image/image'
import {Tag} from '../tag/tag'
import {User} from '../user/user'
//album model
export class Album {
	id: number
	name: string
	images: Image[]
	user: User
	tagged: Tag[]
	public: boolean
}