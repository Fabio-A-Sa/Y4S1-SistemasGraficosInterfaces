/**
 * @file DogHat.js
 * @class DogHat
 * @extends SceneObject
 * @desc Hat for the dog in class Dog.js
 */

import * as THREE from 'three';
import { SceneObject } from '../SceneObject.js';
import { ShadowHelper } from '../../utils/ShadowUtils.js';

/**
 * @class
 * @classdesc Hat object for the cartoon dog to wear.
 */
class DogHat extends SceneObject {
    
    /**
     * Constructs a hat object representing a hat worn by the dog.
     * @constructor
     * @param {String} name - name of the object
     * @param {number} x - The x-coordinate of the hat's position.
     * @param {number} y - The y-coordinate of the hat's position.
     * @param {number} z - The z-coordinate of the hat's position.
     * @param {number} ang - The initial angle of the hat (default is 0).
     */
    constructor(name, x, y, z, ang = 0) {
        super(name, x, y, z, ang);

        // Define material attributes for the hat
        this.diffuseColor = "#000000";
        this.specularColor = "#111111";
        this.shininess = 30;

        // Create materials with different properties for various hat components
        this.material = new THREE.MeshPhongMaterial({
            color: this.diffuseColor,
            specular: this.specularColor,
            emissive: "#444444",
            shininess: this.shininess
        });

        this.material2 = new THREE.MeshPhongMaterial({
            color: this.diffuseColor,
            specular: this.specularColor,
            emissive: "#222222",
            shininess: this.shininess
        });
    }

    /**
     * Builds a detailed representation of the dog's hat.
     * @method
     */
    build() {
        
        // Create the bottom shape for the hat
        const pringlesGeometry = new THREE.TorusGeometry(0.6, 0.2, 16, 32, Math.PI * 2);
        const pringlesMesh = new THREE.Mesh(pringlesGeometry, this.material);
        ShadowHelper.setShadow(pringlesMesh);
        pringlesMesh.rotation.x = Math.PI / 2;

        // Create the half-circle on top
        const halfCircleGeometry = new THREE.SphereGeometry(0.55, 32, 16, 0, Math.PI);
        const halfCircleMesh = new THREE.Mesh(halfCircleGeometry, this.material2);
        ShadowHelper.setShadow(halfCircleMesh);
        halfCircleMesh.rotation.x = -Math.PI / 2;

        // Create a vertical cylinder between torus and half-sphere
        const cylinderGeometry = new THREE.CylinderGeometry(0.55, 0.55, 0.3, 16);
        const cylinderMesh = new THREE.Mesh(cylinderGeometry, this.material2);
        ShadowHelper.setShadow(cylinderMesh);
        cylinderMesh.position.set(0, 0.25, 0); // Position between torus and half-sphere

        // Position the hat components
        pringlesMesh.position.set(0, 0, 0);
        halfCircleMesh.position.set(0, 0.35, 0);

        this.sceneObject.add(pringlesMesh, halfCircleMesh, cylinderMesh);
    }
}

export { DogHat };
