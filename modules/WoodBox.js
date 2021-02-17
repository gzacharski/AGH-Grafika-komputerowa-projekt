import * as THREE from '/build/three.module.js';
import * as CANNON from '/cannon-es/dist/cannon-es.js';

export default class WoodBox{
    constructor(params){
        this._mesh=this._initMesh(params);
        this._body=this._initBody(params);
    }

    _initMesh(params){
        const {scene,size}=params;

        const texture = new THREE.TextureLoader().load( "/textures/box.jpg");
        const material = new THREE.MeshPhysicalMaterial({map:texture});
        const geometry = new THREE.BoxGeometry( size, size, size);
        const boxMesh = new THREE.Mesh( geometry, material );

        boxMesh.castShadow=true;
        boxMesh.receiveShadow=true;

        scene.add(boxMesh);

        return boxMesh;
    }

    _initBody(params){
        const {world,size,position,physicsMaterial}=params;

        const {x,z}=position;

        const boxShape=new CANNON.Box(new CANNON.Vec3(0.5*size,0.5*size,0.5*size));
        const boxBody=new CANNON.Body({mass: 5, material: physicsMaterial});

        boxBody.addShape(boxShape);
        boxBody.position.set(x,0.5*size,z);
        boxBody.linearDamping=0.9;

        world.addBody(boxBody);

        return boxBody;
    }

    get WoodBox(){
        return {
            mesh : this._mesh,
            body : this._body
        }
    }

    update(){
        this._mesh.position.copy(this._body.position);
        this._mesh.quaternion.copy(this._body.quaternion);
    }
}