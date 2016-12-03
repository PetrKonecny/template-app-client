import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {Font} from './font'

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
        this.element[this.paramName] = this.oldValue
    }
    redo(){
        this.element[this.paramName] = this.newValue
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
            step.undo()
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
    
}

