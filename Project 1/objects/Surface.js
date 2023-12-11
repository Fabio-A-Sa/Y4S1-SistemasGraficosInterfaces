/**
 * @file Surface.js
 * @class Surface
 * @extends SceneObject
 * @desc Representation of a simple sruface (can act as walls, floor, ceiling, etc).
 */

import * as THREE from 'three';
import { SceneObject } from './SceneObject.js';
import { ShadowHelper } from '../utils/ShadowUtils.js';

/**
 * @class
 * @classdesc Simple surface that can be used to build the scene place.
 */
class Surface extends SceneObject {

    /**
     * Constructs a simple surface.
     * @constructor
     * @param {String} name - name of the object
     * @param {number} x - The x-coordinate of the surface's position.
     * @param {number} y - The y-coordinate of the surface's position.
     * @param {number} z - The z-coordinate of the surface's position (default is 0).
     * @param {number} ang - The initial angle of the surface (default is 0).
     */
    constructor(name, x, y, z = 0, ang = 0) {
        // Call the constructor of the parent class 'Object'
        super(name, x, y, z, 0);

        // Set the initial rotation of the surface
        this.updateRotation(Math.PI/2, new THREE.Vector3(1, 0, 0));
        this.updateRotation(ang, new THREE.Vector3(0, 0, 1));

        // Define material properties for the surface
        this.diffuseColor = "#aaaaaa";
        this.specularColor = "#aaaaaa";
        this.shininess = 30;

        // Create a Phong material for the surface (default material)
        this.material = new THREE.MeshPhongMaterial({
            color: this.diffuseColor,
            specular: this.diffuseColor,
            emissive: "#aaaaaa",
            shininess: this.shininess
        });

        // Initialize the plane mesh as null
        this.planeMesh = null;
    }

    /**
     * Build the surface object.
     * @method
     */
    build() {

        // Create a Plane Mesh with basic material
        let plane = new THREE.PlaneGeometry(10, 5, 1, 1);
        this.planeMesh = new THREE.Mesh(plane, this.material);
        ShadowHelper.setShadow(this.planeMesh);

        // Set the rotation, position and shadows of the plane mesh
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = -0;
        ShadowHelper.setShadow(this.planeMesh);

        // Add the plane mesh to the object
        this.sceneObject.add(this.planeMesh);
    }

    /**
     * Update the material of the surface.
     * @method
     * @param {THREE.Material} newMaterial - The new material to apply to the surface.
     */
    updateMaterial(newMaterial) {
        this.material = newMaterial;
        this.planeMesh.material = newMaterial;
    }
}

export { Surface }
