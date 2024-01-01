/**
 * @file PowerUp.js
 * @class PowerUp
 */

import { SceneObject } from './SceneObject.js';
import { Animation } from '../animations/Animation.js'
 
/**
 * @class
 * @classdesc Represents a power-up derived from the base SceneObject class.
 * @extends SceneObject
 */
class PowerUp extends SceneObject {
 
    /**
     * Constructs a power-up object.
     * @constructor
     * @param {SceneObject} object - The object associated with the power-up.
     * @param {String} type - The desired type.
     */
    constructor(object, type) {
        super(object.name);
        this.obj = object;
        this.type = type;
        this.cooldown = 0;
        this.animation = new Animation(this.obj, false);

        this.calculateLimit(this.obj);
    }

    /**
     * Update powerup properties
     * @param {Number} delta - the time 
     */
    update(delta) {
        if (this.run) {
            this.time += delta;
            if (this.animation)
                this.animation.update(delta);
            if (this.shader)
                this.shader.update('scale', Math.sin(this.time));
        }

        if (this.cooldown > 0) {
            this.cooldown = Math.max(0, this.cooldown - delta);
        }
    }

    /**
     * Init object animations
     * @method
     */
    animate() {
        this.run = true;
    }
 }
 
export { PowerUp };
 