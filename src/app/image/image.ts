import {User} from '../user/user'
import { Action, createSelector } from '@ngrx/store'
import { AppState } from '../app.state'

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

export interface ImagesState{
    images
}

export function imagesReducer(state : ImagesState = {images: null},action: any) {
  switch (action.type) {
    case "ADD_NORMALIZED_DATA":
        if (action.data.entities.images) { 
            return Object.assign({},state,{images: Object.assign({},state.images,...action.data.entities.images)})
        }else{
            return state
        }
    default: return state;
  }
}

export const getImages = (state: AppState) => state.images.images

export const getImageById = (id) => createSelector(getImages,(images)=>{
    return images && images[id]
})