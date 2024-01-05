/**
 * @file textDisplayHelper.js
 * @brief Helper module for displaying text using Three.js.
 */

import * as THREE from 'three';
import { spriteCreator } from './spriteUtils.js';

/**
 * @namespace textDisplayHelper
 * @brief Module for managing and displaying text in a Three.js scene.
 */
export const textDisplayHelper = {

    /**
     * @var {string} spritesheetPath - Path to the spritesheet containing character textures.
     */
    spritesheetPath: './scene/textures/chars.png',

    /**
     * @var {Map} letterCache - Cache for letter sprites to avoid redundant loading.
     */
    letterCache: new Map(),

    /**
     * @var {Object} textureCache - Cache for the spritesheet texture.
     */
    textureCache: null,

    /**
     * @var {Object} letterMap - Mapping of characters to their corresponding texture coordinates.
     */
    letterMap: new Map(),

    /**
     * @function
     * @name initChars
     * @description Initializes the letter mapping based on a sprite sheet.
     * @returns {void}
     */
    initChars: function () {
        const numRows = 6;
        const numCharsPerRow = 18;
        const sheetWidth = 126;
        const sheetHeight = 54;
        const cellWidth = sheetWidth / numCharsPerRow;
        const cellHeight = sheetHeight / numRows;
    
        // Define the sequence of characters
        const charSequence = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~                                ";
    
        // Loop through rows and columns to generate mappings for each letter
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCharsPerRow; col++) {
                const charIndex = row * numCharsPerRow + col;
                if (charIndex < charSequence.length) {
                    const letter = charSequence[charIndex];
                    const startU = col * cellWidth / sheetWidth;
                    const endU = (col + 1) * cellWidth / sheetWidth;
    
                    // Adjust startV and endV for reversed Y-axis
                    const endV = 1 - (row * cellHeight / sheetHeight);
                    const startV = 1 - ((row + 1) * cellHeight / sheetHeight);
    
                    this.letterMap[letter] = { startU, startV, endU, endV };
                }
            }
        }
    },
    
    

    /**
     * @function getLetterSprite
     * @brief Retrieves a letter sprite from the cache or loads it from the spritesheet.
     * @param {string} letter - The character for which to get the sprite.
     * @param {number} size - The size of the letter sprite.
     * @returns {Object} - The letter sprite.
     */
    getLetterSprite: function (letter, size) {
        const cacheKey = `${letter}_${size}`;

        if (this.letterCache.has(cacheKey)) {
            return this.letterCache.get(cacheKey).clone();
        }

        const letterInfo = this.letterMap[letter];
        if (!letterInfo) {
            console.error(`Letter "${letter}" not found in the letter map.`);
            return null;
        }

        const { startU, startV, endU, endV } = letterInfo;

        if (this.textureCache) {
            const letterSprite = spriteCreator.loadSprite(this.textureCache, null, size, startU, startV, endU, endV);

            if (letterSprite) {
                this.letterCache.set(cacheKey, letterSprite);
            }

            return letterSprite;
        } else {
            // Create a texture loader
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load(this.spritesheetPath);
            texture.offset.set(startU, startV);
            texture.repeat.set(endU - startU, endV - startV);

            this.textureCache = texture;

            const letterSprite = spriteCreator.loadSprite(texture, null, size, startU, startV, endU, endV);

            if (letterSprite) {
                this.letterCache.set(cacheKey, letterSprite);
            }

            return letterSprite;
        }
    },

    /**
     * @function createText
     * @brief Creates a Three.js group containing sprites for each letter in the provided text.
     * @param {string} textHandler - The name of the text handler.
     * @param {string} text - The text to display.
     * @param {Vector3} startPosition - The starting position for the text group.
     * @param {number} letterSize - The size of each letter.
     * @param {number} spacing - The spacing between letters.
     * @returns {Group} - The Three.js group containing the text.
     */
    createText: function (textHandler, text, startPosition, letterSize = 1, spacing = 1) {
        const textGroup = new THREE.Group();
        const letterSprites = [];

        let currentPosition = new THREE.Vector3(0,0,0);

        for (let i = 0; i < text.length; i++) {
            const letterSprite = this.getLetterSprite(text[i], letterSize);

            if (letterSprite) {
                letterSprite.position.copy(currentPosition);
                textGroup.add(letterSprite);
                letterSprites.push(letterSprite);
                currentPosition.x += (letterSize + spacing);
            }
        }

        textGroup.userData.letterSprites = letterSprites;
        textGroup.position.copy(startPosition);
        textGroup.name = textHandler;
        return textGroup;
    },

    /**
     * @function updateText
     * @brief Updates the text in the scene with a new text string.
     * @param {Scene} scene - The Three.js scene.
     * @param {string} textName - The name of the text group to update.
     * @param {string} newText - The new text string.
     * @param {number} letterSize - The size of each letter.
     * @param {number} spacing - The spacing between letters.
     */
    updateText: function (scene, textName, newText, letterSize = 1, spacing = 1) {
        const existingTextGroup = scene.getObjectByName(textName);

        if (!existingTextGroup) {
            console.error(`TextGroup with name ${textName} not found in the scene.`);
            return;
        }

        // Get the position of the existing textGroup and name
        const currentPosition = existingTextGroup.position.clone();
        const textHandler = existingTextGroup.name;

        // Remove the existing textGroup from the scene
        scene.remove(existingTextGroup);

        // Create the new textGroup
        const newTextGroup = this.createText(textHandler, newText, currentPosition, letterSize, spacing);
        newTextGroup.name = textName;

        // Add the new textGroup back to the scene
        scene.add(newTextGroup);
    },


    /**
     * @function updateTextPosition
     * @brief Updates the position and orientation of the text in the scene based on the camera's view.
     * @param {Scene} scene - The Three.js scene.
     * @param {string} textName - The name of the text group to update.
     * @param {PerspectiveCamera} camera - The Three.js camera.
     * @param {WebGLRenderer} renderer - The Three.js renderer.
     * @param {number} offsetX - The X-axis offset.
     * @param {number} offsetY - The Y-axis offset.
     */
    updateTextPosition: function (scene, textName, camera, renderer, offsetX = 0, offsetY = 0) {
        const distance = 0.1;
        const renderOrder = 1;

        const textGroup = scene.getObjectByName(textName);

        if (!textGroup) {
            console.error(`TextGroup with name ${textName} not found in the scene.`);
            return;
        }

        // Calculate the direction from the camera
        const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);

        // Calculate the final position with offsets
        const newPosition = new THREE.Vector3();
        newPosition.copy(camera.position).addScaledVector(direction, distance);
        newPosition.add(new THREE.Vector3(offsetX, offsetY, 0).applyQuaternion(camera.quaternion));

        // Update position and orientation
        textGroup.position.copy(newPosition);
        textGroup.quaternion.copy(camera.quaternion);

        if (renderOrder !== undefined) {
            textGroup.children.forEach((sprite) => {
                if (sprite.material) {
                    sprite.material.renderOrder = renderOrder;
                }
            });
        }
    },

   
    
};
