/**
 * @file Route.js
 * @class Route
 */

import { SceneObject } from './SceneObject.js';
import { Animation } from '../animations/Animation.js'

/**
 * @lass
 * @lassdesc Represents a route derived from the base SceneObject class.
 * @xtends SceneObject
 */
class Route extends SceneObject {

    /**
     * Constructs a route object.
     * @constructor
     * @param {Object} object - The path geometry containing a parameterized path.
     */
    constructor(object) {
        super(object.name);
        this.obj = object;
        this.animation = new Animation(this.obj);

        this.calculateLimit(this.obj);
    }
}

export { Route };
