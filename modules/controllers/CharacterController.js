import THREEx from '/extra_libs/Keyboard.js';
import * as THREE from '/build/three.module.js';

export default class CharacterController {

    constructor(camera,controls){
        this.camera=camera;
        this.controls=controls;
        this.keyboard=new THREEx.KeyboardState();
        document.addEventListener('keydown', (event)=>this._onKeyDown(event));
        document.addEventListener('keyup', (event)=>this._onKeyUp(event));
        document.addEventListener('click', (event)=>this._onClick(event));
        document.addEventListener('contextmenu', (event)=>this._onRightClick(event));
    }
    
    _onKeyDown(event){
        let diffvector=new THREE.Vector3().add(this.controls.target);
        diffvector.sub(this.camera.position);
        diffvector.multiplyScalar(0.01);
        
        if(this.keyboard.pressed("w")){
            console.log("Logging from character Controller : w - down" +event.keyCode);
            console.log(diffvector);
        }
    }

    _onKeyUp(event){
        let diffvector=new THREE.Vector3().add(this.controls.target);
        diffvector.sub(this.camera.position);
        diffvector.multiplyScalar(0.01);
        console.log("Logging from character Controller : w - up" +event.keyCode);
        console.log(diffvector);
    }

    _onClick(event){
        console.log("Logging from character Controller : clicked");
    }

    _onRightClick(event){
        console.log("Logging from character Controller : clicked right");
    }

    _walkRight(){

    }

    _walkForward(ninja, diffvector){
        //switchAction(idleAction,walkAction);
        ninja.position.x+=diffvector.x;
        ninja.position.z+=diffvector.z;
    }
    
    _walkBackwards(ninja, camera,diffvector){
        camera.position.x-=diffvector.x;
        camera.position.z-=diffvector.z;
    
        ninja.position.x-=diffvector.x;
        ninja.position.z-=diffvector.z;
    
        //switchAction(idleAction,walkBackwardAction);
    }
    
    _walkRight(ninja, camera,diffvector){
        camera.position.x-=diffvector.z;
        camera.position.z+=diffvector.x;
    
        ninja.position.x-=diffvector.z;
        ninja.position.z+=diffvector.x;
    
        // switchAction(idleAction,turnRightAction);
    }
    
    _walkLeft(ninja, camera,diffvector){
    
        camera.position.x+=diffvector.z;
        camera.position.z-=diffvector.x;
    
        ninja.position.x+=diffvector.z;
        ninja.position.z-=diffvector.x;
    
        // switchAction(idleAction,turnLeftAction);
    }
}