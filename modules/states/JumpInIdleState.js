import State from '/modules/states/State.js';

export default class JumpInIdle extends State{
    constructor(parent,action){
        super(parent,action);
    }

    enter(previousState){
        console.log('jumpInIdle ...');

        setTimeout(()=>{
            console.log("From jump to idle");
            const {neutralIdle}=this._parent._states;
            this._parent.setState(neutralIdle);
        },200);
    }

    exit(){}

    update(timeElapsed,input){}
}