import * as THREE from '/build/three.module.js';

export default class AnimationController {

    constructor(mixer, idleAction){
        this.mixer=mixer;
        this.idleAction=idleAction;
    }

    switchAction(fromAction, toAction){
        const duration=0.2;
        fromAction.weight=0;
        toAction.weight=1;
        //toAction.clampWhenFinished=true;
        //toAction.crossFadeFrom(fromAction, duration,true);
        //prepareCrossFade(fromAction,toAction,duration, this.mixer,this.idleAction);
    }
}

function prepareCrossFade( startAction, endAction, defaultDuration, mixer, idleAction ) { 

    if ( startAction === idleAction ) {
        executeCrossFade( startAction, endAction, defaultDuration);
    } else {
        synchronizeCrossFade( startAction, endAction, defaultDuration,mixer );
    }
}

function synchronizeCrossFade( startAction, endAction, duration, mixer ) {

    mixer.addEventListener( 'loop', onLoopFinished );

    function onLoopFinished( event) {
        if ( event.action === startAction ) {
            mixer.removeEventListener( 'loop', onLoopFinished );
            executeCrossFade( startAction, endAction, duration );
        }
    }
}

function executeCrossFade( startAction, endAction, duration ) {
    // endAction.enabled=true;
    // endAction.setEffectiveTimeScale(duration);
    // endAction.setEffectiveWeight(1);
    // endAction.loop=THREE.LoopRepeat;
    endAction.time = 0;
    startAction.crossFadeTo( endAction, duration, true );

}