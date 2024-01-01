/**
 * @file Road.js
 * @class Road
 */

import * as THREE from 'three';
import { SceneObject } from './SceneObject.js';

/**
 * @class
 * @classdesc Represents a road/track derived from the base SceneObject class.
 * @extends SceneObject
 */
class Road extends SceneObject {

    /**
     * Constructs a road object.
     * @constructor
     * @param {SceneObject} object - The object to be associated with the track.
     * @param {App} app - the desired app
     */
    constructor(object, app) {
        super(object.name);
        this.obj = object;
        this.app = app;
        this.geometry = this.obj.children[0].geometry
        this.width = this.geometry.parameters.radius;
        this.points = this.geometry.parameters.path.points;
        this.originalPoints = this.geometry.parameters.path.points.slice();
    }

    /**
     * Checks whether the given object is within the bounds of the road.
     * @method
     * @param {Object} object - The object to check.
     * @returns {boolean} - True if the object is within the road bounds, false otherwise.
     */
    has(object) {

        // Get the position of the object
        const position = object.getPosition();

        // Sort the control points of the road based on the distance to the object
        this.points.sort(function(a, b) {
            return position.distanceTo(a) - position.distanceTo(b);
        });

        // Extract the two closest distinct points to the object
        let v1 = this.points[0], v2 = this.points[1];
        if (v1.equals(v2)) {
            v2 = this.points[2];
        }

        // The distance to the center of the road is the minimum distance between the object
        // and the line segment between v1 and v2
        var dir = new THREE.Vector3().subVectors(v2, v1);
        var vecV3V1 = new THREE.Vector3().subVectors(v1, position);
        var proj = vecV3V1.dot(dir);
        var projVector = dir.clone().multiplyScalar(proj / dir.lengthSq());
        var v4 = new THREE.Vector3().subVectors(v1, projVector);
        var dist = v4.distanceTo(position);

        // It is within the road if the distance does not exceed the width
        return (dist - this.width) >= 0;
    }

    /**
     * Gets the original control points of the road.
     * @method
     * @returns {Array<THREE.Vector3>} - The array of original control points.
     */
    getPoints() {
        return this.originalPoints;
    }
    
    /**
     * Verify road selection
     * @method
     */
    verifySelection() {
        if (this.selected) {
            this.trapPosition = this.intersectionPoint;
            this.deselect();
        }
    }

    /**
     * Returns the selected trap position
     * @method
     * @returns {THREE.Vector3} - The desired position, if any
     */
    getTrapPosition() {
        const trapPostion = this.trapPosition;
        this.trapPosition =  undefined;
        return trapPostion;
    }

    /**
     * Reset the road size
     * @method
     */
    resetSize() {}
}
 
export { Road };