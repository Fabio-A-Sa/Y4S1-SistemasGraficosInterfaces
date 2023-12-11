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
     * Parse NURBS data from an XML node and create a NURBS surface.
     * @method
     * @param {Element} xmlNode - The XML node containing NURBS data.
     * @param {THREE.Material} material - The material to apply to the NURBS surface.
     * @returns {THREE.Mesh} The NURBS surface mesh.
     */
    parseNurbs: function(parameters, material) {

        const degreeU = parameters.degree_u;
        const degreeV = parameters.degree_v;
        const partsU = parameters.parts_u;
        const partsV = parameters.parts_v;
    
        const controlPointsData = parameters.controlpoints;
        const controlPoints = [];
    
        for (let i = 0; i <= degreeU; i++) {
            const row = [];
            for (let j = 0; j <= degreeV; j++) {
                const index =  i * (degreeV + 1) + j;
                const controlPointData = controlPointsData[index];
                row.push([controlPointData.xx, controlPointData.yy, controlPointData.zz, 1]);
            }
            controlPoints.push(row);
        }
        
        const object = this.createNurbsSurfaces(0, 0, 0, controlPoints, degreeU, degreeV, partsU, partsV, material);    
        return object;
    },

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
    createNurbsSurfaces: function (x, y, z, controlPoints, orderU, orderV, samplesU = 10, samplesV = 10, material) {
        this.nurbsBuilder = new NurbsBuilder();
        this.meshes = [];

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
        mesh = new THREE.Mesh(surfaceData, material);
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
    createDoubleSidedNurbsSurfaces: function (x, y, z, controlPoints, orderU, orderV, samplesU = 10, samplesV = 10, material) {
        this.nurbsBuilder = new NurbsBuilder();

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

        // Create front-facing mesh
        mesh = new THREE.Mesh(surfaceData, material);
        mesh.rotation.set(0, 0, 0);
        mesh.scale.set(1, 1, 1);
        mesh.position.set(x, y, z);

        return mesh;
    }
}
