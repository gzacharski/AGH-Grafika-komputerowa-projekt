import State from '/modules/states/State.js';

export default class JumpInRunState extends State{
    constructor(parent,action){
        super(parent,action);
    }

    enter(previousState){
        console.log('jumpInRun...');
        
        setTimeout(
            ()=>{
                console.log("From jumpInRun to run");
                const {running}=this._parent._states;
                this._parent.setState(running);
            },
            this._action._clip.duration*1000
        );
    }

    exit(){}

    update(timeElapsed,input){}
}