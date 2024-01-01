/**
 * @file Outdoor.js
 * @brief Defines the Outdoor class for managing outdoors within a Three.js scene.
 */

import * as THREE from 'three';
import { SceneObject } from './SceneObject.js';
import { textDisplayHelper } from '../utils/TextDisplayUtils.js';

/**
 * @classdesc Represents an outdoor within a Three.js scene.
 * @extends SceneObject
 */
class Outdoor extends SceneObject {
    /**
     * @brief Constructs a new Outdoor instance.
     * @param {Object} object - The Three.js object to be managed.
     * @param {number} sizeX - X size of the writable area in the outdoor.
     * @param {number} sizeY - Y size of the writable area in the outdoor.
     * @param {number} textDistance - The distance of text from the outdoors.
     */
    constructor(object, sizeX = 0, sizeY = 0, textDistance = 0) {
        super(object.name);
        this.obj = object;
        this.textList = [];
        this.textDistance = textDistance;
        this.sizeX = sizeX;
        this.sizeY = sizeY;

        this.init();
    }

    /**
     * @brief Initializes the Outdoor instance by setting up the camera and renderer.
     */
    init() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 5, 5);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
    }

    /**
     * @brief Adds text to the outdoors at a specified position.
     * @param {string} content - The content of the text.
     * @param {number} offsetX - The X-axis offset from the top-left point of the outdoors.
     * @param {number} offsetY - The Y-axis offset from the top-left point of the outdoors.
     * @param {number} letterSize - The size of each letter in the text.
     * @param {number} spacing - The spacing between letters.
     */
    addText(content, offsetX, offsetY, letterSize = 1, spacing = 0.1) {
        const textHandler = `${this.obj.name}_text_${this.textList.length}`;

        // Calculate position based on the offset from the top-left point of the outdoors
        const textPosition = new THREE.Vector3(
            offsetX - this.sizeX / 2,
            this.sizeY / 2 - offsetY,
            this.textDistance
        );

        const textGroup = textDisplayHelper.createText(
            textHandler,
            content,
            textPosition,
            letterSize,
            spacing
        );

        this.textList.push({
            handler: textHandler,
            group: textGroup,
            options: {
                letterSize: letterSize,
                spacing: spacing,
            },
        });

        this.obj.add(textGroup);
    }

    /**
     * @brief Updates the text at the specified index with new content.
     * @param {number} index - The index of the text to be updated.
     * @param {string} newText - The new content for the text.
     */
    updateText(index, newText) {
        if (index >= 0 && index < this.textList.length) {
            const textInfo = this.textList[index];

            textDisplayHelper.updateText(
                this.obj,
                textInfo.handler,
                newText,
                textInfo.options.letterSize,
                textInfo.options.spacing
            );
        }
    }

    /**
     * @brief Renders the outdoors using the configured renderer and camera.
     */
    render() {
        this.renderer.render(this.scene, this.camera);
    }
}

export { Outdoor };
