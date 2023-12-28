import * as THREE from 'three';
import { textDisplayHelper } from './utils/TextDisplayUtils.js';

/**
 * Represents a Heads-Up Display (HUD) in a 3D scene.
 * @class
 */
class HUD {
	
	/**
	 * Constructs a new HUD.
	 * @constructor
	 * @param {THREE.Scene} scene - The 3D scene to which the HUD is added.
	 * @param {THREE.Camera} camera - The camera used for rendering the HUD.
	 * @param {THREE.WebGLRenderer} renderer - The WebGL renderer for rendering.
	 */
	constructor(scene, camera, renderer) {
		/**
		 * The 3D scene to which the HUD is added.
		 * @type {THREE.Scene}
		 */
		this.scene = scene;

		/**
		 * The camera used for rendering the HUD.
		 * @type {THREE.Camera}
		 */
		this.camera = camera;

		/**
		 * The WebGL renderer for rendering the HUD.
		 * @type {THREE.WebGLRenderer}
		 */
		this.renderer = renderer;

		/**
		 * List of text elements in the HUD.
		 * @type {Array}
		 */
		this.textList = [];

		/**
		 * The camera for the secondary viewpoint.
		 * @type {null|THREE.PerspectiveCamera}
		 */
		this.viewPointCamera = null;

		/**
		 * The texture for the secondary viewpoint.
		 * @type {null|THREE.WebGLRenderTarget}
		 */
		this.viewpointTexture = null;

		/**
		 * The material for the secondary viewpoint.
		 * @type {null|THREE.Material}
		 */
		this.viewpointMaterial = null;

		/**
		 * The mesh for the secondary viewpoint.
		 * @type {null|THREE.Mesh}
		 */
		this.viewpointMesh = null;

		/**
		 * The size of the secondary viewpoint.
		 * @type {number}
		 */
		this.viewpointSize = 0.2;

		/**
		 * The render target for the secondary viewpoint.
		 * @type {THREE.WebGLRenderTarget}
		 */
		this.viewpointRenderTarget = new THREE.WebGLRenderTarget(
		window.innerWidth / 4, // Adjust the size of the render target
		window.innerHeight / 4,
		{ format: THREE.RGBAFormat }
		);
	}

	/**
	 * Adds a text element to the HUD.
	 * @param {string} text - The text content.
	 * @param {Object} options - Options for text display.
	 * @param {number} options.offsetX - X-axis offset.
	 * @param {number} options.offsetY - Y-axis offset.
	 * @param {number} options.letterSize - Size of each letter.
	 * @param {number} options.spacing - Spacing between letters.
	 */
	addText(text, options = { offsetX: 0, offsetY: 0, letterSize: 0.05, spacing: 0.02 }) {
		const textHandler = `hudText_${this.textList.length}`;
		const textPosition = new THREE.Vector3(-0.9 + options.offsetX, 0.9 + options.offsetY, -1);

		const textGroup = textDisplayHelper.createText(
		textHandler,
		text,
		textPosition,
		options.letterSize,
		options.spacing
		);

		this.textList.push({
		handler: textHandler,
		group: textGroup,
		options: options,
		});

		this.scene.add(textGroup);
	}

	/**
	 * Updates the text content at the specified index in the HUD.
	 * @param {number} index - The index of the text element.
	 * @param {string} newText - The new text content.
	 */
	updateText(index, newText) {
		if (index >= 0 && index < this.textList.length) {
		const textInfo = this.textList[index];
		textDisplayHelper.updateText(
			this.scene,
			textInfo.handler,
			newText,
			textInfo.options.letterSize,
			textInfo.options.spacing
		);
		}
	}

	/**
	 * Updates the position of all text elements in the HUD based on camera and renderer.
	 */
	updatePosition() {
		this.textList.forEach((textInfo) => {
		textDisplayHelper.updateTextPosition(
			this.scene,
			textInfo.handler,
			this.camera,
			this.renderer,
			textInfo.options.offsetX,
			textInfo.options.offsetY
		);
		});
	}

}

/**
 * Exports the HUD class.
 * @exports HUD
 */
export { HUD };
