/**
 * @file SkyBoxLoader.js
 * @desc Provides function to load background to the image.
*/
import * as THREE from 'three';

/**
 * @namespace skyboxLoader 
 */
export const skyboxLoader = {

    /**
     * Loads and creates a skybox based on the provided skyboxes data.
     *
     * @param {Object} skyboxesData - Data containing information about the skyboxes.
     * @returns {THREE.Mesh} - The created skybox as a THREE.Mesh.
    */
    load: function (skyboxesData) {
        
        // Check if the data is an array
        if (!Array.isArray(skyboxesData)) {
            console.error('Invalid data format for skybox creation');
            return;
        }
        
        const skyboxData = skyboxesData.default;

        /**
         * The skybox geometry.
         * @type {THREE.BoxGeometry}
        */
        const skyboxGeometry = new THREE.BoxGeometry(skyboxData.size[0],
                                                     skyboxData.size[1],
                                                     skyboxData.size[2]);

        let loader = new THREE.TextureLoader();
        let skyboxMaterial = [];
        
        let loadTexture = (url, materialIndex) => {
            loader.load(url, (texture) => {
                let material = new THREE.MeshStandardMaterial({ map: texture, fog: false });
                material.side = THREE.BackSide;
                material.emissive = new THREE.Color(skyboxData.emissive);
                material.emissiveIntensity = skyboxData.intensity/10;
                skyboxMaterial[materialIndex] = material;
            });
        };
        
        loadTexture(skyboxData.up, 2);
        loadTexture(skyboxData.down, 3);
        loadTexture(skyboxData.left, 1);
        loadTexture(skyboxData.right, 0);
        loadTexture(skyboxData.front, 4);
        loadTexture(skyboxData.back, 5);
        
        const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
        skybox.name = "skyBox";
        return skybox;
    },

}
