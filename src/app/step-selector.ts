import {Injectable} from '@angular/core';
import {Element} from './element/element'

interface Step {
    undo()
    redo()
    root: boolean 
}

interface SingleBasicStep{
    oldValue: any
    newValue: any
    paramName: string
}

export class FunctionStep implements Step{
    root: boolean 
    constructor(private element: any, private undoFunction, private redoFunction){}
    
    undo(){
        this.undoFunction
    }
    redo(){
        this.redoFunction
    }
      
}

export class CompositeStep implements Step{
    root: boolean
    constructor(private steps: Array<Step>){}
    
    undo(){
        this.steps.forEach(step => step.undo())
    }
    
    redo(){
        this.steps.forEach(step => step.redo())
    }
    
    
}

export class BasicStep implements Step{
    root: boolean 
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
    root: boolean 
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
    root: boolean     
    constructor(private element: any, private array: Array<any>){}
    undo(){
        this.array.splice(this.array.indexOf(this.element))
    }
    redo(){
        this.array.push(this.element)
    }
    
}

export class ArrayStepSplice implements Step{
    root: boolean    
    constructor(private element: any, private array: Array<any>){}
    redo(){
        this.array.splice(this.array.indexOf(this.element))
    }
    undo(){
        this.array.push(this.element)
    }
    
}

export class ArrayStepPop implements Step{
    root: boolean  
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
    
    undoSteps: Array<StateSubjectQueue> = new Array
    redoSteps: Array<StateSubjectQueue> = new Array
    queues: Array<StateSubjectQueue> = new Array

   
    undo(){
        if (this.undoSteps.length > 0){
            var step = this.undoSteps.pop()
            this.redoSteps.push(step)
            if(!this.undoSteps[this.undoSteps.length - 1].undo()){
                this.undo()
            }
        }
        console.log(this.undoSteps) 
    }
    
    redo(){
        if (this.redoSteps.length > 0){
            var step = this.redoSteps.pop()
            step.redo()
            this.undoSteps.push(step)        
        }
    }

    getQueue(subject){
        return this.queues.find(queue=>queue.subject == subject)
    }

    add(step: Step, responder: StateChangeRespond){
        if(this.redoSteps.length > 0){
            this.redoSteps = new Array
        } 
        let queue = this.getQueue(responder.getSubject())
        if(!queue){
            queue = new StateSubjectQueue()
            queue.subject = responder.getSubject()
            this.queues.push(queue)
        }
        queue.add(step)      
        this.undoSteps.push(queue)
        console.log(this.undoSteps)
    }

    makeStep(step){

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
        /*
        let terminate1 = false
        let terminate2 = false
        changes.forEachItem(item =>{
            if (item.previousVaule){
                terminate1 = true
            }
            else {
                terminate2 = true
            }

        })
        if(terminate1 && terminate2){
            return 
        }*/
        changes.forEachItem(item =>{
            if(Element.notRecordedParams.indexOf(item.key) < 0){
                let change = this.makeChange(item,responder)
                steps.push(change)
            }
        })        
       this.add(new CompositeStep(steps),responder)
    }

    makeChange(change,responder: StateChangeRespond){
        console.log(change.key,change.currentValue,change.previousValue)
        return new SimpleStep(responder.getSubject(),change.key, change.currentValue)
    }

    respond(changes,responder: StateChangeRespond){
        let terminate = false
        changes.forEachChangedItem(item => {
            if(item.key == 'redoing'){
                console.log('redoing')
                responder.getSubject().redoing = false
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
    getSubject(): StateSubject

}

export interface StateSubject{
    changing: boolean
    redoing: boolean
}

export class StateSubjectQueue{
    undoSteps: Array<Step> = new Array
    redoSteps: Array<Step> = new Array
    subject: any

    undo(){
        if(this.undoSteps.length <= 1){
            return false
        }
        let step = this.undoSteps.pop()
        this.undoSteps[this.undoSteps.length - 1].redo()
        this.redoSteps.push(step)
        return true
    }

    redo(){

    }

    add(step: Step){
        if(this.redoSteps.length > 0){
            this.redoSteps = new Array
        }
        this.undoSteps.push(step)
    }


}


