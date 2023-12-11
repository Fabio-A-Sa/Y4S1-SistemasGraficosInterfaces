/**
 * @file Newspaper.js
 * @class Newpaper
 * @extends SceneObject
 * @desc Representation of a newspaper made with two nurbs object (each object has a half-cane format).
 */

import * as THREE from 'three';
import { SceneObject } from './SceneObject.js';
import { nurbsGenerator } from '../utils/NurbSurfaceUtils.js';

/**
 * @class
 * @classdesc Representation of a simple newspaper.
 */
class Newspaper extends SceneObject {

    /**
     * Constructs a Newspaper object.
     * @cosntruct
     * @param {String} name - name of the object
     * @param {number} x - The x-coordinate of the newspaper's position.
     * @param {number} y - The y-coordinate of the newspaper's position.
     * @param {number} z - The z-coordinate of the newspaper's position.
     * @param {number} ang - The initial angle of the newspaper (default is 0).
     * 
     * @todo add the default properties to the constructor
     */
    constructor(name, x, y, z, ang = 0) {
        super(name, x, y, z,ang);

        // Material properties
        this.diffuseColor = "#FFFFFF";
        this.specularColor = "#FFFFFF";
        this.shininess = 30;

        // Create the newspaper mesh
        this.build();
    }

    /**
     * Build the newspaper object.
     * @method
     */
    build() {

        let controlPoints =
            // U = 0..2
            [
                [ // V = 0..1;
                    [ -1.5, -1.5, 0.0, 1 ],
                    [ -1.5,  1.5, 0.0, 1 ]
                ],
                [ // V = 0..1
                    [ 0, -1.5, 3.0, 1 ],
                    [ 0,  1.5, 3.0, 1 ]
                ],
                [ // V = 0..1
                    [ 1.5, -1.5, 0.0, 1 ],
                    [ 1.5,  1.5, 0.0, 10 ]
                ]
            ];


        let orderU = 2;
        let orderV = 1;

        const side1Texture = new THREE.TextureLoader().load('./textures/newspaper1.jpg');
        const side2Texture = new THREE.TextureLoader().load('./textures/newspaper2.jpg');
        let side1 = nurbsGenerator.createDoubleSidedNurbsSurfaces(0,0,0, controlPoints, orderU, orderV, 10, 10, side1Texture);
        let side2 = nurbsGenerator.createDoubleSidedNurbsSurfaces(3,0,0, controlPoints, orderU, orderV, 10, 10, side2Texture);
        this.sceneObject.add(side1, side2);
    }
}

export { Newspaper };
