/**
 * @file lightLoader.js
 * @desc Provides functions to load and set up lights.
 */

import * as THREE from 'three';
import { SceneObject } from '../objects/SceneObject.js';

/**
 * @namespace lightLoader
 */
export const lightLoader = {

  /**
   * Load a light based on the provided light object.
   * @method
   * @param {Object} light - Object with information to create and set up the light.
   * @returns {THREE.Object3D} The light object wrapped in a SceneObject.
   */
  load: function (light) {

    /**
     * A wrapper object to contain the light and its related elements.
     * @type {THREE.Object3D}
     */
    let lightWrapper = new SceneObject();

    /**
     * The light object to be created and added to the scene.
     * @type {?THREE.Light}
     */
    let lightObject;

    switch (light.type) {
        case 'pointlight':
            lightObject = new THREE.PointLight();
            lightObject.distance = light.distance ?? 1000;
            lightObject.decay = light.decay ?? 2;
            break;
        case 'spotlight':
            lightObject = new THREE.SpotLight();
            lightObject.distance = light.distance ?? 1000;
            lightObject.angle = THREE.MathUtils.radToDeg(light.angle);
            lightObject.decay = light.decay ?? 2;
            lightObject.penumbra = light.penumbra ?? 1;
            let lightTarget = new THREE.Object3D();
            lightObject.target = lightTarget;
            lightObject.target.position.set(...light.target);
            lightWrapper.add(lightTarget);
            break;
        case 'directionallight':
            lightObject = new THREE.DirectionalLight();
            lightObject.shadow.camera.left = light.shadowleft ?? -5;
            lightObject.shadow.camera.right = light.shadowright ?? 5;
            lightObject.shadow.camera.bottom = light.shadowbottom ?? -5;
            lightObject.shadow.camera.top = light.shadowtop ?? 5;
            break;
        default:
            break;
    }
    
    lightObject.enabled = light.enabled ?? true;
    lightObject.color = light.color;
    lightObject.intensity = light.intensity ?? 1;
    lightObject.position.set(...light.position);
    lightObject.castShadow = light.castshadow ?? false;
    lightObject.shadow.camera.far = light.shadowfar ?? 500;
    lightObject.shadow.mapSize.width = light.shadowmapsize ?? 512;
    lightObject.shadow.mapSize.height = light.shadowmapsize ?? 512;
    lightObject.name = light.id + "_light";
    lightWrapper.add(lightObject);
    lightWrapper.name = "lightwrapper_";
    
    return lightWrapper;
  },
};
