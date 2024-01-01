/**
 * @file Firework.js
 * @class Firework
 */

import { SceneObject } from './SceneObject.js';
import { Particle } from './Particle.js';
import * as THREE from 'three';

/**
 * Represents a firework object derived from the base SceneObject class.
 * @extends SceneObject
 * @class
 */
class Firework extends SceneObject {

    /**
     * Constructs a firework object.
     * @constructor
     * @param {THREE.Object3D} object - The THREE.Object3D representing the firework.
     * @param {App} app - The application instance.
     */
    constructor(object, app) {
        super(object.name);
        this.obj = object;
        this.app = app
        this.run = false;
        this.fireworks = [];
    }

    /**
     * Initiates the playback of the firework.
     * @method
     */
    play() {
        this.run = true;
    }

    /**
     * Pauses the playback of the firework.
     * @method
     */
    pause() {
        this.run = false;
    }

    /**
     * Updates the firework and manages its particles.
     * @param {number} delta - The time delta for the update.
     * @method
     */
    update(delta) {

        // If runnning, add new fireworks every 5% of the calls
        if (Math.random() < 0.05 && this.run) {
            this.fireworks.push(new Particle({
                position: this.obj.position, 
                app: this.app,
                radius: 0.2
            }));
        }

        // Check fireworks state
        for (let i = 0; i < this.fireworks.length; i++) {
            const firework = this.fireworks[i];

            // If the firework has completed its display
            if (firework.done) {

                // If the firework has completed its display but is a primary one, 
                // trigger an explosion generating numerous additional particles.
                if (firework.getLevel() === 1) {
                    const position = firework.getPosition();
                    for (let j = 0 ; j < THREE.MathUtils.randInt(50, 100) ; j++) {
                        this.fireworks.push(new Particle({
                            position: position, 
                            app: this.app, 
                            level: 2, 
                            limit: 30, 
                            height: 20, 
                            speed: 200,
                            radius: 0.2,
                        }));
                    }
                }

                // Delete the old one
                this.fireworks.splice(i,1) 
            }

            // If the particle is in process, update it
            else {
                this.fireworks[i].update();
            }
        }
    }
}

export { Firework }