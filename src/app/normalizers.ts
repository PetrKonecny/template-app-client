import { normalize, schema } from 'normalizr';

const user = new schema.Entity('users')
const tag = new schema.Entity('tags')
const content = new schema.Entity('contents')
const element = new schema.Entity('elements',{
	content: content
})
const page = new schema.Entity('pages',{
	elements: [element]
})
const template = new schema.Entity('templates',{
	tagged: [tag],
	pages: [page],
	user: user 
})


export const normalizeTemplates = data=>normalize(data,{templates: [template]})

export const normalizeTemplate = data=>normalize(data, template)

export const normalizeUser = data=>normalize(data,user)