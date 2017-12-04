import { normalize, schema } from 'normalizr';

const user = new schema.Entity('users')
const tag = new schema.Entity('tags')
const image = new schema.Entity('images')
const content = new schema.Entity('contents',{
	image: image
})
const element = new schema.Entity('elements',{
	content: content,
	image: image
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

export const normalizePage = data=>normalize(data,page)

export const normalizeElement = data=>normalize(data,element)

export const normalizeElementAndAddIntoPage = (page,element)=>{
	let obj = normalizeElement(element)
    page.elements.push(element.id) 
    obj.entities.pages = {}
    obj.entities.pages[page.id] = page
    return obj
}

export const normalizePageAndAddIntoTemplateOnX = (template,page,x)=>{
	let obj = normalizePage(page)
	template.pages.splice(x,0,page.id)
	obj.entities.templates = {}
	obj.entities.templates[template.id] = template
	return obj
}

export const normalizeUser = data=>normalize(data,user)