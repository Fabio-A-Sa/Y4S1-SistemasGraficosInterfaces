/**
 * @file Chair.js
 * @class chair
 * @extends SceneObject
 * @desc Representation of a single chair model.
 */

import * as THREE from 'three';
import { SceneObject } from './SceneObject.js';
import { ShadowHelper } from '../utils/ShadowUtils.js';

/**
 * @class
 * @classdesc Simple representation of a chair.
 */
class Chair extends SceneObject {
    
    /**
     * Constructs an object representing a chair.
     * @constructor
     * @param {String} name - name of the object
     * @param {number} x - The x-coordinate of the chair's position.
     * @param {number} y - The y-coordinate of the chair's position.
     * @param {number} z - The z-coordinate of the chair's position.
     * @param {number} ang - The initial angle of the chair (default is 0).
     */
    constructor(name, x, y, z, ang = 0) {
        super(name, x, y, z, ang);

        // Chair-related attributes
        this.diffuseColor = "#964B00";
        this.specularColor = "#964B00";
        this.shininess = 30;

        // Material for the chair with Phong shading
        const woodTexture = new THREE.TextureLoader().load('./textures/wood1.jpg');
        this.material = new THREE.MeshStandardMaterial({
            color: 0xc0c0c0,   
            map: woodTexture, 
            roughness: 0.6,        
            metalness: 0.2,        
            normalScale: new THREE.Vector2(1, 1),
        });
    }

    /**
     * Builds a chair composed of a seat, backrest, and four legs.
     * @method
     */
    build() {

        // Create chair component geometries
        const chairSeatGeometry = new THREE.BoxGeometry(0.5, 0.05, 0.5);
        const chairBackrestGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.05);
        const chairLegGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 32);

        // Create chair components using the specified material
        const chairSeat = new THREE.Mesh(chairSeatGeometry, this.material);
        const chairBackrest = new THREE.Mesh(chairBackrestGeometry, this.material);
        const chairLeg1 = new THREE.Mesh(chairLegGeometry, this.material);
        const chairLeg2 = new THREE.Mesh(chairLegGeometry, this.material);
        const chairLeg3 = new THREE.Mesh(chairLegGeometry, this.material);
        const chairLeg4 = new THREE.Mesh(chairLegGeometry, this.material);

        // Shadows
        ShadowHelper.setShadow(chairLeg4);
        ShadowHelper.setShadow(chairSeat);
        ShadowHelper.setShadow(chairBackrest);
        ShadowHelper.setShadow(chairLeg1);
        ShadowHelper.setShadow(chairLeg2);
        ShadowHelper.setShadow(chairLeg3);
        ShadowHelper.setShadow(chairLeg4);

        // Position chair components appropriately
        chairSeat.position.set(0, 0.1, 0);
        chairBackrest.position.set(0, 0.475, -0.25);
        chairLeg1.position.set(-0.2, -0.2, -0.2);
        chairLeg2.position.set(0.2, -0.2, -0.2);
        chairLeg3.position.set(-0.2, -0.2, 0.2);
        chairLeg4.position.set(0.2, -0.2, 0.2);

        // Add chair components to the chair object
        this.sceneObject.add(chairSeat, chairBackrest, chairLeg1, chairLeg2, chairLeg3, chairLeg4);
    }
}

export { Chair };
