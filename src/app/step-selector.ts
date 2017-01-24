import {Injectable} from '@angular/core';
import {Element} from './element/element'

interface Step {
    undo()
    redo()
}

interface SingleBasicStep{
    oldValue: any
    newValue: any
    paramName: string
}

export class FunctionStep implements Step{
    
    constructor(private element: any, private undoFunction, private redoFunction){}
    
    undo(){
        this.undoFunction
    }
    redo(){
        this.redoFunction
    }
      
}

export class CompositeStep implements Step{
    
    constructor(private steps: Array<Step>){}
    
    undo(){
        this.steps.forEach(step => step.undo())
    }
    
    redo(){
        this.steps.forEach(step => step.redo())
    }
    
    
}

export class BasicStep implements Step{
  
    constructor(private element: any, private paramName: string, private oldValue: any, private newValue: any){}    
    
    undo(){
        this.element.redoing = true
        this.element[this.paramName] = this.oldValue
    }
    redo(){
        this.element.redoing = true
        this.element[this.paramName] = this.newValue
    }
    
}

export class SimpleStep implements Step{
    constructor(private element: any, private paramName: string, private value: any){}    
    undo(){
        this.element.redoing = true
        this.element[this.paramName] = this.value
    }
    redo(){
        this.element.redoing = true
        this.element[this.paramName] = this.value
    }

}
    
export class ArrayStepPush implements Step{
    
    
    constructor(private element: any, private array: Array<any>){}
    undo(){
        this.array.splice(this.array.indexOf(this.element))
    }
    redo(){
        this.array.push(this.element)
    }
    
}

export class ArrayStepSplice implements Step{
    
    
    constructor(private element: any, private array: Array<any>){}
    redo(){
        this.array.splice(this.array.indexOf(this.element))
    }
    undo(){
        this.array.push(this.element)
    }
    
}

export class ArrayStepPop implements Step{
    
    
    constructor(private element: any, private array: Array<any>){}
    redo(){
        this.array.pop()
    }
    undo(){
        this.array.push(this.element)
    }
    
}



@Injectable()
export class StepSelector {
    
    undoSteps: Array<Step> = new Array
    redoSteps: Array<Step> = new Array
    
    makeStep(step: Step){
        console.log(this.undoSteps)
        if (this.redoSteps.length > 0){
            this.redoSteps = new Array
        }
        this.undoSteps.push(step)
    }
   
    undo(){
        if (this.undoSteps && this.undoSteps.length > 0){
            var step = this.undoSteps.pop()
            this.undoSteps[this.undoSteps.length - 1].redo()
            this.redoSteps.push(step)
        } 
    }
    
    redo(){
        if (this.redoSteps && this.redoSteps.length > 0){
            var step = this.redoSteps.pop()
            step.redo()
            this.undoSteps.push(step)        
        }
    }
    
    makePosition(element: any, oldX: number, newX: number, oldY: number, newY: number){
        var steps = [new BasicStep(element,"positionX", oldX, newX),new BasicStep(element,"positionY",oldY,newY)]
        return new CompositeStep(steps)
    }
    
    makeDimensions(element: any, oldWidth: number, newWidth: number, oldHeight: number, newHeight: number){
        var steps = [new BasicStep(element,"width", oldWidth, newWidth),new BasicStep(element,"height",oldHeight,newHeight)]
        return new CompositeStep(steps)
    }

    recordChangesAfterChangeFinished(changes, responder: StateChangeRespond){
        let steps: Array<Step> = new Array 
        changes.forEachItem(item =>{
            if(Element.notRecordedParams.indexOf(item.key) < 0){
                let change = this.makeChange(item,responder)
                steps.push(change)
            }
        })
        if(!steps.some(step => step == null)){
            this.makeStep(new CompositeStep(steps))
        }
    }

    makeChange(change,responder: StateChangeRespond){
        if(change.previousValue){
            console.log(change.key)
            return new SimpleStep(responder.element,change.key, change.currentValue)
        }
    }

    respond(changes,responder: StateChangeRespond){
        let terminate = false
        changes.forEachChangedItem(item => {
            if(item.key == 'redoing'){
                responder.element.redoing = false
                terminate = true 
            }
            else if(item.key == 'changing'){
                if(item.currentValue){
                    responder.continuousChangeRunning = true
                }else if(item.previousValue){
                    this.recordChangesAfterChangeFinished(changes,responder)
                    responder.continuousChangeRunning = false
                }
                terminate = true 
            }
        })           
        if(!responder.continuousChangeRunning && !terminate){
            this.recordChangesAfterChangeFinished(changes,responder)
        }

    }

    replacer(key,value) {
        if (key=="editor") return undefined;
        else return value;
    }
    
}

export interface StateChangeRespond{

    continuousChangeRunning: boolean
    element: any

}


