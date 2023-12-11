/**
 * @file Spring.js
 * @class Spring
 * @extends SceneObject
 * @desc Representation of a spring made using curves and tube geometry.
 */

import * as THREE from 'three';
import { SceneObject } from './SceneObject.js';
import { ShadowHelper } from '../utils/ShadowUtils.js';

/**
 * @class
 * @classdesc Representation of spring made with curves and a tube geometry.
 */
class Spring extends SceneObject {
    /**
     * Constructs the Spring object.
     * @constructor
     * @param {String} name - name of the object
     * @param {number} x - The x-coordinate of the spring's position.
     * @param {number} y - The y-coordinate of the spring's position.
     * @param {number} z - The z-coordinate of the spring's position.
     * @param {number} radius - The radius of the spring (default is 0.02).
     * @param {number} height - The height of the spring (default is 0.5).
     * @param {number} numCoils - The number of coils in the spring (default is 100).
     * @param {number} coilRadius - The radius of the coil (default is 0.1).
     */
    constructor(name, x, y, z, radius = 0.02, height = 0.5, numCoils = 100, coilRadius = 0.1) {
        super(name, x, y, z);
        this.radius = radius;
        this.height = height;
        this.numCoils = numCoils;
        this.coilRadius = coilRadius;

        // Material related attributes
        this.color = "#C0C0C0"; // Silver color
        this.shininess = 100; // Adjust the shininess as needed
        this.material = new THREE.MeshPhongMaterial({
            color: this.color,
            specular: "#FFFFFF", // White specular highlight for metallic look
            emissive: "#000000", // No emissive color
            shininess: this.shininess
        });
    }

    /**
     * Builds a spring using Catmull-Rom curve and TubeGeometry.
     * @method
     */
    build() {
        const path = this.generatePath();
        const curve = new THREE.CatmullRomCurve3(path, false, 'centripetal');
        const tubeGeometry = new THREE.TubeGeometry(curve, 100, this.coilRadius, 8, false);

        // Create the spring mesh
        const spring = new THREE.Mesh(tubeGeometry, this.material)
        ShadowHelper.setShadow(spring);

        // Create and add caps to the beginning and end
        const capGeometry = new THREE.SphereGeometry(this.coilRadius, 10, 10);
        const cap1 = new THREE.Mesh(capGeometry, this.material);
        ShadowHelper.setShadow(cap1);
        const cap2 = new THREE.Mesh(capGeometry, this.material);
        ShadowHelper.setShadow(cap2);

        // Position caps at the beginning and end of the path
        cap1.position.copy(path[0]);
        cap2.position.copy(path[path.length - 1]);

        // Add caps to the spring object
        spring.add(cap1);
        spring.add(cap2);

        this.sceneObject.add(spring);
    }

    /**
     * Generates a path for the spring using a series of points.
     * Modify this function to customize the spring shape.
     * @method
     * @return {List: THREE.Vector3} - returns a list of points to generathe the catmull curve used for the spring spyral.
     */
    generatePath() {
        const path = [];
        for (let i = 0; i < this.numCoils * 2; i++) {
            const angle = (i / this.numCoils) * Math.PI * 2;
            const x = Math.cos(angle) * (this.radius + this.coilRadius);
            const y = i * (this.height / (this.numCoils * 2));
            const z = Math.sin(angle) * (this.radius + this.coilRadius);
            path.push(new THREE.Vector3(x, y, z));
        }
        return path;
    }
}

export { Spring };
