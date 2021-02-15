import * as THREE from '/build/three.module.js';
import {OrbitControls} from '/jsm/controls/OrbitControls.js';

export default class GameplayCamera{

    constructor(params) {
        this._scene = params.scene;
        this._character= params.character;
        this._camera=params.camera;
        this._renderer=params.renderer;
        this._controls;
        this._init();
    }

    _init(){
        this._controls = new OrbitControls( this._camera, this._renderer.domElement );
        this._controls.enabled=false;
        this._camera.position.set(5,5,10);
        this._controls.listenToKeyEvents( window );
        
        this._controls.minDistance = 3;
        this._controls.maxDistance = 5;

        this._controls.maxPolarAngle = Math.PI / 2-Math.PI / 24;
        this._controls.minPolarAngle=Math.PI / 6;
    }
    
    update() {
        if(this._character.status){
            const {x,y,z}=this._character._character.model.position;
    
            const {rightClick}=this._character._input.keyPressed;
            if(rightClick){
                this._controls.target=this._character._character.model.position;
                this._camera.position.set(x+3,y+3,z+5);
            }else{
                this._controls.target=new THREE.Vector3(x,y+1,z);
                const {rotation}=this._character._character.model;
    
                const difference=new THREE.Vector3(
                    Math.sin(rotation.y),
                    0,
                    Math.cos(rotation.y),
                );
    
                const newCameraPosition=new THREE.Vector3(x,y,z).sub(difference);
                this._camera.position.set(
                    newCameraPosition.x,
                    newCameraPosition.y,
                    newCameraPosition.z
                );
            }
        }

        this._controls.update();
    }
}