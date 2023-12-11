/**
 * @file Table.js
 * @class Table
 * @extends SceneObject
 * @desc Representation of a simple wooden table with metal legs.
 */

import * as THREE from 'three';
import { SceneObject } from './SceneObject.js';
import { ShadowHelper } from '../utils/ShadowUtils.js';

/**
 * @class
 * @classdesc Simple table object consisting of a square top and four round legs.
 */
class Table extends SceneObject {

    /**
     * Constructs a Table object representing a table.
     * @constructor
     * @param {String} name - name of the object
     * @param {number} x - The x-coordinate of the table's position.
     * @param {number} y - The y-coordinate of the table's position.
     * @param {number} z - The z-coordinate of the table's position.
     * @param {number} ang - The initial angle of the table (default is 0).
     */
    constructor(name, x, y, z, ang = 0) {
        // Call the constructor of the parent class 'Object'
        super(name, x, y, z, ang);
    
        // Define material properties for the table
        this.specularColor = "#964B00";
        this.shininess = 50;

        // Create a material for the table top
        const woodTexture = new THREE.TextureLoader().load('./textures/wood1.jpg');
        this.tableTopMaterial = new THREE.MeshStandardMaterial({
            color: 0xc0c0c0,   
            map: woodTexture, 
            roughness: 0.6,        
            metalness: 0.2,        
            normalScale: new THREE.Vector2(1, 1),
        });

        // Create a Phong material for the table leg with metal texture
        this.legMaterial = new THREE.MeshPhongMaterial({
            color: "#bbbbbb",
            specular: "#dddddd", // White specular highlight for metallic look
            emissive: "#555555", // No emissive color
            shininess: 100
        });
    }

    /**
     * Build the table object.
     * @method
     */
    build() {
        
        // Create geometries for the table top and legs
        const tableTopGeometry = new THREE.BoxGeometry(2, 0.1, 2);
        const tableLegGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.0, 32);
        
        // Create mesh objects for the table top and legs using the defined material
        const tableTop = new THREE.Mesh(tableTopGeometry, this.tableTopMaterial);
        ShadowHelper.setShadow(tableTop);
        const tableLeg1 = new THREE.Mesh(tableLegGeometry, this.legMaterial);
        ShadowHelper.setShadow(tableLeg1);
        const tableLeg2 = new THREE.Mesh(tableLegGeometry, this.legMaterial);
        ShadowHelper.setShadow(tableLeg2);
        const tableLeg3 = new THREE.Mesh(tableLegGeometry, this.legMaterial);
        ShadowHelper.setShadow(tableLeg3);
        const tableLeg4 = new THREE.Mesh(tableLegGeometry, this.legMaterial);
        ShadowHelper.setShadow(tableLeg4);

        // Set positions for the table top and legs
        tableTop.position.set(0, 0.5, 0);
        tableLeg1.position.set(-0.8, 0, -0.8);
        tableLeg2.position.set(0.8, 0, -0.8);
        tableLeg3.position.set(-0.8, 0, 0.8);
        tableLeg4.position.set(0.8, 0, 0.8);

        // Add the table top and legs to the object's group
        this.sceneObject.add(tableTop, tableLeg1, tableLeg2, tableLeg3, tableLeg4);
    }
}

export { Table }
