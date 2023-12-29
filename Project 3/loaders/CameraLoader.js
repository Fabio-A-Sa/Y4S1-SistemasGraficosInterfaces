/**
 * @file CameraLoader.js
 * @desc Provides functions to load and set up cameras in the scene. If there are no cameras, it provides a default camera.
 */

import * as THREE from 'three';

/**
 * @namespace cameraLoader
 */
export const cameraLoader = {

    /**
     * Loads a camera and returns itLoad cameras based on an array of camera objects with information to create the cameras.
     * @method
     * @param {Array} cameraData - Array of camera objects with information to create the cameras.
     * @returns {Array<THREE.Camera>} The camera objects to be added to the scene.
     */
    load: function(cameraData) {

        /**
         * An array to store the loaded cameras.
         * @type {Array<THREE.Camera>}
         */
        let cameras = [];

        for (const key in cameraData) {
            let data = cameraData[key];

            /**
             * The camera object to be created and added to the scene.
             * @type {?THREE.Camera}
             */
            let camera = null;

            if (data.type === "orthogonal") {
                camera = new THREE.OrthographicCamera(
                    data.left,
                    data.right,
                    data.top,
                    data.bottom,
                );
            } else if (data.type === "perspective") {
                camera = new THREE.PerspectiveCamera(
                    data.angle,
                    window.innerWidth / window.innerHeight,
                );
            } else {
                console.error(`Unknown camera type: ${data.type}, Skipping`);
                continue;
            }

            camera.near = data.near;
            camera.far = data.far;
            camera.name = data.id + "_cam";
            camera.position.fromArray(data.location);
            camera.userData.target = new THREE.Vector3(...data.target);
            camera.lookAt(camera.userData.target);
            camera.userData.id = data.id;
            camera.userData.custom = data.custom;
            cameras.push(camera);
        }

        /**
         * If no valid cameras are provided, create a default perspective camera.
         * @type {THREE.PerspectiveCamera}
         */
        if (cameras.length === 0) {
            console.log("No valid cameras provided. Creating a default camera.");
            let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
            cameras.push(camera);
        }
        
        return cameras;
    },
};
