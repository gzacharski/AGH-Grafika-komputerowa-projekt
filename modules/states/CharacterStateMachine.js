import JumpInIdleState from '/modules/states/JumpInIdleState.js';
import JumpInRunState from '/modules/states/JumpInRunState.js';
import LeftStrafeWalkingState from '/modules/states/LeftStrafeWalkingState.js';
import NeutralIdleState from '/modules/states/NeutralIdleState.js';
import RightStrafeWalkingState from '/modules/states/RightStrafeWalkingState.js';
import RunningState from '/modules/states/RunningState.js';
import WalkingBackwardsState from '/modules/states/WalkingBackwardsState.js';
import WalkingState from '/modules/states/WalkingState.js';

export default class CharacterStateMachine{

    constructor(){
        this._states = {
          jumpInIdle : new JumpInIdleState(this),
          jumpInRun : new JumpInRunState(this),
          leftStrafeWalking : new LeftStrafeWalkingState(this),
          neutralIdle : new NeutralIdleState(this),
          rightStrafeWalking : new RightStrafeWalkingState(this),
          running : new RunningState(this),
          walkingBackwards : new WalkingBackwardsState(this),
          walking : new WalkingState(this)
        };
        this._currentState = this._states.neutralIdle;
    }

    setState(stateToSet) {
      const prevState = this._currentState;
      
      if (prevState) {
        if (prevState.name == stateToSet.name) {
          return;
        }
        prevState.exit();
      }
  
      const state = stateToSet;
    
      this._currentState = state;
      state.enter(prevState);
    }
  
    update(timeElapsed, input) {
      if (this._currentState) {
        this._currentState.update(timeElapsed, input);
      }
    }
}