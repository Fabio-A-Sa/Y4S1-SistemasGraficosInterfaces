/**
 * @file Cake.js
 * @class Cake
 * @extends SceneObject
 * @desc Representation of a simple cake.
 */

import * as THREE from 'three';
import { SceneObject } from './SceneObject.js';
import { ShadowHelper } from '../utils/ShadowUtils.js';

/**
 * @class
 * @classdesc Representation of a cake, can be make with any angle size and with will fill the piece of cake (or whole).
 */
class Cake extends SceneObject {
    
    /**
     * Constructs the Cake object.
     * @constructor
     * @param {String} name - name of the object
     * @param {number} x - The x-coordinate of the cake's position.
     * @param {number} y - The y-coordinate of the cake's position.
     * @param {number} z - The z-coordinate of the cake's position.
     * @param {number} radius - The radius of the cake (default is 1).
     * @param {height} height - The height of the cake (default is 1).
     * @param {number} ang - The initial angle of the cake (default is 0).
     * @param {cakeAng} cakeAng = The final angle of the cake (default is pi*5/3)
     */
    constructor(name, x, y, z, radius = 1, height = 1, ang = 0, cakeAng = Math.PI * 5 / 3) {
        super(name, x, y, z, ang);

        this.radius = radius;
        this.height = height;
        this.updateScale(radius, 1, radius);
        this.cakeAng = cakeAng;

        // Delicious texture
        this.diffuseColor = "#FFA07A";
        this.specularColor = "#FFA07A";
        this.shininess = 3;
        const cakeTexture = new THREE.TextureLoader().load('./textures/cake.jpg');
        cakeTexture.wrapS = THREE.RepeatWrapping;
        cakeTexture.wrapT = THREE.RepeatWrapping;
        cakeTexture.repeat.set(5, 5);
        this.material = new THREE.MeshStandardMaterial({
            map: cakeTexture,
            roughness: 1,        
            metalness: 0, 
        })

        const cakeInsideTexture = new THREE.TextureLoader().load('./textures/cakeInside.jpg');
        this.material2 = new THREE.MeshStandardMaterial({
            map: cakeInsideTexture,
        })
    }

    /**
     * Builds a cake with a cylinder and two planes.
     * @method
     */
    build() {
        
        // Cake cilinder
        const cylinderGeometry = new THREE.CylinderGeometry(this.radius, this.radius, this.height, 32, 1, false, 0, this.cakeAng, false);
        const cake = new THREE.Mesh(cylinderGeometry, this.material);
        ShadowHelper.setShadow(cake);

        // Cake planes
        const planeGeometry = new THREE.PlaneGeometry(this.radius, this.height, 1, 1);
        const plane1 = new THREE.Mesh(planeGeometry, this.material2);
        ShadowHelper.setShadow(plane1);
        let plane1Angl = Math.PI/2 + this.cakeAng;
        plane1.rotateY(plane1Angl);
        plane1.position.x = Math.cos(Math.PI -plane1Angl) * this.radius/2;
        plane1.position.z = Math.sin(Math.PI - plane1Angl) * this.radius/2;
        const plane2 = new THREE.Mesh(planeGeometry, this.material2);
        ShadowHelper.setShadow(plane2);
        plane2.rotation.y = -Math.PI / 2;
        plane2.position.z = this.radius/2;

        this.sceneObject.add(cake, plane1, plane2);
    }
}

export { Cake };
