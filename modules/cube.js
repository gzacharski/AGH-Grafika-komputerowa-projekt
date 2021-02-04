import * as THREE from '/build/three.module.js';

const init = () =>{
    const geometry = new THREE.BoxGeometry(1,1,1);
    const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00
    });
    const cube=new THREE.Mesh(geometry, material);

    cube.receiveShadow=true;
    cube.position.y=0.5;
    // cube.position.x=10;

    return cube;
};

export {init};