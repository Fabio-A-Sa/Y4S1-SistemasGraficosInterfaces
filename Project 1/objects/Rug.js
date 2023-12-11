/**
 * @file Rug.js
 * @class Rug
 * @extends SceneObject
 * @desc Representation of a simple rug.
 */

import * as THREE from 'three';
import { SceneObject } from './SceneObject.js';
import { ShadowHelper } from '../utils/ShadowUtils.js';

/**
 * @class
 * @classdesc Representation of a rug as a flat box geometry.
 */
class Rug extends SceneObject {
    
    /**
     * Constructs the Rug object.
     * @constructor
     * @param {String} name - name of the object
     * @param {number} x - The x-coordinate of the rug's position.
     * @param {number} y - The y-coordinate of the rug's position.
     * @param {number} z - The z-coordinate of the rug's position.
     * @param {number} ang - The initial rotation of the rug.
     * @param {number} width - The width of the rug (default is 1).
     * @param {number} depth - The depth of the rug (default is 1).
     * @param {number} height - The height of the rug (default is 0.1).
     */
    constructor(name, x, y, z, ang) {
        super(name, x, y, z, ang);
        const rugTexture = new THREE.TextureLoader().load('./textures/redWool.jpg');
        rugTexture.wrapS = THREE.RepeatWrapping;
        rugTexture.wrapT = THREE.RepeatWrapping;
        rugTexture.repeat.set(4, 4);
        this.material = new THREE.MeshStandardMaterial({
            map: rugTexture,
            roughness: 1,
            metalness: 0,
        });
    }

    /**
     * Builds a rug as a flat box geometry.
     * @method
     */
    build() {
        const rugGeometry = new THREE.BoxGeometry(3, 0.1, 2);
        const rug = new THREE.Mesh(rugGeometry, this.material);
        ShadowHelper.setShadow(rug);

        this.sceneObject.add(rug);
    }
}

export { Rug };
