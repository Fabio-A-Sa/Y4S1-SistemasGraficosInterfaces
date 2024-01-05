/**
 * @file spriteCreator.js
 * @brief Module for creating and updating Three.js sprites.
 */

import * as THREE from 'three';

/**
 * @namespace spriteCreator
 * @brief Module for creating and updating Three.js sprites.
 */
export const spriteCreator = {

    /**
     * @function loadSprite
     * @brief Creates a sprite with the specified texture and parameters.
     * @param {Texture} texture - The texture for the sprite.
     * @param {Vector3} position - The position of the sprite.
     * @param {number} size - The size of the sprite.
     * @param {number} startU - The starting U-coordinate for texture mapping.
     * @param {number} startV - The starting V-coordinate for texture mapping.
     * @param {number} endU - The ending U-coordinate for texture mapping.
     * @param {number} endV - The ending V-coordinate for texture mapping.
     * @returns {Sprite} - The created sprite.
     */
    loadSprite: function (texture, position, size = 1, startU = 0, startV = 0, endU = 1, endV = 1) {

        const clonedTexture = texture.clone();
        const material = new THREE.SpriteMaterial({ map: clonedTexture, transparent: true, alphaTest: 0.5 });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(size, size, 1);
    
        if (position) {
            sprite.position.copy(position);
        }
    
        clonedTexture.offset.set(startU, startV);
        clonedTexture.repeat.set(endU - startU, endV - startV);
    
        return sprite;
    },
    
    /**
     * @function updateSpritePosition
     * @brief Updates the position and orientation of a sprite based on the camera's view.
     * @param {Sprite} sprite - The sprite to update.
     * @param {PerspectiveCamera} camera - The Three.js camera.
     * @param {number} distance - The distance from the camera.
     * @param {number} renderOrder - The render order for the sprite.
     */
    updateSpritePosition: function(sprite, camera, distance = 0.1, renderOrder) {
        const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
        sprite.position.copy(camera.position).addScaledVector(direction, distance);
        sprite.quaternion.copy(camera.quaternion);
        
        if (renderOrder !== undefined) {
            sprite.material.renderOrder = renderOrder;
        }
    },

    /**
     * @function updateSprite
     * @brief Updates the texture of a sprite.
     * @param {Sprite} sprite - The sprite to update.
     * @param {Texture} newTexture - The new texture for the sprite.
     * @param {number} startU - The starting U-coordinate for texture mapping.
     * @param {number} startV - The starting V-coordinate for texture mapping.
     * @param {number} endU - The ending U-coordinate for texture mapping.
     * @param {number} endV - The ending V-coordinate for texture mapping.
     */
    updateSprite: function(sprite, newTexture, startU = 0, startV = 0, endU = 1, endV = 1) {
        sprite.material.map = newTexture;
        sprite.material.needsUpdate = true;

        newTexture.offset.set(startU, startV);
        newTexture.repeat.set(endU - startU, endV - startV);
    },
    
};
