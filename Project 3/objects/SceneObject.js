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
    constructor(name, materialId = null, obj = null) {
        super();
        this.materialId = materialId;
        this.name = name;
        this.limit = 0;
        this.animationPoints = [];
        this.canBePicked = false;
        this.isPointed = false;
        this.selected = false;
        this.obj = obj;
    }

    /**
     * Calculates the limit value for the object based on child meshes.
     * @method
     * @param {THREE.Object3D} object - The object for which to calculate the limit.
     */
    calculateLimit(object) {
        object.traverse((obj) => {
            if (obj instanceof THREE.Mesh && obj.userData?.limit) {
                this.limit = Math.max(this.limit, obj.userData.limit);
            }
        })
    }

    /**
     * Sets the animation points
     * @method
     * @param {*} animations - Set of animation controlpoints
     */
    setAnimationPoints(points) {
        this.animationPoints = points;
    }

    /**
     * Updates the object animation based on time.
     * @method
     * @param {Number} delta - The delta time.
     */
    update(delta) {
        if (this.animation)
            this.animation.update(delta);
    }

    /**
     * Inits the object movement
     * @method
     */
    play() {
        if (this.animation)
            this.animation.play();
    }

    /**
     * Stops the object movement
     * @method
     */
    stop() {
        if (this.animation)
            this.animation.stop();
    }

    /**
     * Gets the current position of the power-up.
     * @method
     * @returns {Vector3} - The current position of the power-up.
     */
    getPosition() {
        return this.obj.position;
    }

    /**
     * Traverse the object and return an array of desired sub-objects based on their names
     * @method
     * @param {Array} objectNames - Array of object names to be searched.
     * @returns {Array} - Array of objects found in the object.
     */
    traverseObject(objectNames) {
        const objects = [];

        this.obj.traverse((child) => {
            if (child.name && objectNames.some(name => child.name.includes(name))) {
                objects.push(child);
            }
        });

        return objects;
    }

    /**
     * Enables picking for the object, allowing it to be interacted with.
     * @method
     */
    enablePicking() {
        this.canBePicked = true;
    }

    /**
     * Disables picking for the object, preventing interactions.
     * @method
     */
    disablePicking() {
        this.canBePicked = false;
        this.verifySelection();
    }

    /**
     * Marks the object as selected.
     * @param {THREE.Vector3} point - the intersection point, if any
     * @method
     */
    select(point = null) {
        this.selected = true;
        this.intersectionPoint = point;
    }

    /**
     * Marks the object as not selected.
     * @method
     */
    deselect() {
        this.selected = false;
    }

    /**
     * Marks the object as pointed or focused.
     * @method
     */
    point() {
        this.isPointed = true;
    }

    /**
     * Marks the object as not pointed or focused.
     * @method
     */
    unpoint() {
        this.isPointed = false;
    }

    /**
     * Sets the shader
     * @param {Shader} shader - the desired shader
     */
    setShader(shader) {
        this.shader = shader;
        this.obj.traverse((obj) => {
            if (obj.isMesh) {
                obj.material = this.shader.material;
                obj.material.needsUpdate = true;
            }
        });
    }

    /**
     * Sets the color of all sub-objects to the base color multiplied by a factor
     * @param {Number} factor - the multiplication factor
     */
    setColor(factor) {
        this.obj.traverse((child) => {
            if (child instanceof THREE.Mesh) {

                // Multiple faces
                if (Array.isArray(child.material)) {
                    child.material.forEach((_, index) => {
                        if (!child.material[index].initial) {
                            child.material[index].initial = child.material[index].color;
                        }
                        child.material[index].color = new THREE.Color(factor * child.material[index].initial.getHex());
                    });

                // Single face
                } else {
                    if (!child.material.initial) {
                        child.material.initial = child.material.color;
                    } 
                    child.material.color = new THREE.Color(factor * child.material.initial.getHex());
                }
            }
        });
    }

    /**
     * Returns the object type
     * @method
     * @returns {String} - The desired type
     */
    getType() {
        return this.obj.type;
    }

    /**
     * Sets the initial object size
     * @method
     */
    resetSize() {
        this.obj.scale.set(1, 1, 1);
    }
}

export { SceneObject }
