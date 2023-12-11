/**
 * @file MyApp.js
 * @class MyApp
 * @desc Main class for the webapp in THREE.js
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MyContents } from './MyContents.js';
import { MyGuiInterface } from './MyGuiInterface.js';
import Stats from 'three/addons/libs/stats.module.js'

/**
 * @class
 * @classdesc This class contains the application object
 * 
 */
class MyApp  {
    /**
     * The constructor
     */
    constructor() {
        this.scene = null
        this.stats = null

        // list to have all the complete items of the scene
        this.objectList = [];
        this.selectedObject = null;
        this.objectTransformCtrl = true;

        // camera related attributes
        this.activeCamera = null
        this.activeCameraName = null
        this.lastCameraName = null
        this.cameras = []
        this.frustumSize = 20

        // other attributes
        this.renderer = null
        this.controls = null
        this.gui = null
        this.axis = true
        this.contents == null
    }
    /**
     * initializes the application
     * @method
     */
    init() {
                
        // Create an empty scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x101010 );

        this.stats = new Stats();
        this.stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom);

        this.initCameras();
        this.setActiveCamera('Perspective');

        // Create a renderer with Antialiasing
        this.renderer = new THREE.WebGLRenderer({antialias:true});
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setClearColor("#000000");

        // Configure renderer size
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        // Append Renderer to DOM
        document.getElementById("canvas").appendChild( this.renderer.domElement );

        // manage window resizes
        window.addEventListener('resize', this.onResize.bind(this), false );

        // shadows
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;
    }

    /**
     * initializes all the cameras
     * @method
     */
    initCameras() {
        const aspect = window.innerWidth / window.innerHeight;

        // Create a basic perspective camera
        const perspective1 = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 );
        perspective1.position.set(2,6,2);
        this.cameras['Perspective'] = perspective1;

        // defines the frustum size for the orthographic cameras
        const left = -this.frustumSize / 2 * aspect;
        const right = this.frustumSize /2 * aspect ;
        const top = this.frustumSize / 2 ;
        const bottom = -this.frustumSize / 2;
        const near = -this.frustumSize /2;
        const far =  this.frustumSize;

        // create a left view orthographic camera
        const orthoLeft = new THREE.OrthographicCamera( left, right, top, bottom, near, far);
        orthoLeft.up = new THREE.Vector3(0,1,0);
        orthoLeft.position.set(-this.frustumSize / 4,0,0) 
        orthoLeft.lookAt( new THREE.Vector3(0,0,0) );
        this.cameras['Left'] = orthoLeft

        // create a top view orthographic camera
        const orthoTop = new THREE.OrthographicCamera( left, right, top, bottom, near, far);
        orthoTop.up = new THREE.Vector3(0,0,1);
        orthoTop.position.set(0, this.frustumSize /4, 0) 
        orthoTop.lookAt( new THREE.Vector3(0,0,0) );
        this.cameras['Top'] = orthoTop

        // create a front view orthographic camera
        const orthoFront = new THREE.OrthographicCamera( left, right, top, bottom, near, far);
        orthoFront.up = new THREE.Vector3(0,1,0);
        orthoFront.position.set(0,0, this.frustumSize / 4) 
        orthoFront.lookAt( new THREE.Vector3(0,0,0) );
        this.cameras['Front'] = orthoFront

        // create a right view orthographic camera
        const orthoRight = new THREE.OrthographicCamera( left, right, top, bottom, near, far);
        orthoRight.up = new THREE.Vector3(0,1,0);
        orthoRight.position.set(this.frustumSize /4,0,0) 
        orthoRight.lookAt( new THREE.Vector3(0,0,0) );
        this.cameras['Right'] = orthoRight;

        // create a back view orthographic camera
        const orthoBack = new THREE.OrthographicCamera( left, right, top, bottom, near, far);
        orthoBack.up = new THREE.Vector3(0,1,0);
        orthoBack.position.set(0,0, -this.frustumSize /4) 
        orthoBack.lookAt( new THREE.Vector3(0,0,0) );
        this.cameras['Back'] = orthoBack
    }

    /**
     * sets the active camera by name
     * @method
     * @param {String} cameraName 
     */
    setActiveCamera(cameraName) {   
        this.activeCameraName = cameraName
        this.activeCamera = this.cameras[this.activeCameraName]
    }

    /**
     * updates the active camera if required
     * this function is called in the render loop
     * when the active camera name changes
     * it updates the active camera and the controls
     * @method
     * 
     */
    updateCameraIfRequired() {

        // camera changed?
        if (this.lastCameraName !== this.activeCameraName) {
            this.lastCameraName = this.activeCameraName;
            this.activeCamera = this.cameras[this.activeCameraName]
            document.getElementById("camera").innerHTML = this.activeCameraName
           
            // call on resize to update the camera aspect ratio
            // among other things
            this.onResize()

            // are the controls yet?
            if (this.controls === null) {
                // Orbit controls allow the camera to orbit around a target.
                this.controls = new OrbitControls( this.activeCamera, this.renderer.domElement );
                this.controls.enableZoom = true;
                this.controls.update();
            }
            else {
                this.controls.object = this.activeCamera
            }
        }
    }

    /**
     * the window resize handler
     * @method
     */
    onResize() {
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.activeCamera.aspect = window.innerWidth / window.innerHeight;
            this.activeCamera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );
        }
    }
    /**
     * Set the contents of the scene
     * @method
     * @param {MyContents} contents the contents object 
     */
    setContents(contents) {
        this.contents = contents;
    }

    /**
     * Defines the GUI of the webapp
     * @method
     * @param {MyGuiInterface} contents the gui interface object
     */
    setGui(gui) {   
        this.gui = gui
    }

    /**
    * the main render function. Called in a requestAnimationFrame loop
    * @method
    */
    render () {
        this.stats.begin();
        this.updateCameraIfRequired();

        // update the animation if contents were provided
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.contents.update();
        }

        // required if controls.enableDamping or controls.autoRotate are set to true
        this.controls.update();

        // render the scene
        this.renderer.render(this.scene, this.activeCamera);

        // subsequent async calls to the render loop
        requestAnimationFrame( this.render.bind(this) );

        this.lastCameraName = this.activeCameraName;
        this.stats.end();
    }

    /**
     * Add object to objectList (sceneObject)
     * @method
     * @param {seceneObject} obj - object to be added
     */
    addToObjList(obj) {
        this.objectList.push(obj);
    }

    /**
     * Remove object from objectList (sceneObject)
     * @method
     * @param {String} name - name of object to be removed
     */
    removeToObjList(name) {
        const index = this.objectList.findIndex(obj => obj.name === name);
        if (index !== -1) {
            this.objectList.splice(index, 1);
        }
    }

    /**
     * Get object form objectList by name
     * @method
     * @param {string} name - name of the object to retrieve
     * @return {sceneObject|null} - the object if found, else null
     */
    getObjFromListByName(name) {
        if( name === undefined) return null;
        return this.objectList.find(obj => obj.name === name) || null;
    }
}

export { MyApp };