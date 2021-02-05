import * as THREE from '/build/three.module.js';
import * as CANNON from '/cannon-es/dist/cannon-es.js';
import {OrbitControls} from '/jsm/controls/OrbitControls.js';
import { FBXLoader } from './jsm/loaders/FBXLoader.js';
//import {PointerLockControlsCannon} from '/cannon-es/examples/js/PointerLockControlsCannon.js';
import Stats from '/jsm/libs/stats.module.js';
import * as dat from '/jsm/libs/dat.gui.module.js';
import * as Cube from '/modules/cube.js';
import * as Ground from '/modules/ground.js';


/** @namespace */
var THREEx	= THREEx 		|| {};

/**
 * - NOTE: it would be quite easy to push event-driven too
 *   - microevent.js for events handling
 *   - in this._onkeyChange, generate a string from the DOM event
 *   - use this as event name
*/
THREEx.KeyboardState	= function()
{
	// to store the current state
	this.keyCodes	= {};
	this.modifiers	= {};
	
	// create callback to bind/unbind keyboard events
	var self	= this;
	this._onKeyDown	= function(event){ self._onKeyChange(event, true); };
	this._onKeyUp	= function(event){ self._onKeyChange(event, false);};

	// bind keyEvents
	document.addEventListener("keydown", this._onKeyDown, false);
	document.addEventListener("keyup", this._onKeyUp, false);
}

/**
 * To stop listening of the keyboard events
*/
THREEx.KeyboardState.prototype.destroy	= function()
{
	// unbind keyEvents
	document.removeEventListener("keydown", this._onKeyDown, false);
	document.removeEventListener("keyup", this._onKeyUp, false);
}

THREEx.KeyboardState.MODIFIERS	= ['shift', 'ctrl', 'alt', 'meta'];
THREEx.KeyboardState.ALIAS	= {
	'left'		: 37,
	'up'		: 38,
	'right'		: 39,
	'down'		: 40,
	'space'		: 32,
	'pageup'	: 33,
	'pagedown'	: 34,
	'tab'		: 9
};

/**
 * to process the keyboard dom event
*/
THREEx.KeyboardState.prototype._onKeyChange	= function(event, pressed)
{
	// log to debug
	//console.log("onKeyChange", event, pressed, event.keyCode, event.shiftKey, event.ctrlKey, event.altKey, event.metaKey)

	// update this.keyCodes
	var keyCode		= event.keyCode;
	this.keyCodes[keyCode]	= pressed;

	// update this.modifiers
	this.modifiers['shift']= event.shiftKey;
	this.modifiers['ctrl']	= event.ctrlKey;
	this.modifiers['alt']	= event.altKey;
	this.modifiers['meta']	= event.metaKey;
}

/**
 * query keyboard state to know if a key is pressed of not
 *
 * @param {String} keyDesc the description of the key. format : modifiers+key e.g shift+A
 * @returns {Boolean} true if the key is pressed, false otherwise
*/
THREEx.KeyboardState.prototype.pressed	= function(keyDesc)
{
	var keys	= keyDesc.split("+");
	for(var i = 0; i < keys.length; i++){
		var key		= keys[i];
		var pressed;
		if( THREEx.KeyboardState.MODIFIERS.indexOf( key ) !== -1 ){
			pressed	= this.modifiers[key];
		}else if( Object.keys(THREEx.KeyboardState.ALIAS).indexOf( key ) != -1 ){
			pressed	= this.keyCodes[ THREEx.KeyboardState.ALIAS[key] ];
		}else {
			pressed	= this.keyCodes[key.toUpperCase().charCodeAt(0)]
		}
		if( !pressed)	return false;
	};
	return true;
}


let mixer;
let stats;
var keyboard = new THREEx.KeyboardState();

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

    //controls = new PointerLockControlsCannon(camera, sphereBody);
    controls = new OrbitControls( camera, renderer.domElement );
    camera.position.set(5,5,10);
    controls.listenToKeyEvents( window );
    
    controls.minDistance = 3;
    controls.maxDistance = 5;

    controls.maxPolarAngle = Math.PI / 2-Math.PI / 24;
    controls.minPolarAngle=Math.PI / 6; 

    //scene.add(controls.getObject())

    root.addEventListener('click', () => {
        console.log("clicked..")
        //controls.lock();
        root.style.display = 'none';
    })

    controls.addEventListener('lock', () => {
        //controls.enabled = true
        root.style.display = 'none'
    })

    controls.addEventListener('unlock', () => {
        //controls.enabled = false
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

    controls.update();
    renderer.render(scene, camera);
    stats.update();

    update();
    controls.target=cube.position;

    // if(camera.position.y<1.5){
    //     camera.position.y=1.5;
    // }
    
};

function update(){
    let diffvector=new THREE.Vector3().add(controls.target);
    diffvector.sub(camera.position);
    diffvector.multiplyScalar(0.01);

    if ( keyboard.pressed("w") ){
        cube.position.x+=diffvector.x;
        cube.position.z+=diffvector.z;
    }
    if ( keyboard.pressed("s") ){
        camera.position.x-=diffvector.x;
        camera.position.z-=diffvector.z;
        cube.position.x-=diffvector.x;
        cube.position.z-=diffvector.z;
    }
    if ( keyboard.pressed("a") ){ 
        camera.position.x+=diffvector.z;
        camera.position.z-=diffvector.x;
        cube.position.x+=diffvector.z;
        cube.position.z-=diffvector.x;
    }
    if ( keyboard.pressed("d") ){
        camera.position.x-=diffvector.z;
        camera.position.z+=diffvector.x;
        cube.position.x-=diffvector.z;
        cube.position.z+=diffvector.x; 
    }
    if ( keyboard.pressed("space") ){
        console.log("is jumping..");
    }
    
    controls.update();
    stats.update();
}

const loader = new FBXLoader();
loader.load('ZombieClapping.fbx', function (object) {
    punchingMixer = new THREE.AnimationMixer( object );
    var action = punchingMixer.clipAction( object.animations[ 0 ] );
    action.play();
    object.traverse( function ( child ) {
        if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    } );
    object.rotation.y = Math.PI * 1.1;
    object.position.x = 0;
    object.position.y = 0;
    object.position.z = 120;
    scene.add( object );
});