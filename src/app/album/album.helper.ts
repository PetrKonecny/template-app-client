import {Album} from '../album/album'
import {User} from '../user/user'

export class AlbumHelper {

    static canEditAlbum(user: User, album: Album){
        return user && user.id == album.user_id
    }

    static canDeleteAlbum(user: User, album: Album){
        return user && user.id == album.user_id
    }
}