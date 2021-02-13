import State from '/modules/states/State.js';

export default class RightStrafeWalkingState extends State{
    constructor(parent,action){
        super(parent,action);
    }

    enter(previousState){
        console.log('rightStrafeWalking...');
    }

    exit(){}

    update(timeElapsed,input){
        const {right}=input.keyPressed;
        const {neutralIdle}=this._parent._states;

        if(!right){
            console.log("From right to idle");
            this._parent.setState(neutralIdle);
        }
    }
}