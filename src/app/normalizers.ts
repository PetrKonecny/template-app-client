import { normalize, schema} from 'normalizr';

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

export class NormalizerAddAction {
	type = "ADD_NORMALIZED_DATA"
	subtype
	data
	error
}

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

export const addNewIntoObjAfterX = (obj,name,obj2,name2,x) => {
	var objCopy = {...obj}
	var result = {entities: {}}
	objCopy[name2].splice(x,0,obj2.id)
	result.entities[name] = {}
	result.entities[name2] = {}
	result.entities[name2][obj2.id] = obj2 
	result.entities[name][objCopy.id] = objCopy
	return result
}

export const swapFromObjOnXandY = (obj,name, name2, x,y) => {
	var objCopy = {...obj}
	var result = {entities: {}}
	var temp = objCopy[name2][x]
	objCopy[name2][x] = objCopy[name2][y]
	objCopy[name2][y] = objCopy[name2][x]
	result.entities[name] = {}
	result.entities[name][obj.id] = objCopy
	return result
}

export const removeFromObject = (obj, name, name2, id) =>{
	var objCopy = {...obj}
	var result = {entities: {}}
	objCopy[name2].splice(objCopy[name2].indexOf(id),1)
	result.entities[name] = {}
	result.entities[name][objCopy.id] = objCopy
	return result
}

export const changeOneParamOnObj = (obj,name,param,value) => {
	var objCopy = {...obj}
	objCopy[param] = value
	var result = {entities: {}}
	result.entities[name] = {} 
	result.entities[name][objCopy.id] = objCopy
	return result
}

export const changeMoreParamsOnObj = (obj,name,params,values) => {
	var objCopy = {...obj}
	params.forEach((param, index) => objCopy[param] = values[index])
	var result = {entities: {}}
	result.entities[name] = {} 
	result.entities[name][objCopy.id] = objCopy
	return result
}

export const changeMoreParamsOnObjNotNull = (obj,name,params,values) => {
	var objCopy = {...obj}
	params.forEach((param, index) => {
		if(values[index]){objCopy[param] = values[index]}
	})
	var result = {entities: {}}
	result.entities[name] = {} 
	result.entities[name][objCopy.id] = objCopy
	return result
}

export const normalizeUser = data=>normalize(data,user)