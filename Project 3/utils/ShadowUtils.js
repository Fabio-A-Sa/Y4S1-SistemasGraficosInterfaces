/**
 * @file ShadowUtils.js
 * @desc Provides functions to configure the shadows in the scene, has configs for both lights and objects
 */

/**
 * @namespace ShadowHelper
 */
 export const ShadowHelper = {

    /**
     * Sets shadow properties for a given mesh.
     *
     * @param {THREE.Mesh | THREE.Light} mesh - The mesh to configure shadow properties for.
     * @param {Boolean} receive - Whether the mesh should receive shadows.
     * @param {Boolean} emmitt - Whether the mesh should cast shadows.
     */
    setShadow: function setShadow(mesh, receive = true, emmitt = true) {
        mesh.receiveShadow = receive;
        mesh.castShadow = emmitt;
    },

    /**
     * Sets attributes for a given point light's shadow.
     *
     * @param {THREE.Light} pointLight - The point light to configure shadow attributes for.
     * @param {number} width - The width of the shadow map.
     * @param {number} height - The height of the shadow map.
     * @param {number} near - The near plane distance for the shadow camera.
     * @param {number} far - The far plane distance for the shadow camera.
     * @param {number} left - The left plane position for the shadow camera.
     * @param {number} right - The right plane position for the shadow camera.
     * @param {number} bottom - The bottom plane position for the shadow camera.
     * @param {number} top - The top plane position for the shadow camera.
     */
    setLightAttributes: function setLightAttributes(pointLight, width = 2048, height = 2048, near = 0.5, far = 10, left = -10, right = 10, bottom = -10, top = 10) {
        pointLight.shadow.mapSize.width = width;
        pointLight.shadow.mapSize.height = height;
        pointLight.shadow.camera.near = near;
        pointLight.shadow.camera.far = far;
        pointLight.shadow.camera.left = left;
        pointLight.shadow.camera.right = right;
        pointLight.shadow.camera.bottom = bottom;
        pointLight.shadow.camera.top = top;
    }
}