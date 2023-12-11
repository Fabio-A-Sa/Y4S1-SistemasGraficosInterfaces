/**
 * @file NurbsSurfaceUtils.js
 * @desc Provides functions to aux the creation of nurb surfaces
 */

import * as THREE from 'three';
import { NurbsBuilder } from './NurbsBuilder.js';

/**
 * @namespace nurbsGenerator
 */
export const nurbsGenerator = {

    /**
     * Create a NURBS surface.
     * @method
     * @param {number} x - X-coordinate of the surface's position.
     * @param {number} y - Y-coordinate of the surface's position.
     * @param {number} z - Z-coordinate of the surface's position.
     * @param {Array} controlPoints - Control points for the NURBS surface.
     * @param {number} orderU - The order in the U direction.
     * @param {number} orderV - The order in the V direction.
     * @param {number} samplesU - Number of samples in the U direction (default is 10).
     * @param {number} samplesV - Number of samples in the V direction (default is 10).
     * @returns {THREE.Mesh} The NURBS surface mesh.
     */
    createNurbsSurfaces: function (x, y, z, controlPoints, orderU, orderV, samplesU = 10, samplesV = 10) {
        this.nurbsBuilder = new NurbsBuilder();
        this.meshes = [];

        // Declare local variables
        let surfaceData;
        let mesh;

        surfaceData = this.nurbsBuilder.build(
            controlPoints,
            orderU,
            orderV,
            samplesU,
            samplesV,
            this.material
        );
        mesh = new THREE.Mesh(surfaceData, this.material);
        mesh.rotation.set(0, 0, 0);
        mesh.scale.set(1, 1, 1);
        mesh.position.set(x, y, z);
        this.meshes.push(mesh);

        return mesh;
    },

    /**
     * Create a double-sided NURBS surface.
     * @method
     * @param {number} x - X-coordinate of the surface's position.
     * @param {number} y - Y-coordinate of the surface's position.
     * @param {number} z - Z-coordinate of the surface's position.
     * @param {Array} controlPoints - Control points for the NURBS surface.
     * @param {number} orderU - The order in the U direction.
     * @param {number} orderV - The order in the V direction.
     * @param {number} samplesU - Number of samples in the U direction (default is 10).
     * @param {number} samplesV - Number of samples in the V direction (default is 10).
     * @param {THREE.texture} texture - texture to add to the nurbs surface.
     * @returns {THREE.Mesh} The double-sided NURBS surface mesh.
     */
    createDoubleSidedNurbsSurfaces: function (x, y, z, controlPoints, orderU, orderV, samplesU = 10, samplesV = 10, texture) {
        this.nurbsBuilder = new NurbsBuilder();

        // Declare local variables
        let surfaceData;
        let mesh;

        surfaceData = this.nurbsBuilder.build(
            controlPoints,
            orderU,
            orderV,
            samplesU,
            samplesV,
            this.material
        );

        // Material related attributes
        this.material = new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            side: THREE.DoubleSide, // Make the material double-sided
            map: texture,
        });

        // Create front-facing mesh
        mesh = new THREE.Mesh(surfaceData, this.material);
        mesh.rotation.set(0, 0, 0);
        mesh.scale.set(1, 1, 1);
        mesh.position.set(x, y, z);

        return mesh;
    }
}
