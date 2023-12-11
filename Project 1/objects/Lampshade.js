/**
 * @file Lampshade.js
 * @class Lampshade
 * @extends SceneObject
 * @desc Representation of a simple lampshade.
 */

import * as THREE from 'three';
import { SceneObject } from './SceneObject.js';
import { ShadowHelper } from '../utils/ShadowUtils.js';

/**
 * @class
 * @classdesc Representation of a lampshade with a light source and a rod.
 */
class Lampshade extends SceneObject {

    /**
     * Constructs a Lampshade object representing a lampshade.
     * @constructor
     * @param {String} name - name of the object
     * @param {number} x - The x-coordinate of the lampshade's position.
     * @param {number} y - The y-coordinate of the lampshade's position.
     * @param {number} z - The z-coordinate of the lampshade's position.
     * @param {number} radius - The radius of the lampshade (default is 1).
     * @param {number} ang - The initial angle of the lampshade (default is 0).
     */
    constructor(name, x, y, z, radius = 1, ang = 0) {
        super(name, x, y, z, ang);
        this.updateScale(radius, 1, radius);

        // Lampshade material attributes
        this.diffuseColor = "#ffffff";
        this.specularColor = "#ffffff";
        this.intensity = 10;

        // Material for the lampshade
        this.lampshadeMaterial = new THREE.MeshPhongMaterial({
            color: this.diffuseColor,
            specular: this.specularColor,
            shininess: 30
        });

        // Material for the light source
        this.decorationMaterial = new THREE.MeshPhongMaterial({
            color: "#ffff00",
            specular: "#ffff00",
            shininess: 30
        });

        // Material for the rod
        this.rodMaterial = new THREE.MeshPhongMaterial({
            color: "#888888",
            specular: "#888888",
            shininess: 30
        });

        this.spotlight = new THREE.SpotLight(0xffffaa);
        this.spotlight.intensity = this.intensity;
        this.spotlight.distance = 500;
        this.spotlight.angle = Math.PI/4;
        this.spotlight.penumbra = 0.3;
        this.spotlight.position.y = 2;
        ShadowHelper.setShadow(this.spotlight);
        ShadowHelper.setLightAttributes(this.spotlight);
    }

    /**
     * Builds a detailed representation of a lampshade, including the lampshade body, light source, and rod.
     * @method
     */
    build() {
        // Create the base of the lampshade
        const baseGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 32);
        const base = new THREE.Mesh(baseGeometry, this.lampshadeMaterial);
        ShadowHelper.setShadow(base);

        // Create the lampshade head
        const headGeometry = new THREE.ConeGeometry(0.5, 0.4, 32);
        const head = new THREE.Mesh(headGeometry, this.lampshadeMaterial);
        ShadowHelper.setShadow(head);
        head.position.y = 2;

        // Create the rod for the lampshade
        const rodGeometry = new THREE.CylinderGeometry(0.04, 0.04, 2, 32);
        const rod = new THREE.Mesh(rodGeometry, this.rodMaterial);
        rod.position.set(0,1,0);
        ShadowHelper.setShadow(rod);

        // Create the light source on top of the lampshade
        const decorationGeometry = new THREE.SphereGeometry(0.05, 32, 32);
        const decoration1 = new THREE.Mesh(decorationGeometry, this.decorationMaterial);
        ShadowHelper.setShadow(decoration1);
        decoration1.position.y = 0.11;
        const decoration2 = new THREE.Mesh(decorationGeometry, this.decorationMaterial);
        ShadowHelper.setShadow(decoration2);
        decoration2.position.y = 1;
        const decoration3 = new THREE.Mesh(decorationGeometry, this.decorationMaterial);
        ShadowHelper.setShadow(decoration3);
        decoration3.position.y = 1.78;
        const decoration4 = new THREE.Mesh(decorationGeometry, this.decorationMaterial);
        ShadowHelper.setShadow(decoration4);
        decoration4.position.y = 2.2;

        //add light to lampshade
        this.lightTarget = new THREE.Object3D();
        this.spotlight.target = this.lightTarget;

        // Link the spotlight's position and target's position to the object's position
        this.spotlight.position.set(0, 2, 0);
        this.spotlight.target.position.set(0, 0, 0);

        this.sceneObject.add(base, head, rod, decoration1, decoration2, decoration3, decoration4, this.spotlight, this.lightTarget);
    }
}

export { Lampshade };
