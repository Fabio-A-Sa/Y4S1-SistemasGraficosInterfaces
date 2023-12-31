/**
 * @file MyGuiInterface.js
 * @desc Provides customization for the GUI interface of the app.
 */

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';
import * as THREE from 'three';

/**
 * @class
 * This class customizes the GUI interface for the app.
 */
class MyGuiInterface {

    /**
     * @constructor
     * @param {MyApp} app - The application object.
     */
    constructor(app) {
        this.app = app;
        this.datgui = new GUI();
        this.contents = null;
        this.datgui.close();
    }

    /**
     * Set the contents object.
     * @method
     * @param {MyContents} contents - The contents object.
     */
    setContents(contents) {
        this.contents = contents;
    }

    /**
     * Initialize the GUI interface.
     * @method
     */
    init() {

        // Folders
        this.mainFolder = this.datgui.addFolder("Main");
        this.cameraFolder = this.datgui.addFolder("Camera");
        this.objectFolder = this.datgui.addFolder('Objects');
        this.lightsFolder = this.datgui.addFolder('Lights');

        // Axis
        this.mainFolder.add(this.contents.axis, 'enabled', true).name('Show axis').onChange(() => {
            !this.contents.axis.enabled ? this.app.scene.remove(this.contents.axis) : this.app.scene.add(this.contents.axis);
        })

        // Cameras
        const cameraNames = Object.keys(this.app.cameras);
        const activeCameraController = this.cameraFolder.add(this.app, 'activeCameraName', cameraNames).name("Active Camera");

        // Set up an onChange callback for the activeCameraController
        activeCameraController.onChange(() => {

            // Clear existing controls
            const children = [...this.cameraFolder.children].filter(controller => controller.property !== "activeCameraName");
            children.forEach(controller => {
                controller.destroy();
            });
        });

        // Objects
        this.objControlVars = {
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
            sendScale: function () {
                const transformObj = this.app.getObjFromListByName(this.app.selectedObject);
                if (this.objControlVars.xSca !== 0 && this.objControlVars.ySca !== 0 && this.objControlVars.zSca !== 0) {
                    transformObj.scale.x *= this.objControlVars.xSca;
                    transformObj.scale.y *= this.objControlVars.ySca;
                    transformObj.scale.z *= this.objControlVars.zSca;
                }
            }.bind(this),
            sendRotation: function () {
                const transformObj = this.app.getObjFromListByName(this.app.selectedObject);
                const rotationVector = new THREE.Vector3(this.objControlVars.xVec, this.objControlVars.yVec, this.objControlVars.zVec);
                const angRadians = this.objControlVars.ang * (Math.PI / 180);
                transformObj.rotateOnAxis(rotationVector.normalize(), angRadians);
            }.bind(this),
        };
        this.setupObjectControls();

        // Lights
        this.lightAttributes;
        const lightNames = Object.keys(this.app.lights);
        const selectedLightController = this.lightsFolder.add(this.app, 'selectedLightType', lightNames).name("Selected Light");
        selectedLightController.onChange((selectedLightType) => {
            const selectedLight = this.app.lights[selectedLightType];
            this.setupLightControls(selectedLight);
        });

        // Initial light setup
        this.setupLightControls(this.app.lights[this.app.selectedLightType]);
    }

    /**
     * Set up controls for the specified camera.
     * @method
     * @param {THREE.Camera} camera - The camera for which controls are set up.
     */
    setupCameraControls(camera) {
        if (!camera) return;

        if (camera instanceof THREE.OrthographicCamera) {
            this.cameraFolder.add(camera, 'left', -100, 100).name("Left");
            this.cameraFolder.add(camera, 'right', -100, 100).name("Right");
            this.cameraFolder.add(camera, 'top', -100, 100).name("Top");
            this.cameraFolder.add(camera, 'bottom', -100, 100).name("Bottom");
        } else if (camera instanceof THREE.PerspectiveCamera) {
            this.cameraFolder.add(camera, 'fov', 1, 180).name("Field of View").onChange((value) => {
                camera.fov = value;
                camera.updateProjectionMatrix();
            });
        }
        this.cameraFolder.add(camera, 'near', 0.1, 1000).name("Near").onChange((value) => {
            camera.near = value;
            camera.updateProjectionMatrix();
        });
        this.cameraFolder.add(camera, 'far', 100, 5000).name("Far").onChange((value) => {
            camera.far = value;
            camera.updateProjectionMatrix();
        });

        // Create a folder for position controls
        const positionFolder = this.cameraFolder.addFolder('Position');
        positionFolder.add(camera.position, 'x', -10, 10).name("X");
        positionFolder.add(camera.position, 'y', -10, 10).name("Y");
        positionFolder.add(camera.position, 'z', -10, 10).name("Z");

        // Create a folder for lookAt controls
        const lookAtFolder = this.cameraFolder.addFolder('LookAt');
        const lookAtControls = {
            lookAtX: camera.userData.target ? camera.userData.target.x : 0,
            lookAtY: camera.userData.target ? camera.userData.target.y : 0,
            lookAtZ: camera.userData.target ? camera.userData.target.z : 0,
        };

        const updateLookAt = () => {
            camera.userData.target = new THREE.Vector3(lookAtControls.lookAtX, lookAtControls.lookAtY, lookAtControls.lookAtZ);
            this.app.updateCameraTarget();
        };

        lookAtFolder.add(lookAtControls, 'lookAtX', -100, 300).name("LookAt X")
            .onChange(updateLookAt);

        lookAtFolder.add(lookAtControls, 'lookAtY', -100, 100).name("LookAt Y")
            .onChange(updateLookAt);

        lookAtFolder.add(lookAtControls, 'lookAtZ', -100, 100).name("LookAt Z")
            .onChange(updateLookAt);
    }

    /**
     * Set up controls for objects.
     * @method
     */
    setupObjectControls() {
        this.objectFolder.add(this.app, 'selectedObject',
            this.app.objectList.filter(obj => obj && obj.name)
                .map(obj => obj.name)
                .sort())
                .name("Selected object");

        // Positions
        this.objectFolder.add(this.objControlVars, "xPos", -10, 10).onChange((value) => {
            const transformObj = this.app.getObjFromListByName(this.app.selectedObject);
            transformObj.position.set(value, transformObj.position.y, transformObj.position.z);
        }).name("Transform X");
        this.objectFolder.add(this.objControlVars, "yPos", -10, 10).onChange((value) => {
            const transformObj = this.app.getObjFromListByName(this.app.selectedObject);
            transformObj.position.set(transformObj.position.x, value, transformObj.position.z);
        }).name("Transform Y");
        this.objectFolder.add(this.objControlVars, "zPos", -10, 10).onChange((value) => {
            const transformObj = this.app.getObjFromListByName(this.app.selectedObject);
            transformObj.position.set(transformObj.position.x, transformObj.position.y, value);
        }).name("Transform Z");

        // Scales
        this.objectFolder.add(this.objControlVars, "xSca").name("Scale in x");
        this.objectFolder.add(this.objControlVars, "ySca").name("Scale in y");
        this.objectFolder.add(this.objControlVars, "zSca").name("Scale in z");
        this.objectFolder.add(this.objControlVars, "sendScale").name("Update Scale");

        // Rotation
        this.objectFolder.add(this.objControlVars, "ang").name("Rotation Angle (degrees)");
        this.objectFolder.add(this.objControlVars, "xVec").name("Rotation Vector X");
        this.objectFolder.add(this.objControlVars, "yVec").name("Rotation Vector Y");
        this.objectFolder.add(this.objControlVars, "zVec").name("Rotation Vector Z");
        this.objectFolder.add(this.objControlVars, "sendRotation").name("Update Rotation");
    }

    /**
     * Set up controls for lights.
     * @method
     * @param {THREE.Light} light - The light for which controls are set up.
     */
    setupLightControls(light) {
        if (!light) return;

        // Clear existing controls
        const children = [...this.lightsFolder.children]
            .filter(controller => controller.property !== "selectedLightType");
        children.forEach(controller => {
            controller.destroy();
        });

        // Add controls based on the selected light type
        switch (light.type) {
            case 'AmbientLight':
                this.lightsFolder.addColor(light, 'color').name("Color");
                this.lightsFolder.add(light, 'intensity', 0, 100).name("Intensity");
                return;
            case 'PointLight':
                this.lightsFolder.add(light, 'distance', 0, 1000).name("Distance");
                this.lightsFolder.add(light, 'decay', 0, 10).name("Decay");
                break;
            case 'SpotLight':
                this.lightAttributes = {
                    "angle": THREE.MathUtils.radToDeg(light.angle),
                };

                this.lightsFolder.add(light, 'distance', 0, 1000).name("Distance");
                this.lightsFolder.add(this.lightAttributes, 'angle', 0, 180).name("Angle").onChange((value) => { light.angle = THREE.MathUtils.degToRad(value); });
                this.lightsFolder.add(light, 'decay', 0, 10).name("Decay");
                this.lightsFolder.add(light, 'penumbra', 0, 1).name("Penumbra");
                const targetFolder = this.lightsFolder.addFolder('Target');
                targetFolder.add(light.target.position, 'x', -10, 10).name("X");
                targetFolder.add(light.target.position, 'y', -10, 10).name("Y");
                targetFolder.add(light.target.position, 'z', -10, 10).name("Z");
                break;
            case 'DirectionalLight':
                this.lightsFolder.add(light.shadow.camera, 'left', -10, 10).name("Shadow Left");
                this.lightsFolder.add(light.shadow.camera, 'right', -10, 10).name("Shadow Right");
                this.lightsFolder.add(light.shadow.camera, 'bottom', -10, 10).name("Shadow Bottom");
                this.lightsFolder.add(light.shadow.camera, 'top', -10, 10).name("Shadow Top");
                break;
            default:
                break;
        }

        // Add common controls
        this.lightsFolder.add(light, 'visible').name("Enabled");
        this.lightsFolder.addColor(light, 'color').name("Color");
        this.lightsFolder.add(light, 'intensity', 0, 100).name("Intensity");
        const positionFolder = this.lightsFolder.addFolder('Position');
        positionFolder.add(light.position, 'x', -10, 10).name("X");
        positionFolder.add(light.position, 'y', -10, 10).name("Y");
        positionFolder.add(light.position, 'z', -10, 10).name("Z");
        this.lightsFolder.add(light, 'castShadow').name("Cast Shadow");
        this.lightsFolder.add(light.shadow.camera, 'far', 0, 1000).name("Shadow Far").onChange(() => {
            light.shadow.camera.updateProjectionMatrix();
        });
        this.lightsFolder.add(light.shadow.mapSize, 'width', 0, 1024).name("Shadow Map Width");
        this.lightsFolder.add(light.shadow.mapSize, 'height', 0, 1024).name("Shadow Map Height");
    }
}

export { MyGuiInterface };
