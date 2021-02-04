import * as THREE from '/build/three.module.js';
import * as CANNON from '/cannon-es/dist/cannon-es.js';
import {OrbitControls} from '/jsm/controls/OrbitControls.js';
import {PointerLockControlsCannon} from '/cannon-es/examples/js/PointerLockControlsCannon.js';
import Stats from '/jsm/libs/stats.module.js';
import * as dat from '/jsm/libs/dat.gui.module.js';
import * as Cube from '/modules/cube.js';
import * as Ground from '/modules/ground.js';

let stats;

//three.js variables
let scene, camera, renderer, material;

//cannon.js variables
let world, controls, sphereShape,sphereBody, physicsMaterial;
let time = Date.now();
const dt=0.01;

const root=document.getElementById('root');

initThree();
axesHelper();
initCannon();
initPointerLock();
//additems();
const cube=Cube.init();
scene.add(cube);
addStats();
//camera.lookAt(cube);

animate();

function initThree(){
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 0, 600);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // camera.lookAt(new THREE.Vector3(10, 0, 0));

    renderer =new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(scene.fog.color);
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.body.appendChild(renderer.domElement);

    stats = Stats();
    document.body.appendChild(stats.dom);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
    scene.add(ambientLight)

    const spotlight = new THREE.SpotLight(0xffffff, 0.9, 0, Math.PI / 4, 1)
    spotlight.position.set(10, 30, 20)
    spotlight.target.position.set(0, 0, 0)

    spotlight.castShadow = true

    spotlight.shadow.camera.near = 10
    spotlight.shadow.camera.far = 100
    spotlight.shadow.camera.fov = 30

    // spotlight.shadow.bias = -0.0001
    spotlight.shadow.mapSize.width = 2048
    spotlight.shadow.mapSize.height = 2048

    scene.add(spotlight)

    // Generic material
    material = new THREE.MeshLambertMaterial({ color: 0xdddddd })

    // Floor
    const floorGeometry = new THREE.PlaneBufferGeometry(300, 300, 100, 100)
    floorGeometry.rotateX(-Math.PI / 2)
    const floor = new THREE.Mesh(floorGeometry, material)
    floor.receiveShadow = true
    scene.add(floor)

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }, false);
}

function axesHelper(){
    //The X axis is red. The Y axis is green. The Z axis is blue.
    const axesHelper=new THREE.AxesHelper(5);
    scene.add(axesHelper);
}

function initCannon(){
    world=new CANNON.World();

    world.defaultContactMaterial.contactEquationStiffness = 1e9;
    world.defaultContactMaterial.contactEquationRelaxation = 4;

    const solver = new CANNON.GSSolver()
    solver.iterations = 7
    solver.tolerance = 0.1
    world.solver = new CANNON.SplitSolver(solver)

    world.gravity.set(0, -50, 0)

    physicsMaterial = new CANNON.Material('physics')
    const physics_physics = new CANNON.ContactMaterial(physicsMaterial, physicsMaterial, {
      friction: 0.0,
      restitution: 0.3,
    })

    world.addContactMaterial(physics_physics);


    //user collision sphere
    const radius = 1.3
    sphereShape = new CANNON.Sphere(radius)
    sphereBody = new CANNON.Body({ mass: 5, material: physicsMaterial })
    sphereBody.addShape(sphereShape)
    sphereBody.position.set(0, 1.3,3)
    sphereBody.linearDamping = 0.9
    world.addBody(sphereBody);

    //ground physics
    const groundShape=new CANNON.Plane();
    const groundBody=new CANNON.Body({mass: 0, material: physicsMaterial})
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(groundBody);
}

function initPointerLock() {

    controls = new PointerLockControlsCannon(camera, sphereBody);
    scene.add(controls.getObject())

    root.addEventListener('click', () => {
        controls.lock()
    })

    controls.addEventListener('lock', () => {
        controls.enabled = true
        root.style.display = 'none'
    })

    controls.addEventListener('unlock', () => {
        controls.enabled = false
        root.style.display = null
    })
}

function additems(){
    const cube=Cube.init();
    scene.add(cube);

    const ground=Ground.init();
    scene.add(ground);

    const light = new THREE.DirectionalLight(0x3f242d, 0.75);
    light.position.set(0, -1, 0);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const cubeRotation={
        speed:0.01
    }
}

function addStats(){

    const gui = new dat.GUI();
    const cam=gui.addFolder('Camera')
    cam.add(camera.position, 'x').getValue();
}

function animate() {
    requestAnimationFrame(animate);
    if (controls.enabled) {
        world.step(dt)
    }
    // cube.rotation.x += cubeRotation.speed;
    // cube.rotation.y += 0.01;
    // controls.update();
    cube.position.x=controls.cannonBody.position.x;
    cube.position.z=controls.cannonBody.position.z;

    controls.update(Date.now() - time);
    renderer.render(scene, camera);
    stats.update();
    time = Date.now();
    update();
    //camera.lookAt(cube);
    //console.log(controls.cannonBody.position.x);
    //console.log("cube :" + cube.position.x);
};


function update(){
    const differanceVector =new THREE.Vector3(0,0,3);

    if ( controls.moveLeft ){ 
        //console.log("pressing left...");
        //cube.position.x+=0.1;
    }
    if (controls.moveRight ){
        //console.log("pressing right...");
        //cube.position.x+=0.1;
    }
    if ( controls.moveForward){ 
        //console.log("pressing up...");
    }
    if ( controls.moveBackward ){ 
        //console.log("pressing down...");
    }
    if ( !controls.canJump ){ 
        //console.log("is jumping...");
    }
}