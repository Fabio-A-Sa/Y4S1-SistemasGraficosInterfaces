/**
 * @file CurveUtils.js
 * @desc Provides functions to aux the creation of bezier curves
 */

import * as THREE from 'three';

/**
 * @namespace curveGenerator
 */
export const curveGenerator = {

    // Define the hullMaterial here
    hullMaterial: new THREE.LineBasicMaterial({ color: 0x0000ff }),

    /**
     * Draw a convex hull for a set of points.
     * @method
     * @param {THREE.Vector3} position - The position for the convex hull.
     * @param {Array<THREE.Vector3>} points - The array of points for the convex hull.
     * @returns {THREE.Line} The line representing the convex hull.
     */
    drawHull: function(position, points) {
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, this.hullMaterial);
        line.position.set(position.x, position.y, position.z);
        return line;
    },

    /**
     * Create a quadratic Bezier curve.
     * @method
     * @param {number} x - X-coordinate of the curve's position.
     * @param {number} y - Y-coordinate of the curve's position.
     * @param {number} z - Z-coordinate of the curve's position.
     * @param {Array<THREE.Vector3>} points - The control points for the curve.
     * @param {number} numberOfSamples - The number of points to sample on the curve.
     * @returns {THREE.Line} The line representing the quadratic Bezier curve.
     */
    quadraticBezierCurve: function(x, y, z, points, numberOfSamples) {
        const position = new THREE.Vector3(x, y, z);
        const curve = new THREE.QuadraticBezierCurve3(points[0], points[1], points[2]);
        const sampledPoints = curve.getPoints(numberOfSamples);
        const geometry = new THREE.BufferGeometry().setFromPoints(sampledPoints);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        const lineObj = new THREE.Line(geometry, lineMaterial);
        lineObj.position.set(position.x, position.y, position.z);
        return lineObj;
    },

    /**
     * Create a cubic Bezier curve.
     * @method
     * @param {number} x - X-coordinate of the curve's position.
     * @param {number} y - Y-coordinate of the curve's position.
     * @param {number} z - Z-coordinate of the curve's position.
     * @param {Array<THREE.Vector3>} points - The control points for the curve.
     * @param {number} numberOfSamples - The number of points to sample on the curve.
     * @returns {THREE.Line} The line representing the cubic Bezier curve.
     */
    cubicBezierCurve: function(x, y, z, points, numberOfSamples) {
        const position = new THREE.Vector3(x, y, z);
        const curve = new THREE.CubicBezierCurve3(points[0], points[1], points[2], points[3]);
        const sampledPoints = curve.getPoints(numberOfSamples);
        const geometry = new THREE.BufferGeometry().setFromPoints(sampledPoints);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff00ff });
        const lineObj = new THREE.Line(geometry, lineMaterial);
        lineObj.position.set(position.x, position.y, position.z);
        return lineObj;
    },

    /**
     * Create a geometry for a quadratic Bezier curve.
     * @method
     * @param {Array<THREE.Vector3>} points - The control points for the curve.
     * @param {number} divisions - The number of divisions for the curve.
     * @returns {THREE.BufferGeometry} The geometry for the quadratic Bezier curve.
     */
    quadraticBezierCurveGeometry: function(points, divisions) {
        const curve = new THREE.QuadraticBezierCurve3(points[0], points[1], points[2]);
        const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(divisions));
        return geometry;
    },

    /**
     * Create a geometry for a cubic Bezier curve.
     * @method
     * @param {Array<THREE.Vector3>} points - The control points for the curve.
     * @param {number} divisions - The number of divisions for the curve.
     * @returns {THREE.BufferGeometry} The geometry for the cubic Bezier curve.
     */
    cubicBezierCurveGeometry: function(points, divisions) {
        const curve = new THREE.CubicBezierCurve3(points[0], points[1], points[2], points[3]);
        const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(divisions));
        return geometry;
    }
}
