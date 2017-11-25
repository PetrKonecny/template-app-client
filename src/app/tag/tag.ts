//tag model
export class Tag {
	tag_name: string
	id: number
}

export function tagsReducer(state = {tags: null},action: any) {
	switch (action.type) {
		case "ADD_NORMALIZED_DATA":
			return state && 
				action.data.entities.tags && 
				Object.assign({},state,{tags: Object.assign({},state.tags,...action.data.entities.tags)})
		default: return state;
	}
}