export default class State{
    constructor(parent){
        this._parent=parent;
    }

    enter(){
        console.log("entering to the state...");
    }

    exit(){
        console.log("exiting the state...");
    }

    update(){
        console.log("updating the state...");
    }
}