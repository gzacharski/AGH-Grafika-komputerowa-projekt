import THREEx from '/extra_libs/Keyboard.js';
import * as THREE from '/build/three.module.js';

export default class CharacterController {

    constructor(model,camera,controls){
        this.model=model;
        this.camera=camera;
        this.controls=controls;
        this.keyboard=new THREEx.KeyboardState();
        document.addEventListener('keydown', (event)=>this._onKeyDown(event));
        document.addEventListener('keyup', (event)=>this._onKeyUp(event));
        document.addEventListener('click', (event)=>this._onClick(event));
        document.addEventListener('contextmenu', (event)=>this._onRightClick(event));
    }
    
    _onKeyDown(event){
        let diffvector=new THREE.Vector3().add(this.model.position);
        diffvector.sub(this.camera.position);
        diffvector.multiplyScalar(0.1);

        if(this.keyboard.pressed("w")) this._walkForward(this.model, diffvector);
        if(this.keyboard.pressed("s")) this._walkBackwards(this.model,this.camera,diffvector);
        if(this.keyboard.pressed("a")) this._walkLeft(this.model,this.camera,diffvector);
        if(this.keyboard.pressed("d")) this._walkRight(this.model,this.camera,diffvector);
    }

    _onKeyUp(event){
        // let diffvector=new THREE.Vector3().add(this.model.position);
        // diffvector.sub(this.camera.position);
        // diffvector.multiplyScalar(0.01);
    }

    _onClick(event){
        console.log("Logging from character Controller : clicked");
    }

    _onRightClick(event){
        console.log("Logging from character Controller : clicked right");
    }

    _walkForward(model,diffvector){
        //switchAction(idleAction,walkAction);
        model.position.x+=diffvector.x;
        model.position.z+=diffvector.z;
    }
    
    _walkBackwards(model, camera,diffvector){
        //switchAction(idleAction,walkBackwardAction);
        camera.position.x-=diffvector.x;
        camera.position.z-=diffvector.z;
    
        model.position.x-=diffvector.x;
        model.position.z-=diffvector.z;
    }
    
    _walkRight(model, camera,diffvector){
        // switchAction(idleAction,turnRightAction);
        camera.position.x-=diffvector.z;
        camera.position.z+=diffvector.x;
    
        model.position.x-=diffvector.z;
        model.position.z+=diffvector.x;
    }
    
    _walkLeft(model, camera,diffvector){
        // switchAction(idleAction,turnLeftAction);
        camera.position.x+=diffvector.z;
        camera.position.z-=diffvector.x;
    
        model.position.x+=diffvector.z;
        model.position.z-=diffvector.x;
    }
}