/**
 * @file SceneObject.js
 * @class SceneObject
 * @desc Base object to mold other objects, this class has the main methods that exist in all other (like positioning and scaling). 
 * the class also includes a list of "subs" objects separated from the THREE.Group so that it is possible to move the together on individaully.
 */

import * as THREE from 'three';
import { rotationHelper } from '../utils/RotationUtils.js';

/**
 * @class
 * @classdesc Base object in the project in which other objects can derive from, provides the basic functions necessary.
 */
class SceneObject {

    /**
     * Constructs a base object that can be built upon.
     * @constructor
     * @param {String} name - the name of the object to appear on the side menu.
     * @param {number} x - The x-coordinate of the object's position.
     * @param {number} y - The y-coordinate of the object's position.
     * @param {number} z - The z-coordinate of the object's position.
     * @param {number} ang - The initial angle of the object (default is 0).
     */
    constructor(name, x, y, z, ang = 0) {
        // Create a new THREE.Group to hold the object
        this.sceneObject = new THREE.Group();
        this.name = name;

        // An array to hold sub-objects
        this.subs = [];

        // Update the object's position and rotation
        this.updatePosition(x, y, z);
        this.updateRotation(ang);

        // Enable/disable flag for the object (enabled by default)
        this.enabled = true;
    }

    /**
     * Getter function for the position of the object
     * @method
     * @returns {THREE.Vector3} - position of the object on the scene.
     */    
    getPosition(){
        return [...this.sceneObject.position];
    }

    /**
     * Getter function for the scale of the object
     * @method
     * @returns {THREE.Vector3} - Scale of the object on the scene divide in (x,y,z).
     */ 
    getScale(){
        return [...this.sceneObject.scale];
    }

    /**
     * Add object to sceneObject
     * @method
     * @param {THREE.Object3D} - object to be part of the sceneObject
     */
    addToMainObject(newPart){
        this.sceneObject.add(newPart);
    }

    /**
     * Update the position of the object.
     * @method
     * @param {number} x - The x-coordinate of the new position.
     * @param {number} y - The y-coordinate of the new position.
     * @param {number} z - The z-coordinate of the new position (default is 0).
     */
    updatePosition(x, y, z = 0){
        this.sceneObject.position.set(x, y, z);
    }

    /**
     * Update the rotation of the object.
     * @method
     * @param {number} ang - The new angle of rotation.
     * @param {THREE.Vector3} rotAxis - The axis of rotation (default is Y-axis).
     */
    updateRotation(ang, rotAxis = new THREE.Vector3(0, 1, 0)){
        this.sceneObject.rotateOnAxis(rotAxis, ang);
    }

    /**
     * Update the scale of the object.
     * @method
     * @param {number} x - The new scale along the x-axis.
     * @param {number} y - The new scale along the y-axis.
     * @param {number} z - The new scale along the z-axis.
     */
    updateScale(x, y, z){
        this.sceneObject.scale.set(x, y, z);
    }

    /**
     * Update the position of the object and its sub-objects.
     * @method
     * @param {number} x - The x-coordinate of the new position.
     * @param {number} y - The y-coordinate of the new position.
     * @param {number} z - The z-coordinate of the new position (default is 0).
     */
    updateAllPosition(x, y, z = 0){
        for (const item of this.subs){
            let positionSub = item.sceneObject.position;
            let positionMaster = this.sceneObject.position;
            let original_x = positionSub.x - positionMaster.x;
            let original_y = positionSub.y - positionMaster.y;
            let original_z = positionSub.z - positionMaster.z;

            item.updateAllPosition(original_x+x, original_y+y, original_z+z);
        }
        this.sceneObject.position.set(x, y, z);
    }
      
    /**
     * Update the rotation of the object and its sub-objects.
     * @method
     * @param {number} ang - The new angle of rotation.
     * @param {THREE.Vector3} rotAxis - The axis of rotation (default is Y-axis).
     * @param 
     */
    updateAllRotation(ang, rotAxis = new THREE.Vector3(0, 1, 0), pivotPoint){

        if(pivotPoint === undefined){
            pivotPoint = [this.sceneObject.position.x ,this.sceneObject.position.y, this.sceneObject.position.z];
        }
        
        this.updateRotation(ang, rotAxis);

        for (const item of this.subs){
            let itemPos = item.getPosition();
            let rotAxisArray = [rotAxis.x, rotAxis.y, rotAxis.z];

            const result = rotationHelper.rotatePointAroundAxis(itemPos, pivotPoint, rotAxisArray, ang);

            item.updatePosition(result[0], result[1], result[2]);
            item.updateAllRotation(ang, rotAxis, pivotPoint);
        }

    }

    /**
     * Update the scale of the object and its sub-objects.
     * @method
     * @param {number} x - The new scale along the x-axis.
     * @param {number} y - The new scale along the y-axis.
     * @param {number} z - The new scale along the z-axis.
     */
    updateAllScale(x, y, z){
        this.sceneObject.scale.set(x * this.sceneObject.scale.x,
                                   y * this.sceneObject.scale.y,
                                   z * this.sceneObject.scale.z);
        for (const item of this.subs){
            let itemPos = item.getPosition();
            item.updateAllPosition(
                (itemPos[0] * x) - (this.sceneObject.position.x * (x - 1)),
                (itemPos[1] * y) - (this.sceneObject.position.y * (y - 1)),
                (itemPos[2] * z) - (this.sceneObject.position.z * (z - 1))
            );
            let itemScale = item.getScale();

            console.log(itemScale);

            item.updateAllScale(x, y, z);
        }
    }

    /**
     * Add a sub-object to this object.
     * @method
     * @param {SceneObject} subObj - The sub-object to add.
     */
    addSubObject(subObj){
        this.subs.push(subObj);
    }

    /**
     * Remove a sub-object from this object.
     * @method
     * @param {SceneObject} subObj - The sub-object to remove.
     * @todo - get properties from parent when removing a sub object
     */
    removeSubObject(subObj){
        this.subs.splice(this.subs.indexOf(subObj), 1);
    }

    /**
     * Default build function that can be built upon
     * @method
     */ 
    build(){
        // nothing
    }

    /**
     * Build all the objects
     * @method
     */
    buildAll(){
        this.build();
        this.buildSubs();
    }

    /**
     * Build sub-objects of this object.
     */
    buildSubs(){
        for (const item of this.subs){
            item.buildAll();
        }        
    }

    /**
     * add all the objects to the scene
     * @method
     * @param {THREE.Scene} scene - The scene in which this object should be toggled.
     */
    addAllScene(app){
        app.scene.add(this.sceneObject);
        app.addToObjList(this);
        this.addSubs(app);
    }

    /**
     * Add all sub-objects to a scene.
     * @method
     * @param {THREE.Scene} scene - The scene to which sub-objects will be added.
     */
    addSubs(scene){
        for(const item of this.subs){
            item.addAllScene(scene);
        }
    }

    /**
     * Toggle the enable state of this object in a scene.
     * @method
     * @param {THREE.Scene} scene - The scene in which this object should be toggled.
     */
    toggleEnable(scene){
        this.enabled ? scene.add(this.sceneObject) : scene.remove(this.sceneObject);
    }
}

export { SceneObject }
