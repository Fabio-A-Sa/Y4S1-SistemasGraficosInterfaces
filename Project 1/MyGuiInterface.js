/**
 * @file MyGuiInterface.js
 * @class MyGuiInterface
 * @desc Creates a top right panel to control different settings in the threejs app.
 */

import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
 * @class
 * @classdec This class customizes the gui interface for the app
 */
class MyGuiInterface  {

    /**
     * Interface constructor
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui =  new GUI();
        this.contents = null
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     */
    init() {

        // Folders
        const cameraFolder = this.datgui.addFolder('Camera')        
        const objectFolder = this.datgui.addFolder('Objects');
        const lightsFolder = this.datgui.addFolder('Lights');

        // Camera
        cameraFolder.add(this.contents.axis, 'enabled', true).name('Show axis').onChange( () => { this.contents.axis.toggleEnable(this.contents.app.scene)});
        cameraFolder.add(this.app, 'activeCameraName', [ 'Perspective', 'Left', 'Top', 'Front','Right', 'Back' ] ).name("Active Camera");
        cameraFolder.add(this.app.activeCamera.position, 'x', -10, 10).name("X")
        cameraFolder.add(this.app.activeCamera.position, 'y', -10, 10).name("Y")
        cameraFolder.add(this.app.activeCamera.position, 'z', -10, 10).name("Z")
        cameraFolder.open();

        // Lights
        const lightsParams = {
            'spotlight_intensity': this.contents.cinemaLight1.spotlight.intensity,
            'spotligth_angle': this.contents.cinemaLight1.spotlight.angle,
            'lampshade': this.contents.lampshade1.spotlight.intensity,
            'fires': this.contents.fire.intensity,
            'windows': this.contents.windowLight.intensity,
            'candle': this.contents.candle.fireLight.intensity,
            'ambient': this.contents.ambientLight.intensity,
        }

        lightsFolder.add(lightsParams, 'spotlight_intensity', 0, 100).name("SpotLight's Intensity").onChange((value) => {
            this.contents.cinemaLight1.spotlight.intensity = value;
        });
        lightsFolder.add(lightsParams, 'spotligth_angle', 0.01, 0.62).name("SpotLight's Angle").onChange((value) => {
            this.contents.cinemaLight1.spotlight.angle = value;
        });
        lightsFolder.add(lightsParams, 'lampshade', 0, 100).name("Lampshade's Light").onChange((value) => {
            this.contents.lampshade1.spotlight.intensity = value;
        });
        lightsFolder.add(lightsParams, 'fires', 0, 10).name("Fires' Light").onChange((value) => {
            this.contents.fire.pointlight.intensity = value;
            this.contents.fire2.pointlight.intensity = value;
            this.contents.fire3.pointlight.intensity = value;
        });
        lightsFolder.add(lightsParams, 'windows', 0, 100).name("Window's Light").onChange((value) => {
            this.contents.windowLight.intensity = value;
        });
        lightsFolder.add(lightsParams, 'candle', 0, 100).name("Candle's Light").onChange((value) => {
            this.contents.candle.fireLight.intensity = value;
        });
        lightsFolder.add(lightsParams, 'ambient', 0, 100).name("Ambient Light").onChange((value) => {
            this.contents.ambientLight.intensity = value;
        });
        
        
        // Control Objects
        objectFolder.add(this.app, 'selectedObject',
                         this.app.objectList.filter(obj => obj && obj.name)
                                            .map(obj => obj.name)
                                            .sort())
                    .name("Selected object");
        objectFolder.add(this.app, 'objectTransformCtrl', true).name('Move sub objects');

        const controllers = {
            'xPos': 0,
            'yPos': 0,
            'zPos': 0,
            'xSca': 1,
            'ySca': 1,
            'zSca': 1,
            'ang': 0,
            'xVec': 0,
            'yVec': 0,
            'zVec': 0,
            sendScale: function() {
                const transformObj = this.app.getObjFromListByName(this.app.selectedObject);
                if (this.app.objectTransformCtrl) {transformObj.updateAllScale(controllers.xSca, controllers.ySca, controllers.zSca);}
                else {transformObj.updateScale(controllers.xSca, controllers.ySca, controllers.zSca);}
            }.bind(this),
            sendRotation: function() {
                const transformObj = this.app.getObjFromListByName(this.app.selectedObject);
                const rotationVector = new THREE.Vector3(controllers.xVec, controllers.yVec, controllers.zVec);
                const angRadians = controllers.ang * (Math.PI/180);
                if (this.app.objectTransformCtrl) {transformObj.updateAllRotation(angRadians, rotationVector.normalize());}
                else {transformObj.updateRotation(angRadians, rotationVector.normalize());}
            }.bind(this),
        };

        // Positions
        objectFolder.add(controllers, "xPos", -10, 10).onChange((value) => {
            const transformObj = this.app.getObjFromListByName(this.app.selectedObject);
            if (this.app.objectTransformCtrl) {transformObj.updateAllPosition(value, transformObj.sceneObject.position.y, transformObj.sceneObject.position.z);}
            else {transformObj.updatePosition(value, transformObj.sceneObject.position.y, transformObj.sceneObject.position.z);}
        }).name("Trasnform X");
        objectFolder.add(controllers, "yPos", -10, 10).onChange((value) => {
            const transformObj = this.app.getObjFromListByName(this.app.selectedObject);
            if (this.app.objectTransformCtrl) {transformObj.updateAllPosition(transformObj.sceneObject.position.x, value, transformObj.sceneObject.position.z);}
            else {transformObj.updatePosition(transformObj.sceneObject.position.x, value, transformObj.sceneObject.position.z);}
        }).name("Transform Y");
        objectFolder.add(controllers, "zPos", -10, 10).onChange((value) => {
            const transformObj = this.app.getObjFromListByName(this.app.selectedObject);
            if (this.app.objectTransformCtrl) {transformObj.updateAllPosition(transformObj.sceneObject.position.x, transformObj.sceneObject.position.y, value);}
            else {transformObj.updatePosition(transformObj.sceneObject.position.x, transformObj.sceneObject.position.y, value);}
        }).name("Transform Z");

        // Scales
        objectFolder.add(controllers, "xSca").name("Scale in x");
        objectFolder.add(controllers, "ySca").name("Scale in y");
        objectFolder.add(controllers, "zSca").name("Scale in z");
        objectFolder.add(controllers, "sendScale").name("update scale");

        // Rotation
        objectFolder.add(controllers, "ang").name("rotation angle (degrees)");
        objectFolder.add(controllers, "xVec").name("rotation vector x");
        objectFolder.add(controllers, "yVec").name("rotation vector y");
        objectFolder.add(controllers, "zVec").name("rotation vector z");
        objectFolder.add(controllers, "sendRotation").name("update rotation");

    }
}

export { MyGuiInterface };