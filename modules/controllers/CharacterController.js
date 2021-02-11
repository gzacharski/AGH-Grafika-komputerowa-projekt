import THREEx from '/extra_libs/Keyboard.js';
import * as THREE from '/build/three.module.js';

export default class CharacterController {

    constructor(model,camera,controls,actions){
        this.model=model;
        this.camera=camera;
        this.controls=controls;
        this.actions=this._initActions(actions);
        this.keyboard=new THREEx.KeyboardState();
        this.currentAction=this.actions.NeutralIdle;
        document.addEventListener('keydown', (event)=>this._onKeyDown(event));
        document.addEventListener('keyup', (event)=>this._onKeyUp(event));
        document.addEventListener('click', (event)=>this._onClick(event));
        document.addEventListener('contextmenu', (event)=>this._onRightClick(event));
    }

    _initActions(actions){
        let tempActions={};
        actions.forEach(element=>tempActions[element.name]=element.action);
        console.log(tempActions);
        return tempActions;
    }
    
    _onKeyDown(event){
        let diffvector=new THREE.Vector3().add(this.model.position);
        diffvector.sub(this.camera.position);
        diffvector.multiplyScalar(0.05);
        console.log("Keyboard pressed...");

        if(this.keyboard.pressed("w")) this._walkForward(this.model, diffvector);
        if(this.keyboard.pressed("s")) this._walkBackwards(this.model,this.camera,diffvector);
        if(this.keyboard.pressed("a")) this._walkLeft(this.model,this.camera,diffvector);
        if(this.keyboard.pressed("d")) this._walkRight(this.model,this.camera,diffvector);
        if(this.keyboard.pressed("space")) this._jump(this.model);
        if(this.keyboard.pressed("w+shift")) this._run(this.model,this.camera,diffvector);
    }

    _onKeyUp(event){
        console.log("keyboard released...");
        const {NeutralIdle}=this.actions;
        this._switchCurrentActionTo(NeutralIdle);
    }

    _onClick(event){
        console.log("Logging from character Controller : clicked");
    }

    _onRightClick(event){
        console.log("Logging from character Controller : clicked right");
    }

    _walkForward(model,diffvector){
        const {Walking}=this.actions;

        model.position.x+=diffvector.x;
        model.position.z+=diffvector.z;
        this._switchCurrentActionTo(Walking);
    }
    
    _walkBackwards(model, camera,diffvector){
        const {WalkingBackwards}=this.actions;
        
        camera.position.x-=diffvector.x;
        camera.position.z-=diffvector.z;
    
        model.position.x-=diffvector.x;
        model.position.z-=diffvector.z;

        this._switchCurrentActionTo(WalkingBackwards);
    }
    
    _walkRight(model, camera,diffvector){
        const {RightStrafeWalking}=this.actions;

        camera.position.x-=diffvector.z;
        camera.position.z+=diffvector.x;
    
        model.position.x-=diffvector.z;
        model.position.z+=diffvector.x;

        this._switchCurrentActionTo(RightStrafeWalking);
    }
    
    _walkLeft(model, camera,diffvector){
        const {LeftStrafeWalking}=this.actions;

        camera.position.x+=diffvector.z;
        camera.position.z-=diffvector.x;
    
        model.position.x+=diffvector.z;
        model.position.z-=diffvector.x;

        this._switchCurrentActionTo(LeftStrafeWalking);
    }

    _jump(model){
        const {Jump}=this.actions;

        this._switchCurrentActionTo(Jump);
    }

    _run(model, camera,diffvector){
        const {Running}=this.actions;

        this._switchCurrentActionTo(Running);
    }

    _switchCurrentActionTo(toAction){
        if(toAction.weight===1) return;

        this.currentAction.weight=0;
        toAction.weight=1;
        this.currentAction=toAction;
    }
}