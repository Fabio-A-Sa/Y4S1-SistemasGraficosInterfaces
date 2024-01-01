/**
 * @file Obstacle.js
 * @class Obstacle
 */

import { SceneObject } from './SceneObject.js';
import { Animation } from '../animations/Animation.js';

/**
 * @class
 * @classdesc Represents an obstacle derived from the base SceneObject class.
 * @extends SceneObject
 */
class Obstacle extends SceneObject {

    /**
     * Constructs an obstacle object.
     * @constructor
     * @param {SceneObject} object - The object associated with the obstacle.
     * @param {String} type - The desired type.
     */
    constructor(object, type) {
        super(object.name);
        this.obj = object;
        this.animation = new Animation(this.obj, false);
        this.time = 0;
        this.type = type;
        this.cooldown = 0.0;
        this.initialPosition = this.obj.position.clone();

        this.calculateLimit(this.obj);
    }

    /**
     * Updates the object animation based on time.
     * @method
     * @param {Number} delta - The delta time.
     */
    update(delta) {
        if (this.run) {
            this.time += delta;
            if (this.animation)
                this.animation.update(delta);
            if (this.shader)
                this.shader.update('scale', Math.sin(this.time));
        }

        if(this.cooldown > 0) {
            this.cooldown = Math.max(0,this.cooldown-delta);
        }
    }

    /**
     * Handles the selection/picking of the Obstacle object:
     * - If pointed at by the cursor, it increases in size
     */
    verifySelection() {
        if (this.canBePicked) {
            // If pointed
            if (this.isPointed || this.selected)
                this.obj.scale.set(2, 2, 2);
            else 
                this.obj.scale.set(1, 1, 1);
        }
    }
    
    /**
     * Move back the obstacle to its initial position (moves user selectable obstacles to parking lot)
     * @method
     */
    moveToPosition(){
        this.obj.position.copy(this.initialPosition);
    }

    /**
     * Init object animations
     * @method
     */
    animate() {
        this.run = true;
    }
}

export { Obstacle };
