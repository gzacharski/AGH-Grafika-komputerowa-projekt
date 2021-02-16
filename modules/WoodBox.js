import * as THREE from '/build/three.module.js';

export default class WoodBox{
    constructor(size,position){
        this._size=size;
        this._position=position;
        this._box=this._initBox();
    }

    _initBox(){
        const texture = new THREE.TextureLoader().load( "/textures/box.jpg");
        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshPhysicalMaterial();
        material.map=texture;
        const cube = new THREE.Mesh( geometry, material );
        const {x,y,z}=this._position;
        cube.position.set(x,y,z);
        console.log(cube);
        return cube;
    }

    get box(){
        return this._box;
    }
}