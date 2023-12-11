/**
 * @file NurbsBuilder.js
 * @class NurbsBuilder
 * @desc Responsible for the creation of NURBS
 */

import * as THREE from 'three';
import { NURBSSurface } from 'three/addons/curves/NURBSSurface.js';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';

/**
 * @class
 * NurbsBuilder is responsible for generating NURBS surfaces in the application.
 * It allows for the creation of NURBS surface geometry using control points and various parameters.
 */
class NurbsBuilder {
    /**
     * Constructs a NurbsBuilder object.
     * @constructor
     * @param {MyApp} app - The application object.
     */
    constructor(app) {
        this.app = app;
    }

    /**
     * Build a NURBS surface geometry.
     * @method
     * @param {Array} controlPoints - Control points for the NURBS surface.
     * @param {number} degree1 - The degree in the U direction.
     * @param {number} degree2 - The degree in the V direction.
     * @param {number} samples1 - Number of samples in the U direction.
     * @param {number} samples2 - Number of samples in the V direction.
     * @param {THREE.Material} material - The material for the geometry.
     * @returns {THREE.Geometry} The NURBS surface geometry.
     */
    build(controlPoints, degree1, degree2, samples1, samples2, material) {
        const knots1 = [];
        const knots2 = [];

        // Build knots1 = [0, 0, 0, 1, 1, 1];
        for (let i = 0; i <= degree1; i++) {
            knots1.push(0);
        }

        for (let i = 0; i <= degree1; i++) {
            knots1.push(1);
        }

        // Build knots2 = [0, 0, 0, 0, 1, 1, 1, 1];
        for (let i = 0; i <= degree2; i++) {
            knots2.push(0);
        }

        for (let i = 0; i <= degree2; i++) {
            knots2.push(1);
        }

        let stackedPoints = [];

        for (let i = 0; i < controlPoints.length; i++) {
            let row = controlPoints[i];
            let newRow = [];

            for (let j = 0; j < row.length; j++) {
                let item = row[j];
                newRow.push(new THREE.Vector4(item[0], item[1], item[2], item[3]));
            }

            stackedPoints[i] = newRow;
        }

        const nurbsSurface = new NURBSSurface(degree1, degree2, knots1, knots2, stackedPoints);

        const geometry = new ParametricGeometry(getSurfacePoint, samples1, samples2);

        return geometry;

        /**
         * Get a point on the NURBS surface.
         * @method
         * @param {number} u - The parameter in the U direction.
         * @param {number} v - The parameter in the V direction.
         * @param {THREE.Vector3} target - The target vector to store the result.
         * @returns {THREE.Vector3} The point on the NURBS surface.
         */
        function getSurfacePoint(u, v, target) {
            return nurbsSurface.getPoint(u, v, target);
        }
    }
}

export { NurbsBuilder };
