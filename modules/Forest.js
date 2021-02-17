import * as THREE from '/build/three.module.js';
import * as CANNON from '/cannon-es/dist/cannon-es.js';
import PlantLoader from '/modules/loaders/PlantLoader.js';

export default class Forest{
    constructor(params){
        this._world=params.world;
        this._scene=params.scene;
        this._physicsMaterial=params.physicsMaterial;
        this._addPlants();
    }

    _addPlants(){
        let deciduousTreesPositions=[
            { x: 15, y: 0, z: 15, rotation: Math.PI, scale: 0.75 , radius: 6},
            { x: -15, y: 0, z: -15, rotation: -Math.PI, scale: 1.0 , radius: 5},
            { x: -15, y: 0, z: 15, rotation: Math.PI / 2, scale: 1.5 , radius: 8},
            { x: 15, y: 0, z: -15, rotation: Math.PI / 2, scale: 1.2 , radius: 9},
            { x: 0, y: 0, z: 20, rotation: Math.PI, scale: 0.75 , radius: 6},
            { x: 0, y: 0, z: -20, rotation: -Math.PI, scale: 1.75 , radius: 5},
            { x: -20, y: 0, z: 0, rotation: Math.PI / 2, scale: 1.5 , radius: 8},
            { x: 20, y: 0, z: 0, rotation: Math.PI / 2, scale: 1.2 , radius: 9},
        ];
    
        let conifersTreePositions=[
            { x: 30, y: 0, z: 30, rotation: Math.PI, scale: 1.2 , radius: 7},
            { x: -30, y: 0, z: 30, rotation: Math.PI / 2, scale: 3 , radius: 8},
            { x: 30, y: 0, z: -30, rotation: Math.PI / 2, scale: 1.3 , radius: 6},
            { x: -30, y: 0, z: -30, rotation: Math.PI / 2, scale: 1.5 , radius: 9},
            { x: 30, y: 0, z: 0, rotation: Math.PI, scale: 1.2 , radius: 10},
            { x: 0, y: 0, z: 30, rotation: Math.PI / 2, scale: 3 , radius: 9},
            { x: 0, y: 0, z: -30, rotation: Math.PI / 2, scale: 1.3 , radius: 8},
            { x: -30, y: 0, z: 0, rotation: Math.PI / 2, scale: 1.5 , radius: 7},
        ];
        
        deciduousTreesPositions.forEach(tree=>{
            new PlantLoader("realistic_trees1")
                .getPlant()
                .then(models=>this._addTreeModelToScene(models,tree))
                .catch(error=>console.log(error));
        })
    
        conifersTreePositions.forEach(tree=>{
            new PlantLoader("realistic_trees2")
                .getPlant()
                .then(models=>this._addTreeModelToScene(models,tree))
                .catch(error=>console.log(error));
        })
    }

    _addTreeModelToScene(models,tree){
        let angle=0;

        models.forEach(model=>{

            model.scale.multiplyScalar(0.01*tree.scale);
            model.rotation.z = tree.rotation;

            angle+=2*Math.PI/3;
            const tempVector=new THREE.Vector3(
                tree.x+tree.radius*Math.cos(angle),
                tree.y,
                tree.z+tree.radius*Math.sin(angle)
            );

            const {x,y,z}=tempVector;

            model.position.set(x,y,z);
    
            this._scene.add(model);
    
            this._initTreeBody({
                world: this._world,
                position: {x,y,z},
                physicsMaterial : this._physicsMaterial,
                scale: tree.scale
            });
        });
    }
    
    _initTreeBody(params){
        const {world,position,physicsMaterial,scale}=params;
    
        const {x,y,z}=position;
    
        const treeShape=new CANNON.Box(new CANNON.Vec3(scale*0.1,scale*5,scale*0.1));
        const treeBody=new CANNON.Body({material: physicsMaterial});
    
        treeBody.addShape(treeShape);
        treeBody.position.set(x,y,z);
        treeBody.type=CANNON.Body.STATIC;
    
        world.addBody(treeBody);
    }
}