/**
 * @file SceneObject.js
 * @class SceneObject
 */

import * as THREE from 'three';

/**
 * @class
 * @classdesc Base object in the project in which other objects can derive from, provides the basic functions necessary.
 */
class SceneObject extends THREE.Group {

    /**
     * Constructs a base object that can be built upon.
     * @constructor
     * @param {String} name - the name of the object to appear on the side menu.
     * @param {String} materialId - The id for the material for the items inside.
     */
    constructor(name, materialId) {
        super();
        this.materialId = materialId;
        this.name = name;
    }
}

export { SceneObject }
