/**
 * @file Cartoonfire.js
 * @class CartoonFire
 * @extends SceneObject
 * @desc Drawing of a cartoon fire to recreate the "this is fine" meme.
 */

import * as THREE from 'three';
import { SceneObject } from './SceneObject.js';
import { ShadowHelper } from '../utils/ShadowUtils.js';

/**
 * @class
 * @classdesc Simple 2d object of a cartoonish fire made using lines and bezier curves.
 */
class CartoonFire extends SceneObject {

    /**
     * Constructs a CartoonFire object representing a cartoon-style fire.
     * @constructor
     * @param {String} name - name of the object
     * @param {number} x - The x-coordinate of the fire's position.
     * @param {number} y - The y-coordinate of the fire's position.
     * @param {number} z - The z-coordinate of the fire's position.
     * @param {number} ang - The initial angle of the fire (default is 0).
     */
    constructor(name, x, y, z, ang = 0) {
        super(name, x, y, z, ang);

        // Fire-related attributes
        this.diffuseColor = "#FF4500";
        this.intensity = 1;
        
        // Material for the cartoon-style fire with double-sided rendering
        this.material = new THREE.MeshBasicMaterial({ color: this.diffuseColor, side: THREE.DoubleSide });

        this.pointlight = new THREE.PointLight(0xffffaa, 0.1, 6, 6);
        this.pointlight.intensity = this.intensity;
        ShadowHelper.setShadow(this.pointlight);
        ShadowHelper.setLightAttributes(this.pointlight);
    }

    /**
     * Builds a cartoon-style fire using a custom shape.
     * @method
     */
    build() {
        
        // Create the custom shape for the cartoon-style fire
        this.fireShape = new THREE.Shape();
        this.fireShape.moveTo(0, 0); // Start at the bottom center
        this.fireShape.lineTo(-0.25, 0.2); // Move up to create the first mountain
        this.fireShape.bezierCurveTo(0.1, 1, 0.3, 1.5, 0.5, 4); // Create a bezier curve for the valley
        this.fireShape.bezierCurveTo(0.7, 3.5, 1, 3.5, 1.5, 6); // Create a bezier curve for the second mountain
        this.fireShape.bezierCurveTo(2, 5.5, 2.5, 7, 3, 10); // Create a bezier curve for the tallest mountain (center)
        this.fireShape.bezierCurveTo(4, 7.5, 4.5, 7.5, 5, 5.7); // Create a bezier curve for the third mountain
        this.fireShape.bezierCurveTo(5.5, 7, 6, 7, 6, 9); // Create a bezier curve for the valley
        this.fireShape.bezierCurveTo(6, 7, 6, 7, 6, 9); // Create a bezier curve for the third mountain
        this.fireShape.bezierCurveTo(6.2, 8, 6.5, 8, 6.8, 11); // Create an additional bezier curve
        this.fireShape.bezierCurveTo(7, 9.5, 7.5, 9.5, 7.8, 8.5); // Create another bezier curve
        this.fireShape.bezierCurveTo(8.2, 7, 8.5, 6, 8.8, 5); // Create another bezier curve
        this.fireShape.bezierCurveTo(9, 4, 9.2, 3, 9.5, 2); // Create another bezier curve
        this.fireShape.lineTo(9.5, 2); // Create a flat top
        this.fireShape.bezierCurveTo(10.5, 7, 9.5, 0.5, 11, 0); // Create a concave mountain with a pointy peak
        this.fireShape.lineTo(0, 0); // Create a flat bottom

        // Create geometry and mesh using the custom shape
        const geometry = new THREE.ShapeGeometry(this.fireShape);
        this.fireMesh = new THREE.Mesh(geometry, this.material);
        this.fireMesh.position.set(0, 0, 0);
        ShadowHelper.setShadow(this.fireMesh);

        // Create dummy object3d for the light
        this.lightObject = new THREE.Object3D();

        // Set light position
        this.pointlight.position.set(6,2,0);
        this.lightObject.add(this.pointlight)

        // Add the fire mesh to the object
        this.sceneObject.add(this.fireMesh, this.lightObject);
    }
}

export { CartoonFire };
