/**
 * @file MyContent.js
 * @class MyContent
 * @desc Creates and loads the the objects in the scene, also controls them.
 */

import * as THREE from 'three';

// objects
import { MyAxis } from './MyAxis.js';
import { SceneObject } from './objects/SceneObject.js';
import { Chair } from './objects/Chair.js';
import { Table } from './objects/Table.js';
import { Cake } from './objects/Cake.js';
import { Plate } from './objects/Plate.js';
import { Surface } from './objects/Surface.js';
import { Candle } from './objects/Candle.js';
import { Painting } from './objects/Painting.js';
import { Dog } from './objects/dog/Dog.js';
import { CartoonFire } from './objects/CartoonFire.js';
import { CinemaLight } from './objects/CinemaLight.js';
import { Rug } from './objects/Rug.js';
import { Lampshade } from './objects/Lampshade.js';

// curves
import { Spring } from './objects/Spring.js';
import { Jar } from './objects/Jar.js';
import { Newspaper } from './objects/Newspaper.js';
import { CarStructure } from './objects/CarStructure.js';
import { Flower } from './objects/Flower.js';

// utils
import { ShadowHelper } from './utils/ShadowUtils.js';

/**
 * @class
 * @classdesc This class contains the contents of our application
 */
class MyContents  {

    /**
       constructs the objects
       @param {MyApp} app The application object
    */ 
    constructor(app) {

        this.app = app;
        this.axis = new MyAxis(this);

        // table items
        this.table = new Table("table", 0, 0.5, 0);
        this.smallPlate1 = new Plate("plate1", 0.134, 1.0525, 0.65, 0.45);
        this.smallPlate2 = new Plate("plate2", -0.015, 1.0525, -0.6, 0.45);
        this.plate = new Plate("plate3", 0, 1.0525, 0, 0.6);
        this.cake = new Cake("cake", 0, 1.15, 0, 0.5, 0.2);
        this.cakePiece = new Cake("cake_piece", 0.1, 1.05, 0.5, 0.5, 0.2, 0, Math.PI/6);
        this.candle = new Candle("candle",0.05, 1.3, -0.02);
        this.cakePiece.updateRotation(Math.PI/2, new THREE.Vector3(0,0,1));
        this.cakePiece.updateRotation(Math.PI/10, new THREE.Vector3(1,0,0));
       
        // chairs
        this.chair1 = new Chair("chair1", 0, 0.5, -1.15, Math.PI/3);
        this.chair2 = new Chair("chair2", 0, 0.5, 1.5, Math.PI); 
        
        // walls
        this.wall1 = new Surface("wall1",0, 2.5, -3, 0);
        this.wall2 = new Surface("wall2", 5, 2.5, 0, Math.PI / 2);
        this.wall3 = new Surface("wall3", 0,2.5, 3, Math.PI);
        this.wall4 = new Surface("wall4", -5, 2.5, 0, -Math.PI / 2);
        this.wall4.updateScale(0.6,1,1);
        this.wall2.updateScale(0.6,1,1);

        // dog
        this.dog = new Dog("dog", 0,1.02,1.5,0);
        this.dog.updateScale(0.6,0.6,-0.6);

        // fires
        this.fire = new CartoonFire("fire1", 0,0,0,0);
        this.fire2 = new CartoonFire("fire2", 0,0,0,0);
        this.fire3 = new CartoonFire("fire3", 0,0,0,0);
        this.fire.updateScale(0.1,0.1,0.1);
        this.fire.updateRotation(Math.PI/2, new THREE.Vector3(0,1,0));
        this.fire.updatePosition(-2,0,2);
        this.fire2.updateScale(-0.2,0.25,0.2);
        this.fire2.updateRotation(Math.PI/4, new THREE.Vector3(0,1,0));
        this.fire2.updatePosition(-0.5,0,-2);
        this.fire3.updateScale(-0.1,0.15,0.1);
        this.fire3.updatePosition(3,0,-1.5);

        // floor
        this.floor = new Surface("floor", 0, 0, 0);
        this.floor.updateScale( 1, 1, 1.2);
        this.floor.updateRotation(-Math.PI/2, new THREE.Vector3(1,0,0));

        // rug
        this.rug = new Rug("rug", 0, 0, 0, 0, 0);
        this.rug.updateScale( 2.5, 1, 2);

        // door
        this.door = new Painting("door", 4, 1.3, -3, 0, { width: 1.25, height: 2.5 });

        // windows
        this.window1 = new Painting("window1", 0, 2.5, -3, 0, { width: 4, height: 2 });
        this.windowLightObj = new SceneObject(undefined, 0, 2.7,-2.9);
        this.windowLight = new THREE.PointLight(0xdffffd, 10, 500);
        this.windowLightObj.addToMainObject(this.windowLight);
        this.window1.addSubObject(this.windowLightObj);

        // steve and alex paintings
        this.painting1 = new Painting("painting1", -1.5, 2, 3, Math.PI, { width: 1, height: 2 });
        this.painting2 = new Painting("painting2", 1.5, 2, 3, Math.PI, { width: 1, height: 2 });

        // car painting
        this.painting3 = new Painting("painting3", -5, 2.5, 0, Math.PI/2, { width: 4, height: 2 });
        this.car = new CarStructure(undefined, 2,2,2,0);
        this.car.updateAllRotation(Math.PI/2, new THREE.Vector3(0,1,0));
        this.car.updateAllScale(0.15,0.15,0.15);
        this.car.updateAllPosition(-4.99,1.65,1);

        // creeper paiting
        this.painting4 = new Painting("painting4", 5, 2.5, 0, -Math.PI/2, { width: 4, height: 2 });

        // spring
        this.spring = new Spring("spring", 0.6, 1.15, -0.6, 0.02, 0.5, 100, 0.05);
        this.spring.updateAllRotation(Math.PI/2, new THREE.Vector3(1,0,0));

        // vases
        this.vase1 = new Jar("vase1", -4.5, 0, 2.5, 0, 0);
        this.flower1 = new Flower("flower1", -4.5, 1.5, 2.5);
        this.vase1.updateAllScale(0.1,0.1,0.1);
        this.vase1.updateAllRotation(Math.PI/8);
        this.flower1.updateAllRotation(Math.PI/1.5);

        this.vase2 = new Jar("vase2",-4.5, 0, -2.5, 0, 0);
        this.flower2 = new Flower("flower2", -4.5, 1.5, -2.5, 0.1, 10);
        this.vase2.updateAllScale(0.1,0.1,0.1);
        this.vase2.updateAllRotation(-Math.PI/8);
        this.flower2.updateAllRotation(Math.PI/4);

        // newspaper
        this.newspaper = new Newspaper("newspaper", -0.52,1.05,1.33,0);
        this.newspaper.updateAllScale(0.1,0.1,0.1);
        this.newspaper.updateAllRotation(-Math.PI/8, new THREE.Vector3(1,0,0));
        this.newspaper.updateAllRotation(Math.PI/6, new THREE.Vector3(0,1,0));
        this.newspaper.updateAllRotation(Math.PI/6, new THREE.Vector3(0,0,1));

        // cinema light
        this.cinemaLight1 = new CinemaLight("cinema_light", 3, 4, 0, 0.6);
        this.cinemaLight1.updateRotation(-Math.PI/2, new THREE.Vector3(1,0,0));
        this.cinemaLight1.updateRotation(Math.PI/2, new THREE.Vector3(0,0,1));
        this.cinemaLight1.updateRotation(-Math.PI/4, new THREE.Vector3(1,0,0));

        // lampshade
        this.lampshade1 = new Lampshade("lampshade", 4.3,0,2.3);
        this.lampshade1.updateAllScale(1.2,1.2,1.2);
    }
    
    /**
     * initializes all scene lights
     * method
     */
    initLights() {
        
        // Ambient Light
        this.ambientLight = new THREE.AmbientLight( 0x6f6f6f, 0.6 );
        this.app.scene.add( this.ambientLight );

        // Window Light
        ShadowHelper.setShadow(this.windowLight);

        // 
        ShadowHelper.setShadow(this.wall1);
        ShadowHelper.setShadow(this.wall2);
        ShadowHelper.setShadow(this.wall3);
        ShadowHelper.setShadow(this.wall4);
    }

    /**
     * initializes all objects dependency structure
     * @method
     */
    initObjects() {

        // axis
        this.app.scene.add(this.axis);

        // table elements
        this.cake.addSubObject(this.candle);
        this.plate.addSubObject(this.cake);
        this.smallPlate1.addSubObject(this.cakePiece);
        this.table.addSubObject(this.plate);
        this.table.addSubObject(this.smallPlate1);
        this.table.addSubObject(this.smallPlate2);
        this.table.addSubObject(this.spring);

        // chair elements
        this.chair2.addSubObject(this.dog);

        // rug elements
        this.rug.addSubObject(this.fire);
        this.rug.addSubObject(this.fire2);
        this.rug.addSubObject(this.fire3);
        this.rug.addSubObject(this.table);
        this.rug.addSubObject(this.chair1);
        this.rug.addSubObject(this.chair2);

        // dog elements
        this.dog.addSubObject(this.newspaper);

        // painting elements
        this.painting3.addSubObject(this.car);

        // vase elements
        this.vase1.addSubObject(this.flower1);
        this.vase2.addSubObject(this.flower2);

        // wall elements
        this.wall1.addSubObject(this.window1);
        this.wall1.addSubObject(this.door);
        this.wall2.addSubObject(this.painting4);
        this.wall3.addSubObject(this.painting1);
        this.wall3.addSubObject(this.painting2);
        this.wall4.addSubObject(this.painting3);

        // floor elements
        this.floor.addSubObject(this.vase1);
        this.floor.addSubObject(this.vase2);
        this.floor.addSubObject(this.rug);
        this.floor.addSubObject(this.lampshade1);
        
        // building the object and sub objects
        this.wall1.buildAll();
        this.wall2.buildAll();
        this.wall3.buildAll();
        this.wall4.buildAll();
        this.floor.buildAll();
        this.cinemaLight1.buildAll();
        
        // adding main elements to scene
        this.wall1.addAllScene(this.app);
        this.wall2.addAllScene(this.app);
        this.wall3.addAllScene(this.app);
        this.wall4.addAllScene(this.app);
        this.floor.addAllScene(this.app);
        this.cinemaLight1.addAllScene(this.app);
    }

    /**
     * initializes all textures
     * @method
     */
    initTextures() {

        const windowsXP = new THREE.TextureLoader().load('./textures/windowsXP.jpg');
        const windowsMaterial = new THREE.MeshStandardMaterial({  
            map: windowsXP, 
        });
        this.window1.updatePainting(windowsMaterial);

        const road0 = new THREE.TextureLoader().load('./textures/road.jpg');
        const painting3Material = new THREE.MeshStandardMaterial({  
            map: road0, 
        });
        this.painting3.updatePainting(painting3Material);

        const steve = new THREE.TextureLoader().load('./textures/steve.jpg');
        const steveMaterial = new THREE.MeshStandardMaterial({  
            map: steve, 
        });
        this.painting1.updatePainting(steveMaterial);

        const alex = new THREE.TextureLoader().load('./textures/alex.jpg');
        const alexMaterial = new THREE.MeshStandardMaterial({  
            map: alex, 
        });
        this.painting2.updatePainting(alexMaterial);

        const creeper = new THREE.TextureLoader().load('./textures/creeper.jpg');
        const creeperMaterial = new THREE.MeshStandardMaterial({  
            map: creeper, 
        });
        this.painting4.updatePainting(creeperMaterial);

        const floor = new THREE.TextureLoader().load('./textures/wood2.jpg');
        floor.wrapS = THREE.RepeatWrapping;
        floor.wrapT = THREE.RepeatWrapping;
        floor.repeat.set(5, 5);
        const floorMaterial = new THREE.MeshStandardMaterial({
            map: floor,
        })
        this.floor.updateMaterial(floorMaterial);

        const wall = new THREE.TextureLoader().load('./textures/whiteWool.jpg');
        wall.wrapS = THREE.RepeatWrapping;
        wall.wrapT = THREE.RepeatWrapping;
        wall.repeat.set(10, 6);
        const woolWall = new THREE.MeshStandardMaterial({
            map: wall,
            roughness: 0.6, 
        });

        this.wall1.updateMaterial(woolWall);
        this.wall2.updateMaterial(woolWall);
        this.wall3.updateMaterial(woolWall);
        this.wall4.updateMaterial(woolWall);

        const doorTexture = new THREE.TextureLoader().load('./textures/door.jpg');
        const doorMaterial = new THREE.MeshStandardMaterial({
            map: doorTexture,
            roughness: 0.6
        });
        this.door.updatePainting(doorMaterial);
    }

    /**
     * initializes all the scene contents
     * @method
     */
    init() {
        this.initLights();
        this.initObjects();
        this.initTextures();
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     * @method
     */
    update() {
        // not needed in this TP
    }
}

export { MyContents };