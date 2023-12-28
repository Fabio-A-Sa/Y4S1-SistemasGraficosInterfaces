/**
 * @file Animation.js
 * @class Animation
 */

import * as THREE from 'three';

/**
 * Class representing an animation for a Three.js object.
 * @class
 */
class Animation {

    /**
     * Creates an instance of Animation.
     * @constructor
     * @param {THREE.Object3D} object - The Three.js object to animate.
     * @param {Boolean} rotate - Indicates if the animation is for rotation as well
     */
    constructor(object, rotate = true) {
        this.obj = object;
        this.position = object.position;
        this.points = object.animationPoints ?? [];
        this.run = false;
        this.rotate = rotate;

        // Initialize animation if there are animation points
        if (this.points.length) {
            this.initAnimation();
        }
    }

    /**
     * Initializes the animation based on provided animation points.
     * @method
     */
    initAnimation() {
        const times = this.points.map(point => parseFloat(point.time));
        const points = this.points.reduce((acc, point) => {
            acc.push(parseFloat(point.x), parseFloat(point.y), parseFloat(point.z));
            return acc;
        }, []);
        const duration = Math.max(...times);

        this.keyframes = new THREE.VectorKeyframeTrack('.position', times, points, THREE.InterpolateSmooth);
        this.clip = new THREE.AnimationClip('positionAnimation', duration, [this.keyframes]);
        
        this.mixer = new THREE.AnimationMixer(this.obj);
        this.animation = this.mixer.clipAction(this.clip);
    }

    /**
     * Calculates the angle in relation to the origin from two three-dimensional positions
     * @param {THREE.Vector3} position1 - The first three-dimensional position
     * @param {THREE.Vector3} position2 - The second three-dimensional position
     * @returns {number} The angle in radians in relation to the origin
     */
    angle(position1, position2) {
        const vector = position2.sub(position1);
        return Math.atan2(vector.x, vector.z);
    }

    /**
     * Updates the animation based on the elapsed time.
     * @method
     * @param {number} delta - The time elapsed since the last frame.
     */
    update(delta) {
        if (this.mixer && this.run) {
            const oldPosition = this.obj.position.clone();
            this.mixer.update(delta);

            if (this.rotate)
                this.obj.rotation.y = this.angle(oldPosition, this.obj.position.clone());
        }
    }

    /**
     * Stops the animation.
     * @method
     */
    stop() {
        if (this.mixer) {
            this.animation.stop();
            this.run = false;
        }
    }

    /**
     * Plays the animation.
     * @method
     */
    play() {
        if (this.mixer) {
            this.animation.play();
            this.run = true;
        }
    }
}

export { Animation };
 