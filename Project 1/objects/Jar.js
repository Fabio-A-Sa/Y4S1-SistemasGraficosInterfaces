/**
 * @file Jar.js
 * @class Jar
 * @extends SceneObject
 * @desc Representation of a flower jar made using 2 nurbs surfaces and two circles for the bottom and to represent the dirt.
 */

import { SceneObject } from './SceneObject.js';
import { nurbsGenerator } from '../utils/NurbSurfaceUtils.js';
import * as THREE from 'three';
import { ShadowHelper } from '../utils/ShadowUtils.js';

/**
 * @class
 * @classdesc Representation of a jar made with nurbs surfaces.
 */
class Jar extends SceneObject {
    /**
     * Constructs a JAR object.
     * @constructor
     * @param {String} name - name of the object
     * @param {number} x - The x-coordinate of the jar's position.
     * @param {number} y - The y-coordinate of the jar's position.
     * @param {number} z - The z-coordinate of the jar's position.
     * @param {number} ang - The default orientation of the jar.
     */
    constructor(name, x, y, z, ang) {
        super(name, x, y, z, ang);

        // Material properties
        this.diffuseColor = "#ffffff"; // Green color for the jar
        this.specularColor = "#FFFFFF";
        this.shininess = 30;

        // Create the jar mesh
        this.build();
    }

    /**
     * Build the jar object.
     * @method
     */
    build() {
        let controlPoints1 = [
            // U = 0
            [
                [ -3, 0,  0, 1], // V = 0 
                [ -6, 4,  0, 1], // V = 1
                [ -1, 11, 0, 1],
                [ -5, 15, 0, 1]
            ],
            // U = 1
              [
                [ 0, 0,  3*2, 1], // V = 0
                [ 0, 4,  6*2, 1], // V = 1
                [ 0, 11, 1*2, 1],
                [ 0, 15, 5*2, 1]
            ],
            // U = 2
            [
                [ 3, 0,  0, 1], // V = 0 
                [ 6, 4,  0, 1], // V = 1
                [ 1, 11, 0, 1],
                [ 5, 15, 0, 1]
            ],
        ];

       // Create mirrored control points for controlPoints2
        let controlPoints2 = controlPoints1.map((row) => {
            return row.map((point) => {
                return [point[0], point[1], -point[2], point[3]];
            });
        });

        let orderU = 2;
        let orderV = 3;
        let numSamples = 30;

        const jarTexture = new THREE.TextureLoader().load('./textures/jar.jpg');
        let jarSurface1 = nurbsGenerator.createDoubleSidedNurbsSurfaces(0, 0, 0, controlPoints1, orderU, orderV, numSamples, numSamples, jarTexture);
        let jarSurface2 = nurbsGenerator.createDoubleSidedNurbsSurfaces(0, 0, 0, controlPoints2, orderU, orderV, numSamples, numSamples, jarTexture);

        // Create the bottom circle geometry
        const bottomCircleGeometry = new THREE.CircleGeometry(2.9, 32);
        const bottomCircleMaterial = new THREE.MeshPhongMaterial({ color: this.diffuseColor, map: jarTexture });

        // Create the dirt circle geometry
        const dirtTexture = new THREE.TextureLoader().load('./textures/dirt.jpg');
        const dirtCircleGeometry = new THREE.CircleGeometry(2.9, 32);
        const dirtCircleMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513, map: dirtTexture }); // Brown color

        // Position the circles
        const bottomCircle = new THREE.Mesh(bottomCircleGeometry, bottomCircleMaterial);
        ShadowHelper.setShadow(bottomCircle);
        bottomCircle.rotation.x = Math.PI/2;
        bottomCircle.position.set(0, 0, 0);

        const dirtCircle = new THREE.Mesh(dirtCircleGeometry, dirtCircleMaterial);
        ShadowHelper.setShadow(dirtCircle);
        dirtCircle.rotation.x = -Math.PI/2;
        dirtCircle.position.set(0, 11, 0);

        this.sceneObject.add(jarSurface1, jarSurface2, bottomCircle, dirtCircle);
    }
}

export { Jar };
