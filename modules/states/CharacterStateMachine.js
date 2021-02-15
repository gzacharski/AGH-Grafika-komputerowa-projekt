import JumpInIdleState from '/modules/states/JumpInIdleState.js';
import JumpInRunState from '/modules/states/JumpInRunState.js';
import LeftStrafeWalkingState from '/modules/states/LeftStrafeWalkingState.js';
import NeutralIdleState from '/modules/states/NeutralIdleState.js';
import RightStrafeWalkingState from '/modules/states/RightStrafeWalkingState.js';
import RunningState from '/modules/states/RunningState.js';
import WalkingBackwardsState from '/modules/states/WalkingBackwardsState.js';
import WalkingState from '/modules/states/WalkingState.js';
import AnimationController from '/modules/controllers/AnimationController.js';

export default class CharacterStateMachine{

    constructor(character){
        this._canSwitchAnimation=true;
        this._character=character;
        this._states = {
          jumpInIdle : new JumpInIdleState(this,this._character.actions.JumpInIdle),
          jumpInRun : new JumpInRunState(this,this._character.actions.JumpInRun),
          leftStrafeWalking : new LeftStrafeWalkingState(this,this._character.actions.LeftStrafeWalking),
          neutralIdle : new NeutralIdleState(this,this._character.actions.NeutralIdle),
          rightStrafeWalking : new RightStrafeWalkingState(this,this._character.actions.RightStrafeWalking),
          running : new RunningState(this,this._character.actions.Running),
          walkingBackwards : new WalkingBackwardsState(this,this._character.actions.WalkingBackwards),
          walking : new WalkingState(this,this._character.actions.Walking),
        };
        this._currentState = this._states.neutralIdle;
        this._animationController=new AnimationController(this);
    }

    setState(stateToSet) {
      const prevState = this._currentState;

      if (prevState == stateToSet){
        this._currentState.enter(prevState);
        return;
      } 
      
      if(!this._canSwitchAnimation) return;

      this._switchCurrentActionTo(stateToSet._action);
      this._currentState = stateToSet;
      this._currentState.enter(prevState);
      prevState._accelerationFactor=0.1;
    }
  
    update(timeElapsed, input) {
      const {arrowLeft,arrowRight,forward,backward} =input.keyPressed;
      const {rotation}=this._character.model;

      if(arrowLeft && forward || arrowRight && backward) rotation.y+=Math.PI/180;
      if(arrowRight && forward|| arrowLeft && backward) rotation.y-=Math.PI/180;

      if (this._currentState) {
        this._currentState.update(timeElapsed, input);
      }
    }

    _switchCurrentActionTo(toAction){
      if(toAction===this._currentState._action) return;

      this._canSwitchAnimation=false;

      toAction.enabled = true;
      toAction.setEffectiveTimeScale( 1 );
      toAction.setEffectiveWeight( 1 );
      toAction.time = 0;
      this._currentState._action.crossFadeTo( toAction, 0.5, true );

      setTimeout(() => {
        this._canSwitchAnimation=true;
      }, 500);
    }
}