/**
 * @file Dog.js
 * @class Dog
 * @extends SceneObject
 * @desc Represents a detailed 3D model of a dog.
 */

import * as THREE from 'three';
import { SceneObject } from '../SceneObject.js';
import { DogBody } from './DogBody.js';
import { DogLeg } from './DogLeg.js';
import { DogArm } from './DogArm.js';
import { DogMuzzle } from './DogMuzzle.js';
import { DogHat } from './DogHat.js';

/**
 * @class
 * @classdesc Represents a detailed 3D model of a cartoon dog.
 */
class Dog extends SceneObject {

    /**
     * Constructs a Dog object.
     * @constructor
     * @param {String} name - name of the object
     * @param {number} x - The x-coordinate of the dog's position.
     * @param {number} y - The y-coordinate of the dog's position.
     * @param {number} z - The z-coordinate of the dog's position.
     * @param {number} ang - The initial angle of the dog (default is 0).
     */
    constructor(name, x, y, z, ang = 0) {
        super(name, x, y, z, ang);

        /**
         * The diffuse color of the dog's body parts.
         * @member {string}
         */
        this.diffuseColor = "#964B00";

        /**
         * The specular color of the dog's body parts.
         * @member {string}
         */
        this.specularColor = "#964B00";

        /**
         * The shininess of the dog's body parts.
         * @member {number}
         */
        this.shininess = 30;

        /**
         * Material for the dog's body parts.
         * @member {THREE.MeshPhongMaterial}
         */
        this.material2 = new THREE.MeshPhongMaterial({
            color: this.diffuseColor,
            specular: this.specularColor,
            emissive: "#ffffff",
            shininess: this.shininess
        });

        /**
         * Material for the dog's body parts.
         * @member {THREE.MeshPhongMaterial}
         */
        this.material3 = new THREE.MeshPhongMaterial({
            color: this.diffuseColor,
            specular: this.specularColor,
            emissive: "#111111",
            shininess: this.shininess
        });

        // Create a material for tthe doo's eye
        const eyeTexture = new THREE.TextureLoader().load('./textures/eye.jpg');
        this.eyeMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,   
            map: eyeTexture, 
            roughness: 0.6,        
            metalness: 0.2,        
            normalScale: new THREE.Vector2(1, 1),
        });
    }

    /**
     * Builds a detailed representation of a dog.
     * @method
     */
    build() {
        
        // Create and add the dog's body
        const body = new DogBody(undefined,0, 0, 0);
        body.build();
        this.sceneObject.add(body.sceneObject);

        // Create and add the dog's legs
        const leftLeg = new DogLeg(undefined, -0.25, -0.75, 0.6);
        leftLeg.updateRotation(-Math.PI/2, new THREE.Vector3(0,1,0));
        leftLeg.updateScale(0.4, 0.4, 0.4);
        leftLeg.build();
        this.sceneObject.add(leftLeg.sceneObject);

        const rightLeg = new DogLeg(undefined, 0.25, -0.75, 0.6);
        rightLeg.updateRotation(-Math.PI/2, new THREE.Vector3(0,1,0));
        rightLeg.updateScale(0.4, 0.4, 0.4);
        rightLeg.build();
        this.sceneObject.add(rightLeg.sceneObject);

        // Create and add the dog's arms
        const leftArm = new DogArm(undefined, -0.45, -0.2, 0.2);
        leftArm.updateRotation(-Math.PI/2, new THREE.Vector3(0,1,0));
        leftArm.updateScale(0.4, 0.4, 0.4);
        leftArm.updateRotation(-Math.PI/10, new THREE.Vector3(1,0,0));
        leftArm.updateAllRotation(Math.PI/3, new THREE.Vector3(0,0,1));
        leftArm.updateAllRotation(-Math.PI/4, new THREE.Vector3(0,1,0));
        leftArm.build();
        this.sceneObject.add(leftArm.sceneObject);

        const rightArm = new DogArm(undefined, 0.55, -0.3, 0);
        rightArm.updateRotation(-Math.PI/2, new THREE.Vector3(0,1,0));
        rightArm.updateScale(0.4, 0.4, -0.4);
        rightArm.updateRotation(Math.PI/5, new THREE.Vector3(1,0,0));
        rightArm.build();
        this.sceneObject.add(rightArm.sceneObject);

        // Create and add the dog's muzzle
        const muzzle = new DogMuzzle(undefined, 0, 0.25, 0.4);
        muzzle.updateScale(0.6, 0.6, 0.6);
        muzzle.build();
        this.sceneObject.add(muzzle.sceneObject);

        // Create and add the dog's hat
        const hat = new DogHat(undefined, 0, 0.6, -0.05);
        hat.updateScale(0.4, 0.4, 0.4);
        hat.updateRotation(-Math.PI/30, new THREE.Vector3(1,0,0));
        hat.build();
        this.sceneObject.add(hat.sceneObject);

        // Create and add the dog's eyes
        const leftEyeGeometry = new THREE.SphereGeometry(0.13, 32, 32);
        const leftEyeMesh = new THREE.Mesh(leftEyeGeometry, this.eyeMaterial);
        leftEyeMesh.position.set(-0.17, 0.45, 0.3);
        leftEyeMesh.rotation.y = -Math.PI/1.3;
        leftEyeMesh.rotation.z = -Math.PI/10;
        this.sceneObject.add(leftEyeMesh);

        const rightEyeGeometry = new THREE.SphereGeometry(0.13, 32, 32);
        const rightEyeMesh = new THREE.Mesh(rightEyeGeometry, this.eyeMaterial);
        rightEyeMesh.position.set(0.17, 0.45, 0.3);
        rightEyeMesh.rotation.y = -Math.PI/1.3;
        rightEyeMesh.rotation.z = -Math.PI/10;
        this.sceneObject.add(rightEyeMesh);

        // Create and add the dog's ears
        const leftEarGeometry = new THREE.SphereGeometry(0.05, 32, 32);
        const leftEarMesh = new THREE.Mesh(leftEarGeometry, this.material3);
        leftEarMesh.scale.set(1, 5, 3);
        leftEarMesh.position.set(-0.35, 0.35, 0);
        leftEarMesh.rotateZ(-Math.PI/6);
        this.sceneObject.add(leftEarMesh);

        const rightEarGeometry = new THREE.SphereGeometry(0.05, 32, 32);
        const rightEarMesh = new THREE.Mesh(rightEarGeometry, this.material3);
        rightEarMesh.scale.set(-1, 5, 3);
        rightEarMesh.position.set(0.35, 0.35, 0);
        rightEarMesh.rotateZ(Math.PI/6);
        this.sceneObject.add(rightEarMesh);
    }
}

export { Dog };
