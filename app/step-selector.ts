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

export class BasicStep implements Step{
  
    constructor(private element: any, private steps: Array<SingleBasicStep>){}    
    undo(){
        for (var step of this.steps){
            this.element[step.paramName] = step.oldValue
        }
    }
    redo(){
        for (var step of this.steps){
            this.element[step.paramName] = step.newValue
        }
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

export class ArrayStepPop implements Step{
    
    
    constructor(private element: any, private array: Array<any>){}
    redo(){
        this.array.splice(this.array.indexOf(this.element))
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
    
}

