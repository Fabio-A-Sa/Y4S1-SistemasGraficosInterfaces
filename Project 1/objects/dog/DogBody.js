/**
 * @file DogBody.js
 * @class DogBody
 * @extends SceneObject
 * @desc Main body part for the class Dog.js
 */

import * as THREE from 'three';
import { SceneObject } from '../SceneObject.js';
import { ShadowHelper } from '../../utils/ShadowUtils.js';

/**
 * @class
 * @classdesc Main body part object for the cartoon dog.
 */
class DogBody extends SceneObject {
    
    /**
     * Constructs the main body object for the dog.
     * @constructor
     * @param {String} name - name of the object
     * @param {number} x - The x-coordinate of the body's position.
     * @param {number} y - The y-coordinate of the body's position.
     * @param {number} z - The z-coordinate of the body's position.
     * @param {number} ang - The initial angle of the body (default is 0).
     */
    constructor(name, x, y, z, ang = 0) {
        super(name, x, y, z, ang);

        // Define material attributes for the body
        this.diffuseColor = "#964B00";
        this.specularColor = "#964B00";
        this.shininess = 30;

        // Create a material for the body
        this.material = new THREE.MeshPhongMaterial({
            color: this.diffuseColor,
            specular: this.specularColor,
            emissive: "#a86d22",
            shininess: this.shininess
        });
    }

    /**
     * Builds a detailed representation of a dog's body, shaped like a peanut.
     * @method
     */
    build() {
        
        // Create the peanut-shaped geometry using spheres and a complete torus
        const peanutGeometry = new THREE.Group();

        // Create the top sphere (slightly smaller than the top one)
        const topSphereGeometry = new THREE.SphereGeometry(0.4, 32, 32);
        const topSphereMesh = new THREE.Mesh(topSphereGeometry, this.material);
        ShadowHelper.setShadow(topSphereMesh);
        topSphereMesh.position.set(0, 0.2, 0); // Slightly closer to the torus
        topSphereMesh.scale.set(1, 1.2, 1);

        // Create the bottom sphere
        const bottomSphereGeometry = new THREE.SphereGeometry(0.45, 32, 32);
        const bottomSphereMesh = new THREE.Mesh(bottomSphereGeometry, this.material);
        ShadowHelper.setShadow(bottomSphereMesh);
        bottomSphereMesh.position.set(0, -0.3, 0.1); // Slightly closer to the torus
        bottomSphereMesh.scale.set(1, 0.95, 1);

        // Create a complete torus to connect the spheres
        const torusGeometry = new THREE.TorusGeometry(0.27, 0.1, 16, 32, Math.PI * 2);
        const torusMesh = new THREE.Mesh(torusGeometry, this.material);
        ShadowHelper.setShadow(torusMesh);
        torusMesh.rotation.x = Math.PI / 2;
        torusMesh.scale.set(1.05, 1.05, 4);

        // Add all components to the peanutGeometry group
        peanutGeometry.add(topSphereMesh, bottomSphereMesh, torusMesh);

        // Position the peanut
        peanutGeometry.position.set(0, 0, 0);

        // Add the peanut to the object
        this.sceneObject.add(peanutGeometry);
    }
}

export { DogBody };
