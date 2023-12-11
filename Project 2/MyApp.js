
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MyContents } from './MyContents.js';
import { MyGuiInterface } from './MyGuiInterface.js';
import Stats from 'three/addons/libs/stats.module.js'

/**
 * This class contains the application object
 */
class MyApp  {
    /**
     * the constructor
     */
    constructor() {
        this.scene = null
        this.stats = null

        // camera related attributes
        this.activeCamera = null
        this.activeCameraName = null
        this.lastCameraName = null
        this.cameras = []
        this.frustumSize = 20

        // objects related attributes
        this.objectList = [];
        this.selectedObject = null;

        // light related attributes
        this.lights = [];
        this.selectedObject = null;

        // other attributes
        this.renderer = null
        this.controls = null
        this.gui = null
        this.axis = null
        this.contents == null
    }

    /**
     * initializes the application
     */
    init() {
                
        // Create an empty scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x101010 );

        this.stats = new Stats()
        this.stats.showPanel(1)
        document.body.appendChild(this.stats.dom)

        // Create a renderer with Antialiasing
        this.renderer = new THREE.WebGLRenderer({antialias:true});
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setClearColor("#000000");
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;

        // Configure renderer size
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        // Append Renderer to DOM
        document.getElementById("canvas").appendChild( this.renderer.domElement );

        // manage window resizes
        window.addEventListener('resize', this.onResize.bind(this), false );
    }

    /**
     * sets the active camera 
     */
    setActiveCamera() {   
        const cameraKeys = Object.keys(this.cameras);
        this.activeCamera = this.cameras[cameraKeys[cameraKeys.length - 1]];
        this.activeCameraName = this.activeCamera.name;
    }

    /**
     * updates the active camera if required
     * this function is called in the render loop
     * when the active camera name changes
     * it updates the active camera and the controls
     */
    updateCameraIfRequired() {

        // camera changed?
        if (this.lastCameraName !== this.activeCameraName) {
            this.lastCameraName = this.activeCameraName;
            this.activeCamera = this.cameras[this.activeCameraName];
            document.getElementById("camera").innerHTML = this.activeCameraName;
           
            // call on resize to update the camera aspect ratio
            // among other things
            this.onResize();

            // are the controls yet?
            if (this.controls === null) {
                
                // Orbit controls allow the camera to orbit around a target.
                this.controls = new OrbitControls( this.activeCamera, this.renderer.domElement );
                this.controls.enableZoom = true;
                this.controls.update();
                this.updateCameraTarget();
            }
            else {
                this.controls.object = this.activeCamera;
                this.controls.target.copy(this.activeCamera.userData.target);
                this.controls.update();
            }
        }
    }

    /**
     * the camera target handler
     */
    updateCameraTarget(){
        this.controls.target.copy(this.activeCamera.userData.target);
        this.controls.update();
    }

    /**
     * the window resize handler
     */
    onResize() {
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.activeCamera.aspect = window.innerWidth / window.innerHeight;
            this.activeCamera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );
        }
    }
    /**
     * 
     * @param {MyContents} contents the contents object 
     */
    setContents(contents) {
        this.contents = contents;
    }

    /**
     * @param {MyGuiInterface} contents the gui interface object
     */
    setGui(gui) {   
        this.gui = gui
    }

    /**
    * the main render function. Called in a requestAnimationFrame loop
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