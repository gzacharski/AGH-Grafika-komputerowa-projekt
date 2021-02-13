import State from '/modules/states/State.js';

export default class RunningState extends State{
    constructor(parent,action){
        super(parent,action);
    }

    enter(previousState){
        console.log('running...');
    }

    exit(){}

    update(timeElapsed,input){
        const {forward,space,shift}=input.keyPressed;
        const {neutralIdle,walking,jumpInRun}=this._parent._states;

        if(!forward){
            console.log("From running to idle");
            this._parent.setState(neutralIdle);

        }else if(forward && !shift){
            console.log("From running to walking");
            this._parent.setState(walking);
        
        }else if(forward && shift && space){
            console.log("From running to jump in run");
            this._parent.setState(jumpInRun);
        }
    }
}