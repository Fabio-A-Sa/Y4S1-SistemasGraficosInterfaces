/**
 * @file Candle.js
 * @class Candle
 * @extends SceneObject
 * @desc Representation of a simple candle for the cake.
 */

import * as THREE from 'three';
import { SceneObject } from './SceneObject.js';
import { ShadowHelper } from '../utils/ShadowUtils.js';

/**
 * @class
 * @classdesc Representation of a simple candle, with a fire representation on top and an actual point light in the same palce.
 */
class Candle extends SceneObject {

    /**
     * Constructs a Candle object representing a candle.
     * @constructor
     * @param {String} name - name of the object
     * @param {number} x - The x-coordinate of the candle's position.
     * @param {number} y - The y-coordinate of the candle's position.
     * @param {number} z - The z-coordinate of the candle's position.
     * @param {number} radius - The radius of the candle (default is 1).
     * @param {number} ang - The initial angle of the candle (default is 0).
     */
    constructor(name, x, y, z, radius = 1, ang = 0) {
        super(name, x, y, z, ang);
        this.updateScale(radius, 1, radius);
    
        // Candle material attributes
        this.diffuseColor = "#ffff00";
        this.specularColor = "#ffff00";
        this.shininess = 30;
        
        // Material for the candle body
        const wood = new THREE.TextureLoader().load('./textures/wood1.jpg');
        this.candleMaterial = new THREE.MeshPhongMaterial({
            color: this.diffuseColor,
            specular: this.specularColorColor,
            shininess: this.shininess,
            map: wood
        });

        // Material for the candle's fire
        this.fireMaterial = new THREE.MeshPhongMaterial({
            color: this.diffuseColor,
            specular: "#ffffff",
            emissive: "#ff0000",
            emissiveIntensity: 10,
            shininess: 1000
        });

        // Point light for the candle's fire
        this.fireLight = new THREE.PointLight(0xffff00, 2, 2.5, 1);
        ShadowHelper.setShadow(this.fireLight);
        ShadowHelper.setLightAttributes(this.fireLight)
    }

    /**
     * Builds a detailed representation of a candle, including the candle body and fire.
     * @method
     */
    build() {
        const cylinderGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.1, 32, 1, false, 0, Math.PI * 2, false);
        const candle = new THREE.Mesh(cylinderGeometry, this.candleMaterial);
        ShadowHelper.setShadow(candle);

        // Add a sphere for the candle's fire
        const sphereGeometry = new THREE.SphereGeometry(0.015, 32, 32, 0, Math.PI, 0, Math.PI);
        const fireSphere = new THREE.Mesh(sphereGeometry, this.fireMaterial);
        ShadowHelper.setShadow(fireSphere);
        fireSphere.rotateX(Math.PI/2);
        fireSphere.add(this.fireLight);
        fireSphere.position.y = 0.07;

        this.fireLight.position.z = -0.1;

        // Add a cone for the candle's fire
        const coneGeometry = new THREE.CylinderGeometry(0, 0.015, 0.03, 32);
        const fireCone = new THREE.Mesh(coneGeometry, this.fireMaterial);
        ShadowHelper.setShadow(fireCone);
        fireCone.position.y = 0.085;

        this.sceneObject.add(candle, fireSphere, fireCone);
    }
}

export { Candle }
