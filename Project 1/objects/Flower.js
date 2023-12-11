/**
 * @file Flower.js
 * @class Flower
 * @extends SceneObject
 * @desc Representation of a flower using a curve for the stem, a circle for the disk and nurbs for the petals. The number of petals is customizable.
 */

import * as THREE from 'three';
import { SceneObject } from './SceneObject.js';
import { nurbsGenerator } from '../utils/NurbSurfaceUtils.js';
import { ShadowHelper } from '../utils/ShadowUtils.js';

/**
 * @class
 * @classdesc Representation of a flower with customizable number of petals.
 */
class Flower extends SceneObject {

    /**
     * Constructs an object representing a flower.
     * @constructor
     * @param {String} name - name of the object
     * @param {number} x - The x-coordinate of the flower's position.
     * @param {number} y - The y-coordinate of the flower's position.
     * @param {number} z - The z-coordinate of the flower's position.
     * @param {number} petalCount - number of petals the flower will have (default is 6)
     * @param {number} steamRadius - the radius and thickness of the stem
     * @param {number} steamHeight - the height of the stem 
     */
    constructor(name, x, y, z, petalRadius = 0.1, petalCount = 6, stemRadius = 0.02, stemHeight = 1) {
        super(name, x, y, z);

        this.petalRadius = petalRadius;
        this.petalCount = petalCount;
        this.stemRadius = stemRadius;
        this.stemHeight = stemHeight;
        this.petalColor = "#FF69B4";
        this.stemColor = "#00FF00";
        this.diskColor = "#FFFF00";

        // Material related attributes
        this.petalMaterial = new THREE.MeshPhongMaterial({
            color: this.petalColor,
            shininess: 100,
            side: THREE.DoubleSide
        });

        this.stemMaterial = new THREE.MeshPhongMaterial({
            color: this.stemColor,
            shininess: 100,
        });

        this.diskMaterial = new THREE.MeshPhongMaterial({
            color: this.diskColor,
            shininess: 100,
        });

        this.flowerTop = new THREE.Group();
    }

    /**
     * Build the flower object
     * @method
     */
    build() {
        this.createStem();
        this.createPetals();
        this.createDisk();

        this.flowerTop.position.set(0,0,-0.85*this.stemHeight);
        this.flowerTop.rotateX(Math.PI/3);
        this.sceneObject.add(this.flowerTop);
    }

    /**
     * Aux function to generate the path of the stem (predefined).
     * @method
     * @param {number} height - value for how long is the stem
     */
    generateStemPath(height) {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.2, height * 0.4, 0),
            new THREE.Vector3(0.05, height * 0.7, 0),
            new THREE.Vector3(0, height, 0),
        ]);
    
        return curve.getPoints(50);
    }
    
    /**
     * Aux function to create the actual object for the stem of the flower.
     * @method
     */
    createStem() {
        const stemRadius = this.stemRadius;
        const stemHeight = this.stemHeight;
        const stemPath = this.generateStemPath(stemHeight);
    
        const stemGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(stemPath), 50, stemRadius, 8, false);
        this.stem = new THREE.Mesh(stemGeometry, this.stemMaterial);
        ShadowHelper.setShadow(this.stem);
        this.stem.position.set(0,-this.stemHeight*0.5,0);
        this.sceneObject.add(this.stem);
    }
    
    /**
     * Aux function of the build to create the nurbs object for the petals and put them in place.
     * @method
     */
    createPetals() {

        const petalAngleIncrement = (Math.PI * 2) / this.petalCount;
        const lenghtPetal = Math.PI*this.stemRadius*100/this.petalCount;

        // Define control points for the NURBS surface
        let controlPoints = [
            // U = 0
            [
                // V = 0..1
                [0, 0, 0, 1],
                [-3*lenghtPetal, 6, 0, 1],
                [-2*lenghtPetal, 10, 0, 1],
                [-0.5*lenghtPetal, 12, 0, 1],
                [0, 14, 0, 1],
            ],
            // U = 1
            [
                // V = 0..1
                [0, 0, 0, 1],
                [0, 6, -0.5, 1],
                [0, 10, -1, 1],
                [0, 12, -0.5, 1],
                [0, 14, 0, 1],
            ],
            // U = 2
            [
                // V = 0..1
                [0, 0, 0, 1],
                [3*lenghtPetal, 6, 0, 1],
                [2*lenghtPetal, 10, 0, 1],
                [0.5*lenghtPetal, 12, 0, 1],
                [0, 14, 0, 1],
            ]
        ];

        let orderU = 2;
        let orderV = 2;

        for (let i = 0; i < this.petalCount; i++) {

            let petal = nurbsGenerator.createDoubleSidedNurbsSurfaces(0, 0, 0, controlPoints, orderU, orderV);
            // Position each petal
            const angle = i * petalAngleIncrement;
            const petalX = Math.cos(angle) * (this.petalRadius * -6);
            const petalZ = Math.sin(angle) * (this.petalRadius * -6);
            const petalScale = 0.05;

            // Change material
            petal.material = this.petalMaterial;

            // Scale the petal down
            petal.scale.set(petalScale, petalScale, petalScale);

            // Position as before
            petal.position.set(petalX, this.stemHeight, petalZ);

            // Calculate the rotation angle to point the petal outward
            const petalRotationAngle = -angle - Math.PI/2;

            // Set the rotation to be horizontal and point the petal outward
            petal.rotation.set(-Math.PI / 2, 0, petalRotationAngle);

            this.flowerTop.add(petal);
        }
    }

    /**
     * Aux function of the build function to create the disk part of the flower
     * @method
     */
    createDisk() {
        // Create a yellow sphere for the top of the stem with diminished height scale
        const diskGeometry = new THREE.SphereGeometry(this.stemRadius * 7, 32, 32);
        diskGeometry.scale(1, 0.3, 1);
        const disk = new THREE.Mesh(diskGeometry, this.diskMaterial);
        ShadowHelper.setShadow(disk);
        
        // Position the disk on top of the stem
        disk.position.set(0, this.stemHeight, 0);
        
        this.flowerTop.add(disk);
    }
}

export { Flower };
