/**
 * @file CarStructure.js
 * @class CarStructure
 * @extends SceneObject
 * @desc Drawing of a bettle car made using curves.
 */

import * as THREE from 'three';
import { SceneObject } from './SceneObject.js';
import { curveGenerator } from '../utils/CurveUtils.js';

/**
 * @class
 * @classdesc Simple bettle car 2d "drawing" amde using bezier curves.
 */
class CarStructure extends SceneObject {
    
    /**
     * Draw the curved lines needed for the car.
     * @constructor
     * @param {String} name - name of the object
     * @param {number} x - The x-coordinate of the car's position.
     * @param {number} y - The y-coordinate of the car's position.
     * @param {number} z - The z-coordinate of the car's position.
     * @param {number} ang - The initial angle of the car (default is 0).
     */
    constructor(name, x, y, z, ang = 0) {
        super(name, x, y, z, ang);

        // Material related attributes
        this.diffuseColor = "#FFA07A";
        this.specularColor = "#FFA07A";
        this.shininess = 30;
        this.material = new THREE.MeshPhongMaterial({
            color: this.diffuseColor,
            specular: this.specularColor,
            emissive: "#FFA07A",
            shininess: this.shininess
        });
    }

    /**
     * Builds the bettle car.
     * @method
     */
    build() {

        let points = [
            [
                new THREE.Vector3(0,0 ,0),
                new THREE.Vector3(0,5,0),
                new THREE.Vector3(6,5,0),
                new THREE.Vector3(6,0,0),
            ],
            [
                new THREE.Vector3(0,0,0),
                new THREE.Vector3(0,8,0),
                new THREE.Vector3(8,8,0),
            ],
            [
                new THREE.Vector3(8,8,0),
                new THREE.Vector3(12,8,0),
                new THREE.Vector3(12,5,0),
            ],
            [
                new THREE.Vector3(12,5,0),
                new THREE.Vector3(16,5,0),
                new THREE.Vector3(16,0,0),
            ]
        ];

        let numberOfSamples = 20;

        let wheel1 = curveGenerator.cubicBezierCurve(0,0,0, points[0], numberOfSamples);
        let wheel2 = curveGenerator.cubicBezierCurve(10,0,0, points[0], numberOfSamples);
        let carBody1 = curveGenerator.quadraticBezierCurve(0,0,0,points[1], numberOfSamples);
        let carBody2 = curveGenerator.quadraticBezierCurve(0,0,0, points[2], numberOfSamples);
        let carHood = curveGenerator.quadraticBezierCurve(0,0,0,points[3], numberOfSamples);
        
        this.sceneObject.add(wheel1, carBody1, carBody2, carHood, wheel2);
    }
}

export { CarStructure };
