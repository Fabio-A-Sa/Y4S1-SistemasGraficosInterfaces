/**
 * @file DogArm.js
 * @class DogArm
 * @extends SceneObject
 * @desc Arm for the class Dog.js
 */

import * as THREE from 'three';
import { SceneObject } from '../SceneObject.js';
import { ShadowHelper } from '../../utils/ShadowUtils.js';

/**
 * @class
 * @classdesc Arm object for the cartoon dog.
 */
class DogArm extends SceneObject {
    
    /**
     * Constructs a arm object representing the dog's arm.
     * @constructor
     * @param {String} name - name of the object
     * @param {number} x - The x-coordinate of the arm's position.
     * @param {number} y - The y-coordinate of the arm's position.
     * @param {number} z - The z-coordinate of the arm's position.
     * @param {number} ang - The initial angle of the arm (default is 0).
     */
    constructor(name, x, y, z, ang = 0) {
        super(name, x, y, z, ang);

        // Define material attributes for the arm
        this.diffuseColor = "#964B00";
        this.specularColor = "#964B00";
        this.shininess = 30;

        // Create a material for the arm
        this.material = new THREE.MeshPhongMaterial({
            color: this.diffuseColor,
            specular: this.specularColor,
            emissive: "#a86d22",
            shininess: this.shininess
        });
    }

    /**
     * Builds a detailed representation of the dog's arm.
     * @method
    */
    build() {

        // Create individual components of the dog's arm
        const cylinderGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 32);
        const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const halfSphereGeometry = new THREE.SphereGeometry(0.2, 32, 32, Math.PI/2, Math.PI);

        // Arm meshes
        const shoulder = new THREE.Mesh(sphereGeometry, this.material);
        const upperArm = new THREE.Mesh(cylinderGeometry, this.material);
        const elbow = new THREE.Mesh(sphereGeometry, this.material);
        const forearm = new THREE.Mesh(cylinderGeometry, this.material);
        const hand = new THREE.Mesh(halfSphereGeometry, this.material);
        ShadowHelper.setShadow(shoulder);
        ShadowHelper.setShadow(upperArm);
        ShadowHelper.setShadow(elbow);
        ShadowHelper.setShadow(forearm);
        ShadowHelper.setShadow(hand);

        // Position and assemble the components to create the arm
        upperArm.rotateX(-Math.PI/12);
        upperArm.scale.set(1,2,1);
        upperArm.position.set(0,0.25,0);
        elbow.position.set(0,-5.95*Math.sin(Math.PI/12)*0.125,2.04*Math.tan(Math.PI/12)*0.2175);
        shoulder.position.set(0,5.95*Math.sin(Math.PI/12)*0.125+0.5,-2.04*Math.tan(Math.PI/12)*0.2175);

        forearm.rotateZ(Math.PI/2);
        forearm.rotateX(Math.PI/15);
        forearm.position.set(0.25,-0.25*(1-Math.sin(Math.PI/12)),0.25*Math.tan(Math.PI/12));
        hand.rotateY(Math.PI/15);
        hand.position.set(0.7-Math.sin(Math.PI/15),-0.25*(1-Math.sin(Math.PI/12)),0.08*Math.tan(Math.PI/15));

        // Add the arm components to the arm object
        this.sceneObject.add(shoulder, upperArm, elbow, forearm, hand);
    }
}

export { DogArm };
