/**
 * @file MaterialLoader.js
 * @desc Provides functions to load and set up materials.
 */

import * as THREE from 'three';
import { textureLoaderC } from './TextureLoaderC.js';

/**
 * @namespace materialLoader
 */
export const materialLoader = {

  /**
   * Load materials based on an object containing material data.
   * @method
   * @param {Object} materialData - Object with information to load the materials.
   * @param {Map<string, Map<string, string>>} textureMap - Map of loaded textures to use in materials.
   * @returns {Map<string, Map<string, string>>} A map of loaded materials information, where keys are material IDs.
   */
  getMatDetails: function (materialData, textureMap) {
    
    /**
     * A map to store loaded materials information.
     * @type {Map<string, Map<string, string>>}
     */
    const materialMap = new Map();

    for (const key in materialData) {
      const data = materialData[key];
      let material = new Map();

      // Set common material properties
      material.set("color",data.color);
      material.set("specular",data.specular);
      material.set("shininess",data.shininess);
      material.set("emissive",data.emissive);
      material.set("wireframe",data.wireframe ?? false);
      material.set("shading",["none","flat","smooth"].includes(data.shading) ? data.shading : "smooth");
      material.set("twosided", data.twosided ?? false);
      material.set("castshadow", data.castshadow ?? false);

      // Apply the texture if available
      if (textureMap.has(data.textureref)) {
        const textureInfo = textureMap.get(data.textureref);
        material.set("textureInfo", textureInfo);
        material.set("snum", data.texlength_s ?? 1);
        material.set("tnum", data.texlength_t ?? 1);
      }

      // Apply the bump texture if available
      if (textureMap.has(data.bumpref)) {
        const bumpInfo = textureMap.get(data.bumpref);
        material.set("bumpInfo", bumpInfo);
        material.set("bumpScale", data.bumpscale ?? 0);
      }

      // Apply specular if available
      if (textureMap.has(data.specularref)) {
        const specularInfo = textureMap.get(data.specularref);
        material.set("specularInfo", specularInfo);
      }

      materialMap.set(data.id, material);
    }
    return materialMap;
  },

  /**
   * Create a THREE.Material with texture.
   * @method
   * @param {Map<string, Object>} materialInfo - Material information from materialMap.
   * @param {number} sizeX - The width of the texture.
   * @param {number} sizeY - The height of the texture.
   * @returns {THREE.Material} The created material object.
   */
  create: function (materialInfo, sizeX = 1, sizeY = 1) {
    /**
     * The material object to be created and returned.
     * @type {THREE.Material}
     */
    let material;

    material = new THREE.MeshPhongMaterial();
    if (materialInfo.get('shading') === "flat") {
      material.flatShading = true;
    } else {
      material = new THREE.MeshStandardMaterial();
    }

    // Create and return the THREE.Material
    material = new THREE.MeshPhongMaterial({
      color: materialInfo.get("color"),
      specular: materialInfo.get("specular"),
      shininess: materialInfo.get("shininess"),
      emissive: materialInfo.get("emissive"),
      wireframe: materialInfo.get("wireframe"),
      side: materialInfo.get("twosided") ? THREE.DoubleSide : THREE.FrontSide,
      shadowSide: THREE.BackSide,
    });

    // Add texture if available
    const textureInfo = materialInfo.get("textureInfo");
    if (textureInfo) {
      
      const isVideo = textureInfo.filepath.endsWith('.mp4');

      if (!isVideo) {
        // Create a regular texture
        material.map = textureLoaderC.create(textureInfo);
      } else {
        // Create HTML to host the video
        const video = document.createElement('video');

        // Set video attributes
        video.id = textureInfo.id; 
        video.src = textureInfo.filepath;
        video.autoplay = true;
        video.loop = true; 
        video.muted = true;
        video.style.display = 'none';

        document.body.appendChild(video);
        material.map = new THREE.VideoTexture(video);
        material.map.colorSpace = THREE.SRGBColorSpace;
      }

      material.map.wrapS = THREE.RepeatWrapping;
      material.map.wrapT = THREE.RepeatWrapping;
      material.map.repeat.set(sizeX / materialInfo.get("snum") || 1, sizeY / materialInfo.get("tnum") || 1);
      material.map.needsUpdate = true;
 
      // Add mipmaps if available
      const mipmaps = textureInfo?.mipmaps;
      if (mipmaps) {

        // Manual mipmaps
        material.map.generateMipmaps = false;
        for (const key of mipmaps.keys()) {
          textureLoaderC.loadMipmap(material.map, key, mipmaps.get(key));
        }
      } else {

        // Automatic mipmaps
        material.map.generateMipmaps = true;
        material.map.minFilter = THREE.LinearMipMapLinearFilter;
        material.map.magFilter = THREE.NearestFilter;
      }
    }

    // Add bump texture if available
    if (materialInfo.has("bumpInfo")) {
      const bumpInfo = materialInfo.get("bumpInfo");
      material.bumpMap = textureLoaderC.create(bumpInfo);
      material.bumpMap.wrapS = THREE.RepeatWrapping;
      material.bumpMap.wrapT = THREE.RepeatWrapping;
      material.bumpMap.repeat.set(sizeX / materialInfo.get("snum") || 1, sizeY / materialInfo.get("tnum") || 1);
      material.bumpScale = materialInfo.get("bumpScale") ?? 0;
    }

    // Add specular texture if available
    if (materialInfo.has("specularInfo")) {
      const specularInfo = materialInfo.get("specularInfo");
      material.specularMap = textureLoaderC.create(specularInfo);
      material.specularMap.wrapS = THREE.RepeatWrapping;
      material.specularMap.wrapT = THREE.RepeatWrapping;
      material.specularMap.repeat.set(sizeX / materialInfo.get("snum") || 1, sizeY / materialInfo.get("tnum") || 1);
    }

    return material;
  },
};
