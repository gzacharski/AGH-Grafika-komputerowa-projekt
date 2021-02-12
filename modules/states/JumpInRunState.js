import State from '/modules/states/State.js';

export default class JumpInRunState extends State{
    constructor(parent){
        super(parent);
    }

    get name(){
        return 'jumpInRun';
    }

    enter(previousState){
        console.log('jumpInRun...');

        setTimeout(()=>{
            console.log("From jumpInRun to run");
            const {running}=this._parent._states;
            this._parent.setState(running);
        },300);
    }

    exit(){}

    update(timeElapsed,input){}
}