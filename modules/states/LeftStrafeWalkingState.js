import State from '/modules/states/State.js';

export default class LeftStrafeWalkingState extends State{
    constructor(parent,action){
        super(parent,action);
    }

    enter(previousState){
        console.log('leftStrafeWalking...');
    }

    exit(){}

    update(timeElapsed,input){
        const {left}=input.keyPressed;
        const {neutralIdle}=this._parent._states;

        if(!left){
            console.log("From left to idle");
            this._parent.setState(neutralIdle);
        }
    }
}