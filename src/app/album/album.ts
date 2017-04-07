import {Image} from '../image/image'
import {Tag} from '../tag/tag'

export class Album {
	id: number
	name: string
	images: Image[]
	tagged: Tag[]
}