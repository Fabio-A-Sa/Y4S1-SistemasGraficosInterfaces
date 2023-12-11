/**
 * @file MyContents.js
 * @desc Contains the contents of the application.
 */

import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { cameraLoader } from './loaders/CameraLoader.js';
import { textureLoaderC } from './loaders/TextureLoaderC.js';
import { materialLoader } from './loaders/MaterialLoader.js';
import { objectLoader } from "./loaders/ObjectLoader.js";
import { skyboxLoader } from './loaders/SkyboxLoader.js';

/**
 * @class
 * This class contains the contents of the application.
 */
class MyContents {

    /**
     * @constructor
     * @param {MyApp} app - The application object.
     */
    constructor(app) {

        this.app = app;
        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
        this.axis = new MyAxis(this);

        // Ours
        this.reader.open("scenes/SGI_TP2_XML_T07_G03_v02/SGI_TP2_XML_T07_G03_v02.xml");

        // Testing
        // this.reader.open("scenes/SGI_TP2_XML_T05_G10/SGI_TP2_XML_T05_G10_v02.xml"); 
        // this.reader.open("scenes/SGI_TP2_XML_T08_G08_v01/SGI_TP2_XML_T08_G08_v01.xml"); 
        // this.reader.open("scenes/SGI_TP2_XML_T04_G06_v01/SGI_TP2_XML_T04_G06_v01.xml"); 
        // this.reader.open("scenes/SGI_TP2_XML_T04_G02_v01/scene.xml");
        // this.reader.open("scenes/T02g03/t02g03.xml");
    }

    /**
     * Initializes the contents.
     * @method
     */
    init() {
        // nothing to init
    }

    /**
     * Called when the scene XML file load is complete.
     * @method
     * @param {MySceneData} data - The entire scene data object.
     */
    onSceneLoaded(data) {
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    /**
     * Executed after the scene is loaded and before rendering.
     * @method
     * @param {MySceneData} data - The entire scene data object.
     */
    onAfterSceneLoadedAndBeforeRender(data) {

        // Cameras
        cameraLoader.load(data.cameras).forEach(camera => {
            this.app.cameras[camera.name] = camera;
        });
        this.app.setActiveCamera();

        // Globals
        const globalSettings = {
            background: new THREE.Color(...data.options.background),
            ambient: new THREE.Color(...data.options.ambient),
        };
        this.app.scene.background = globalSettings.background;
        const ambientLight = new THREE.AmbientLight(globalSettings.ambient);
        this.app.lights["ambient_light"] = ambientLight;
        this.app.scene.add(ambientLight);

        // Fog
        if (data.fog !== "undefined") {
            const fogParams = {
                color: new THREE.Color(...data.fog.color),
                near: data.fog.near,
                far: data.fog.far,
                type: data.fog.type,
            };
            const fog = new THREE.Fog(data.color, fogParams.near, fogParams.far);
            this.app.scene.fog = fog;
        }

        // Textures and Materials
        let texturePaths = textureLoaderC.getTexPaths(data.textures);
        let materialMap = materialLoader.getMatDetails(data.materials, texturePaths);

        // Skybox
        let skybox = skyboxLoader.load(data.skyboxes);
        this.app.scene.add(skybox);

        // Scene Objects
        let objects = objectLoader.load(data.nodes, data.rootId, materialMap);
        this.app.scene.add(objects);

        // Add object to list used in GUI interface
        objects.traverse((item) => {
            if (item.name && item.name.endsWith("_obj"))
                this.app.objectList.push(item);
        });

        // Add lights to list used in GUI interface
        objects.traverse((item) => {
            if (item.name && item.name.endsWith("_light"))
                this.app.lights[item.name] = item;
        });
    }

    /**
     * Update method for the contents.
     * @method
     */
    update() {
        // Nothing to update
    }
}

export { MyContents };
