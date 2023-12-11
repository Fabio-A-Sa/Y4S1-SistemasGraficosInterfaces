/**
 * @file DogMuzzle.js
 * @class DogMuzzle
 * @extends SceneObject
 * @desc Muzzle for the class Dog.js
 */

import * as THREE from 'three';
import { SceneObject } from '../SceneObject.js';
import { ShadowHelper } from '../../utils/ShadowUtils.js';

/**
 * @class
 * @classdesc Muzzle object for the cartoon dog.
 */
class DogMuzzle extends SceneObject {

    /**
     * Constructs the muzzle object for the dog.
     * @contructor
     * @param {String} name - name of the object
     * @param {number} x - The x-coordinate of the muzzle's position.
     * @param {number} y - The y-coordinate of the muzzle's position.
     * @param {number} z - The z-coordinate of the muzzle's position.
     * @param {number} ang - The initial angle of the muzzle (default is 0).
     */
    constructor(name, x, y, z, ang = 0) {
        super(name, x, y, z, ang);

        // Define muzzle material attributes
        this.diffuseColor = "#964B00";
        this.specularColor = "#964B00";
        this.shininess = 30;

        // Create muzzle materials
        this.material = new THREE.MeshPhongMaterial({
            color: this.diffuseColor,
            specular: this.specularColor,
            emissive: "#a86d22",
            shininess: this.shininess
        });

        this.material2 = new THREE.MeshPhongMaterial({
            color: this.diffuseColor,
            specular: this.specularColor,
            emissive: "#111111",
            shininess: this.shininess
        });
    }

    /**
     * Builds a detailed representation of a dog's muzzle.
     * @method
     */
    build() {
        
        // Create the muzzle-shaped geometry using spheres and a complete torus
        const muzzleGeometry = new THREE.Group();

        // Create the front sphere
        const topSphereGeometry = new THREE.SphereGeometry(0.25, 32, 32);
        const topSphereMesh = new THREE.Mesh(topSphereGeometry, this.material);
        ShadowHelper.setShadow(topSphereMesh);
        topSphereMesh.rotation.x = Math.PI / 2; // Horizontal orientation
        topSphereMesh.scale.set(1.3, 1, 1);
        topSphereMesh.position.set(0, 0, 0);

        // Create the back sphere
        const bottomSphereGeometry = new THREE.SphereGeometry(0.25, 32, 32);
        const bottomSphereMesh = new THREE.Mesh(bottomSphereGeometry, this.material);
        ShadowHelper.setShadow(bottomSphereMesh);
        bottomSphereMesh.position.set(0, 0.05,0.5); // Slightly closer to the torus
        bottomSphereMesh.scale.set(1.2, 1.05, 1);

        // Create a complete torus to connect the spheres
        const torusGeometry = new THREE.TorusGeometry(0.2, 0.05, 16, 32, Math.PI * 2);
        const torusMesh = new THREE.Mesh(torusGeometry, this.material);
        ShadowHelper.setShadow(torusMesh);
        torusMesh.position.set(0,0,0.25);
        torusMesh.scale.set(1.3, 1, 7);
        torusMesh.rotateX(-Math.PI/36);

        // Create the bottom sphere muzzle end
        const noseSphereGeometry = new THREE.SphereGeometry(0.15, 32, 32);
        const noseSphereMesh = new THREE.Mesh(noseSphereGeometry, this.material2);
        ShadowHelper.setShadow(noseSphereMesh);
        noseSphereMesh.position.set(0, 0.25, 0.7); // Slightly closer to the torus
        noseSphereMesh.scale.set(1, 1, 1);

        muzzleGeometry.add(topSphereMesh, bottomSphereMesh, torusMesh, noseSphereMesh);
        muzzleGeometry.position.set(0, 0, 0);
        this.sceneObject.add(muzzleGeometry);
    }
}

export { DogMuzzle };
