/**
 * @file TextureLoader.js
 * @desc Provides functions to get information about textures.
 */

import * as THREE from 'three';

/**
 * @namespace textureLoaderC
 */
export const textureLoaderC = {

  /**
   * Load textures based on an object containing texture data.
   * @method
   * @param {Object} textureData - Object with information to load the textures.
   * @returns {Map<string, THREE.Texture>} A map of loaded textures, where keys are texture IDs.
   */
  getTexPaths: function (textureData) {

    /**
     * Map to store texture information.
     * @type {Map<string, Object>}
     */
    const textureMap = new Map();

    for (const key in textureData) {
      const data = textureData[key];
      const textureId = data.id;
      const textureFilePath = data.filepath;
      const isVideo = data.isVideo || false;
      const anisotropy = data.anisotropy || 1;
      const mipmaps = new Map();

      for (let i = 0; i <= 7; i++) {
        const mipmap = data[`mipmap${i}`];

        if (mipmap) {
          mipmaps.set(i, mipmap);
        } else {
          break;
        }
      }

      textureMap.set(textureId, {
        id: textureId,
        filepath: textureFilePath,
        isVideo: isVideo,
        anisotropy: anisotropy,
        mipmaps: mipmaps.size ? mipmaps : null,
      });
    }

    return textureMap;
  },

  /**
   * Create a THREE.Texture object based on texture information.
   * @method
   * @param {Object} textureInfo - Texture information from the textureMap.
   * @returns {THREE.Texture} The created texture object.
   */
  create: function (textureInfo) {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(textureInfo.filepath);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(textureInfo.snum || 1, textureInfo.tnum || 1);
    return texture;
  },

  /**
   * Load an image and create a mipmap to be added to a texture at the defined level
   * @method
   * @param {THREE.Texture} parentTexture the texture to which the mipmap is added
   * @param {number} level the level of the mipmap
   * @param {string} path the path for the mipmap image
   */
  loadMipmap: function (parentTexture, level, path) {

    new THREE.TextureLoader().load(
      path,
      function (mipmapTexture) {

        /**
         * Canvas for drawing the mipmap image.
         * @type {HTMLCanvasElement}
         */
        const canvas = document.createElement('canvas');

        /**
         * 2D context of the canvas.
         * @type {CanvasRenderingContext2D}
         */
        const ctx = canvas.getContext('2d');

        ctx.scale(1, 1);
              
        const img = mipmapTexture.image;         
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0 );
                           
        // set the mipmap image in the parent texture in the appropriate level
        parentTexture.mipmaps[level] = canvas
      },
      undefined,
      function(err) {
        console.error('Unable to load the image ' + path + ' as mipmap level ' + level + ".", err);
      }
    );
  }
};
