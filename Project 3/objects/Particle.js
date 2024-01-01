/**
 * @file Particle.js
 * @class Particle
 */

import * as THREE from 'three';
import { SceneObject } from './SceneObject.js';

/**
 * @classdesc Represents a particle derived from the base SceneObject class.
 * @extends SceneObject
 */
class Particle extends SceneObject {

    /**
     * Constructs a particle object.
     * @constructor
     * @param {Vector3} position - The initial position of the particle.
     * @param {App} app - The application instance.
     * @param {number} [level=1] - The level of the particle.
     * @param {number} [limit=5] - The limit for randomizing particle position.
     * @param {number} [height=40] - The height range for randomizing particle position.
     * @param {number} [speed=100] - The speed at which the particle moves.
     * @param {THREE.Color} [color=null] - The color of the particle. If not provided, a random color will be generated.
     * @param {String} [direction='y'] - The axis/direction of the particle
     * @param {Number} [radius=0.1] - The radius of the sphere/particle
     * @param {Number} [orientation=0] - The particle orientation, in radians
     */
    constructor({ position, app, level = 1, limit = 5, height = 40, speed = 100, color = null, direction = 'y', radius = 0.1, orientation = 0 }) {
        super('scene_particle_obj');

        this.initialPosition = position;
        this.app = app;
        this.done = false;
        this.limit = limit;
        this.height = THREE.MathUtils.randFloat(height * 0.7, height * 1.5);
        this.speed = speed;
        this.level = level;
        this.radius = radius;
        this.color = color ?? new THREE.Color(Math.random() * 0xffffff);
        this.direction = direction.toLowerCase();
        this.orientation = orientation;

        this.dest = [];
        this.particleMesh = null;

        this.material = new THREE.MeshBasicMaterial({
            color: this.color,
            opacity: 1,
            transparent: true,
        });
    
        this.launch();
    }

    /**
     * Launches the particle.
     * @method
     */
    launch() {

        let x, y, z;
        if (this.direction === 'x') {
            x = this.height + this.initialPosition.x;
            y = THREE.MathUtils.randFloat(- this.limit, this.limit) * Math.sin(this.orientation) + this.initialPosition.y;
            z = THREE.MathUtils.randFloat(- this.limit, this.limit) * Math.cos(this.orientation) + this.initialPosition.z;
        } else if (this.direction === 'y') {
            x = THREE.MathUtils.randFloat(- this.limit, this.limit) + this.initialPosition.x;
            y = this.level == 2
                ? THREE.MathUtils.randFloat(- this.height, this.height) + this.initialPosition.y
                : this.height + this.initialPosition.y
            z = THREE.MathUtils.randFloat(- this.limit, this.limit) + this.initialPosition.z;
        } else if (this.direction === 'z') {
            x = this.initialPosition.x - this.height * Math.sin(this.orientation) + THREE.MathUtils.randFloat(-this.limit, this.limit);
            y = this.initialPosition.y + 1 + THREE.MathUtils.randFloat(-this.limit, this.limit);
            z = this.initialPosition.z + this.height * Math.cos(this.orientation) + THREE.MathUtils.randFloat(-this.limit, this.limit);
        }
        this.dest.push(x, y, z);

        const sphereGeometry = new THREE.SphereGeometry(this.radius, 8, 8);
        this.particleMesh = new THREE.Mesh(sphereGeometry, this.material);
        this.particleMesh.position.set(this.initialPosition.x, this.initialPosition.y, this.initialPosition.z);
        this.app.scene.add(this.particleMesh);
    }

    /**
     * Updates the particle's position and handles its lifecycle.
     * @method
     */
    update() {

        this.particleMesh.position.x += (this.dest[0] - this.particleMesh.position.x) / this.speed;
        this.particleMesh.position.y += (this.dest[1] - this.particleMesh.position.y) / this.speed;
        this.particleMesh.position.z -= (this.dest[2] - this.particleMesh.position.z) / this.speed;

        if (this.material.opacity > 0) {
            this.material.opacity -= 0.015;
            this.material.needsUpdate = true;
        } else {
            this.reset();
            this.done = true;
        }
    }

    /**
     * Resets the particle.
     * @method
     */
    reset() {
        if (this.particleMesh) {
            this.app.scene.remove(this.particleMesh);
            this.particleMesh.geometry.dispose();
        }
        this.dest = [];
    }

    /**
     * Gets the position of the particle.
     * @returns {THREE.Vector3} - The particle position.
     * @method
     */
    getPosition() {
        return this.particleMesh.position;
    }

    /**
     * Gets the level of the particle.
     * @returns {number} - The particle level.
     * @method
     */
    getLevel() {
        return this.level;
    }
}

export { Particle };
