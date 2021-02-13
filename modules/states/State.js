export default class State{
    constructor(parent,action){
        this._parent=parent;
        this._action=action;
        this._accelerationFactor=0.1;
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