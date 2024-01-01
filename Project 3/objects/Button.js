/**
 * @file Button.js
 * @class Button
 */

import * as THREE from 'three';
import { SceneObject } from './SceneObject.js';

/**
 * @class
 * @classdesc Represents a button derived from the base SceneObject class.
 * @extends SceneObject
 */
class Button extends SceneObject {

    /**
     * Constructs a button object.
     * @constructor
     * @param {SceneObject} object - The object associated with the button.
    */
    constructor(object) {
        super(object.name);
        this.obj = object;
    }   

    /**
     * Updates the button' state
     * @method
     */
    update() {
        if (this.canBePicked) {            
            this.setColor(this.selected ? 0.5 : 1);
        }
    }

    /**
     * Initiates the button's motion.
     * @method
     */
    play() {
        this.canBePicked = true;
    }

    /**
     * Stops the button's motion.
     * @method
     */
    stop() {
        this.canBePicked = false;
    }

    /**
     * Set the visibility properties for all materials of the button object.
     * @param {Number} opacity - The desired opacity (0 to 1).
     * @param {Boolean} transparent - Whether the material should be transparent.
     */
    setProperties(opacity, transparent) {
        this.obj.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                for (const material of object.material) {
                    material.opacity = opacity;
                    material.transparent = transparent;
                }
            }
        })
    }

    /**
     * Make the button object visible
     * @method
     */
    toVisible() {
        this.setProperties(1, false);
    }

    /**
     * Make the button object invisible
     * @method
     */
    toInvisible() {  
        this.setProperties(0, true);
    }
}
 
export { Button };