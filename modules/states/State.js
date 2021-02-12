export default class State{
    constructor(parent){
        this._parent=parent;
        this._duration=0.2;
    }

    enter(previouState){
        console.log("entering to the state...");
    }

    exit(){
        console.log("exiting the state...");
    }

    update(timeElapsed,input){
        console.log("updating the state...");
    }
}