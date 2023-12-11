/**
 * @file Plate.js
 * @class Plate
 * @extends SceneObject
 * @desc Representation of a simple plate consisting of a bottom and a raised ring.
 */

import * as THREE from 'three';
import { DoubleSide } from 'three';
import { SceneObject } from './SceneObject.js';
import { ShadowHelper } from '../utils/ShadowUtils.js';

/**
 * @class
 * @classdesc Representation of a simple plate.
 */
class Plate extends SceneObject {

    /**
     * Constructs a simple object representing a plate.
     * @constructor
     * @param {String} name - name of the object
     * @param {number} x - The x-coordinate of the plate's position.
     * @param {number} y - The y-coordinate of the plate's position.
     * @param {number} z - The z-coordinate of the plate's position.
     * @param {number} radius - The radius of the plate (default is 0.5).
     * @param {number} ang - The initial angle of the plate (default is 0).
     */
    constructor(name, x, y, z, radius = 0.5, ang = 0) {
        // Call the constructor of the parent class 'Object'
        super(name, x, y, z, ang);

        // Set the radius of the plate and update its scale
        this.radius = radius;
        this.updateScale(this.radius, 1, this.radius);

        // Define material properties for the plate
        this.diffuseColor = "#ffffff";
        this.specularColor = "#ffffff";
        this.shininess = 30;

        // Create a Phong material for the plate
        this.material = new THREE.MeshPhongMaterial({
            color: this.diffuseColor,
            specular: this.specularColor,
            shininess: this.shininess
        });

        // Create another material for the plate border
        this.material2 = new THREE.MeshPhongMaterial({
            color: this.diffuseColor,
            specular: this.specularColor,
            emissive: "#ff0000",
            shininess: this.shininess
        });

        // Set the inner radius of the plate border
        this.innerRadius = radius * 0.85;
    }

    /**
     * Build the plate object.
     * @method
     */
    build() {
        
        // Create the base of the plate
        const cylinderGeometry = new THREE.CylinderGeometry(this.radius, this.radius, 0.005, 32, 1, false, 0, 2 * Math.PI, false, DoubleSide);
        const plateBase = new THREE.Mesh(cylinderGeometry, this.material);
        ShadowHelper.setShadow(plateBase);

        // Define the height of the plate border
        let height = 0.01;

        // Create a shape for the outer and inner cylinders
        const outerShape = new THREE.Shape();
        outerShape.moveTo(this.radius, 0);
        outerShape.absellipse(0, 0, this.radius, this.radius, 0, Math.PI * 2, false);
        const innerShape = new THREE.Shape();
        innerShape.moveTo(this.innerRadius, 0);
        innerShape.absellipse(0, 0, this.innerRadius, this.innerRadius, 0, Math.PI * 2, false);
        outerShape.holes.push(innerShape);

        // Extrude the shape to create the plate border geometry
        const geometry = new THREE.ExtrudeGeometry(outerShape, {
            depth: height,
            bevelEnabled: false,
            steps: 1,
            depth: height,
            curveSegments: 32,
        });

        // Create the plate border mesh
        const plateBorder = new THREE.Mesh(geometry, this.material2);
        ShadowHelper.setShadow(plateBorder);
        plateBorder.rotation.x = Math.PI / 2;
        plateBorder.position.y = 0.01;

        // Add the plate base and plate border to the object
        this.sceneObject.add(plateBase, plateBorder);
    }
}

export { Plate }
