/**
 * @file DogLeg.js
 * @class DogLeg
 * @extends SceneObject
 * @desc Leg for the class Dog.js
 */

import * as THREE from 'three';
import { SceneObject } from '../SceneObject.js';
import { ShadowHelper } from '../../utils/ShadowUtils.js';

/**
 * @class
 * @classdesc Leg object for the cartoon dog.
 */
class DogLeg extends SceneObject {
    
    /**
     * Constructs a leg object representing for the dog's leg.
     * @constructor
     * @param {String} name - name of the object
     * @param {number} x - The x-coordinate of the leg's position.
     * @param {number} y - The y-coordinate of the leg's position.
     * @param {number} z - The z-coordinate of the leg's position.
     * @param {number} ang - The initial angle of the leg (default is 0).
     */
    constructor(name, x, y, z, ang = 0) {
        super(name, x, y, z, ang);

        // Define leg material attributes
        this.diffuseColor = "#964B00";
        this.specularColor = "#964B00";
        this.shininess = 30;

        // Create a material for the leg
        this.material = new THREE.MeshPhongMaterial({
            color: this.diffuseColor,
            specular: this.specularColor,
            emissive: "#a86d22",
            shininess: this.shininess
        });
    }

    /**
     * Builds a detailed representation of a dog's leg.
     * @method
     */
    build() {

        // Create leg components
        const cylinderGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 32);
        const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const halfSphereGeometry = new THREE.SphereGeometry(0.2, 32, 32, Math.PI/2, Math.PI);

        // Leg meshes
        const thigh = new THREE.Mesh(cylinderGeometry, this.material);
        const knee = new THREE.Mesh(sphereGeometry, this.material);
        const calf = new THREE.Mesh(cylinderGeometry, this.material);
        const ankle = new THREE.Mesh(sphereGeometry, this.material);
        const foot = new THREE.Mesh(cylinderGeometry, this.material);
        const toe = new THREE.Mesh(halfSphereGeometry, this.material);
        ShadowHelper.setShadow(toe);
        ShadowHelper.setShadow(thigh);
        ShadowHelper.setShadow(knee);
        ShadowHelper.setShadow(calf);
        ShadowHelper.setShadow(ankle);
        ShadowHelper.setShadow(foot);

        // Position and add components to the leg object
        thigh.rotateZ(Math.PI/2);
        thigh.position.set(-0.5, 0.5, 0);
        knee.position.set(0, 0.5, 0);
        calf.rotateZ(Math.PI/15);
        calf.position.set(Math.tan(Math.PI/15) / 2, 0, 0);
        ankle.position.set(Math.tan(Math.PI/15), -0.5, 0);
        foot.rotateZ(Math.PI/2);
        foot.position.set(Math.tan(Math.PI/15) + 0.2, -0.5, 0);
        foot.scale.set(1, 0.4, 1);
        toe.position.set(2 * Math.tan(Math.PI/15) + 0.18, -0.5, 0);
        this.sceneObject.add(thigh, knee, calf, ankle, foot, toe);
    }
}

export { DogLeg };
