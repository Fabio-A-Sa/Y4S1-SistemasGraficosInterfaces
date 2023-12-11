/**
 * @file Painting.js
 * @class Painting
 * @extends SceneObject
 * @desc Representation simple painting constituting of a frame and a plane for the painting itself.
 */

import * as THREE from 'three';
import { SceneObject } from './SceneObject.js';
import { ShadowHelper } from '../utils/ShadowUtils.js';

/**
 * @class
 * @classdesc Representation of a simple painting with a frame.
 */
class Painting extends SceneObject{
    
    /**
     * Constructs a Painting object representing a painting
     * @constructor
     * @param {String} name - name of the object
     * @param {number} x - The x-coordinate of the painting's position.
     * @param {number} y - The y-coordinate of the painting's position.
     * @param {number} z - The z-coordinate of the painting's position.
     * @param {number} ang - The initial angle of the painting.
     * @param {Object} windowSize - The size of the painting's visible area (default is { width: 2, height: 2 }).
     * @param {number} frameSize - The size of the painting's frame (default is 0.1) not counting the middle of the painting.
     */
    constructor(name, x, y, z, ang, windowSize = { width: 2, height: 2 }, frameSize = 0.1) {
        super(name, x, y, z, ang);
        this.windowSize = windowSize;
        this.frameSize = frameSize;

        // Initialize the plane mesh as null
        this.paintingCanvas = null;
    }

    /**
     * Build the painting object.
     * @method
     */
    build() {

        // Create the painting frame geometry
        const frameGeometryHorizontal = new THREE.BoxGeometry(
            this.windowSize.width + 2 * this.frameSize,
            this.frameSize,
            this.frameSize
        );
        const frameGeometryVertical = new THREE.BoxGeometry(
            this.frameSize,
            this.windowSize.height + 2 * this.frameSize,
            this.frameSize
        );

        const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,   
            roughness: 0.9,        
            metalness: 0,        
            normalScale: new THREE.Vector2(1, 1),

        });

        // Create painting frame parts
        const paintingFrameTop = new THREE.Mesh(frameGeometryHorizontal, frameMaterial);
        const paintingFrameBottom = new THREE.Mesh(frameGeometryHorizontal, frameMaterial);
        const paintingFrameLeft = new THREE.Mesh(frameGeometryVertical, frameMaterial);
        const paintingFrameRight = new THREE.Mesh(frameGeometryVertical, frameMaterial);
        ShadowHelper.setShadow(paintingFrameRight);
        ShadowHelper.setShadow(paintingFrameTop);
        ShadowHelper.setShadow(paintingFrameBottom);
        ShadowHelper.setShadow(paintingFrameLeft);

        // Position the painting frame parts relative to the painting's initial position
        const frameOffset = this.frameSize / 2;
        paintingFrameTop.position.set(
            0,
            this.windowSize.height / 2 + frameOffset,
            0
        );
        paintingFrameBottom.position.set(
            0,
            -this.windowSize.height / 2 - frameOffset,
            0
        );
        paintingFrameLeft.position.set(
            -this.windowSize.width / 2 - frameOffset,
            0,
            0
        );
        paintingFrameRight.position.set(
            this.windowSize.width / 2 + frameOffset,
            0,
            0
        );

        // Create the painting area geometry (plane)
        const canvasGeometry = new THREE.PlaneGeometry(
            this.windowSize.width,
            this.windowSize.height
        );
        const canvasMaterial = new THREE.MeshBasicMaterial({ color: 0xadd8e6 });
        
        // Position the painting area within the frame
        const canvasPosition = {
            x: 0,    //
            y: 0,    // Relative to the painting's initial position
            z: 0.01  // 
        };

        // Add painting components to the group
        this.sceneObject.add(paintingFrameTop, paintingFrameBottom, paintingFrameLeft, paintingFrameRight);

        // Create paintingCanvas and add it separately due to different material
        this.paintingCanvas = new THREE.Mesh(canvasGeometry, canvasMaterial);
        ShadowHelper.setShadow(this.paintingCanvas);
        this.sceneObject.add(this.paintingCanvas);
        this.paintingCanvas.position.set(canvasPosition.x, canvasPosition.y, canvasPosition.z);
    }

    /**
     * Update the material of the surface.
     * @method
     * @param {THREE.Material} newMaterial - The new material to apply to the surface.
     */
    updatePainting(newCanvas) {
        this.paintingCanvas.material = newCanvas;
    }
}

export { Painting };
