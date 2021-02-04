import * as THREE from '/build/three.module.js';

const init = () =>{
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true
    });
    const cube=new THREE.Mesh(geometry, material);

    // cube.receiveShadow=true;
    // cube.position.x=10;

    return cube;
};

export {init};