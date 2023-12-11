/**
 * @file CinemaLight.js
 * @class CinemaLight
 * @extends SceneObject
 * @desc Representation of a spolight object to shine the spotlight light on the cake.
 */

import * as THREE from 'three';
import { DoubleSide } from 'three';
import { SceneObject } from './SceneObject.js';
import { ShadowHelper } from '../utils/ShadowUtils.js';

/**
 * @class
 * @classdesc Representation of a spolight object with a spolight light that comes out of it.
 */
class CinemaLight extends SceneObject {

    /**
     * Constructs an object representing a spotlight.
     * @constructor
     * @param {String} name - name of the object
     * @param {number} x - The x-coordinate of the cinema light's position.
     * @param {number} y - The y-coordinate of the cinema light's position.
     * @param {number} z - The z-coordinate of the cinema light's position.
     * @param {number} radius - The radius of the cinema light (default is 0.5) - this refers to the angle of how open of close is the light.
     * @param {number} ang - The initial angle of the cinema light (default is 0).
     */
    constructor(name, x, y, z, radius = 0.5, ang = 0) {
        super(name, x, y, z, ang);

        // Set the radius of the cinema light and update its scale
        this.radius = radius;
        this.updateScale(this.radius, 1.15, this.radius);

        // Define material properties for the cinema light
        this.diffuseColor = "#222222";
        this.specularColor = "#222222";
        this.shininess = 30;
        this.intensity = 60;

        //add spotlight to scene
        this.spotlight = new THREE.SpotLight(0xffff00);
        this.spotlight.intensity = this.intensity;
        this.spotlight.distance = 500;
        this.spotlight.angle = 0.1;
        this.spotlight.name = "illumination_light";
        this.spotlight.position.y = 2;
        ShadowHelper.setShadow(this.spotlight);
        ShadowHelper.setLightAttributes(this.spotlight);

        // Create a spotlight target (a simple object to use as the target)
        this.lightTarget = new THREE.Object3D();
        this.spotlight.target = this.lightTarget;

        // Link the spotlight's position and target's position to the object's position
        this.spotlight.position.set(0, 0, 0);
        this.spotlight.target.position.set(0, 2, 0);

        // Create a Phong material for the cinema light
        this.material = new THREE.MeshPhongMaterial({
            color: this.diffuseColor,
            specular: this.specularColor,
            emissive: "#222222",
            shininess: this.shininess
        });

        // Create another material for the cinema light border
        this.material2 = new THREE.MeshPhongMaterial({
            color: this.diffuseColor,
            specular: this.specularColor,
            emissive: "#222222",
            shininess: this.shininess
        });

        // Set the inner radius of the cinema light border
        this.innerRadius = radius * 0.85;
    }

    /**
     * Build the cinema light object.
     * @method
     */
    build() {

        // Create the base of the cinema light
        const cylinderGeometry = new THREE.CylinderGeometry(this.radius, this.radius, 0.5, 32, 1, false, 0, 2 * Math.PI, false, DoubleSide);
        const lightBody = new THREE.Mesh(cylinderGeometry, this.material);
        ShadowHelper.setShadow(lightBody);
    
        // Define the height of the cinema light border
        let height = 0.2;
    
        // Create a shape for the outer and inner cylinders
        const outerShape = new THREE.Shape();
        outerShape.moveTo(this.radius*1.05, 0);
        outerShape.absellipse(0, 0, this.radius*1.05, this.radius*1.05, 0, Math.PI * 2, false);
        const innerShape = new THREE.Shape();
        innerShape.moveTo(this.innerRadius*1.05, 0);
        innerShape.absellipse(0, 0, this.innerRadius*1.05, this.innerRadius*1.05, 0, Math.PI * 2, false);
        outerShape.holes.push(innerShape);
    
        // Extrude the shape to create the cinema light border geometry
        const geometry = new THREE.ExtrudeGeometry(outerShape, {
            depth: height,
            bevelEnabled: false,
            steps: 1,
            depth: height,
            curveSegments: 32,
        });
    
        // Create the cinema light border mesh
        const lightBorder = new THREE.Mesh(geometry, this.material2);
        ShadowHelper.setShadow(lightBorder);
        lightBorder.rotation.x = Math.PI / 2;
        lightBorder.position.y = 0.45;
    
        // Create a yellow sphere
        const sphereGeometry = new THREE.SphereGeometry(this.innerRadius, 32, 32, 0, Math.PI);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const yellowSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        ShadowHelper.setShadow(yellowSphere, true, false);
        yellowSphere.rotateX(-Math.PI/2);
    
        const armGeometry = new THREE.CylinderGeometry(this.radius*0.5, this.radius*0.2, this.height, 32);
        const armMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
        const spotlightArm = new THREE.Mesh(armGeometry, armMaterial);
        ShadowHelper.setShadow(spotlightArm);
        spotlightArm.rotateX(Math.PI/1.5);
        spotlightArm.position.set(0, 0, 0.85); 

        // Link the spotlight's rotation to the object's rotation
        this.spotlight.rotation.copy(this.sceneObject.rotation);

        // Add all components to the object
        this.sceneObject.add(lightBody, lightBorder, yellowSphere, spotlightArm, this.spotlight, this.lightTarget);
    }

    updateTargetPosition(x,y,z) {
        this.lightTarget.position.set(x,y,z);
    }
}

export { CinemaLight }
