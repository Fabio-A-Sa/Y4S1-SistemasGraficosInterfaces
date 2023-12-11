/**
 * @file Polygon.js
 * @desc Creates a polygon with an arbitrary number of vertices from BufferGeometry
 */

import * as THREE from 'three';

/**
 * Polygon
 * @constructor
 * @param {number} radius - Radius of the polygon.
 * @param {number} stacks - Number of stacks in the polygon.
 * @param {number} slices - Number of slices in the polygon.
 * @param {*} color_c - Color for the polygon.
 * @param {*} color_p - Other color parameter (not used in the code).
 */
class Polygon extends THREE.BufferGeometry {

    constructor(radius, stacks, slices, color_c, color_p) {
        super();

        this.radius = radius;
        this.stacks = stacks;
        this.slices = slices;
        this.color_c = color_c;
        this.color_p = color_p;

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.colors = [];

        this.initBuffers();
    }

    /**
     * Rounds a given number to a specified number of decimal places.
     *
     * @param {number} number - The number to be rounded.
     * @param {number} decimal - The number of decimal places to round to.
     * @returns {number} The rounded number.
    */
    round(number, decimal) {
        const aproximation = 10 ** decimal;
        return Math.round(number * aproximation) / aproximation;
    }

    /**
     * Gets the current number of vertices in the geometry.
     *
     * @returns {number} The rounded count of vertices.
    */
    currentVertices() {
        return Math.round(this.vertices.length / 3);
    }

    /**
     * Retrieves the color at a given stack position, interpolated between the top and bottom colors.
     *
     * @param {number} stack - The stack position for which to calculate the interpolated color.
     * @returns {number[]} An array representing the RGBA components of the interpolated color.
    */
    getColor(stack) {
        const result = new THREE.Color().lerpColors(this.color_c, this.color_p, stack / this.stacks);
        return [result.r, result.g, result.b, result.a];
    }

    /**
     * Initializes the buffers for the regular geometry, including vertices, indices, normals, and colors.
     * This function constructs the geometry based on the specified number of stacks and slices,
     * creating a shape with interpolated colors.
    */
    initBuffers() {

        // First line
        for (let stack = 0 ; stack <= this.stacks ; stack++) {
            const x = this.round(stack * (this.radius / this.stacks), 2);
            this.vertices.push(x, 0, 0);
            this.normals.push(0, 0, 1);
            this.colors.push(...this.getColor(stack));
        }  

        for (let slice = 1 ; slice <= this.slices ; slice++) {
            let lastSlice = slice === this.slices;
            for (let stack = 1 ; stack <= this.stacks ; stack++) {
                
                // To avoid duplication of points at the same coordinates
                if (!lastSlice) {
                    const theta = (2 * Math.PI * slice ) / this.slices;
                    const r = stack * this.radius / this.stacks;
                    const x = this.round(r * Math.cos(theta), 2);
                    const y = this.round(r * Math.sin(theta), 2);
        
                    this.vertices.push(x, y, 0);
                    this.normals.push(0, 0, 1);
                    this.colors.push(...this.getColor(stack));
                }
        
                let a = lastSlice ? stack : this.currentVertices() - 1;
                let b, c, d;
                
                // First stack, one single triangle 
                if (stack == 1) {
                    b = 0;                                                     
                    c = lastSlice ? this.currentVertices() - 1 : a - this.stacks;
                    this.indices.push(a, b, c);
                
                // Two triangles
                } else {
                    b = a - 1;           
                    c = lastSlice 
                        ? this.currentVertices() - this.stacks + a - 2 
                        : a - this.stacks - 1; 
                    d = c + 1; 
                    this.indices.push(a, b, c, a, c, d);
                }
            }
        }

        // Set geometry attributes
        this.setIndex(new THREE.BufferAttribute(new Uint32Array(this.indices), 1));
        this.setAttribute('position', new THREE.Float32BufferAttribute(this.vertices, 3));
        this.setAttribute('color', new THREE.Float32BufferAttribute(this.colors, 4));
        this.setAttribute('normal', new THREE.Float32BufferAttribute(this.normals, 3));
    }
}

export { Polygon };