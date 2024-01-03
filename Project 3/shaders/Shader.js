/**
 * @file Shader.js
 * @class Shader
 */

import * as THREE from 'three';

/**
 * @class
 * @classdesc Represents a shader in threejs
 */
class Shader {

    /**
     * Shader constructor
     * @constructor
     * @param {String} file - The file (.vert && .frag) to select
     * @param {Object} parameters - Initial shaders parameters
     */
    constructor(file, parameters) {
        this.read(`./shaders/${file}.vert`, true);
        this.read(`./shaders/${file}.frag`, false);
        this.uniformValues = parameters;
        this.material = null;
    }

    /**
     * Reads a shader file and stores it in the class instance.
     * @param {String} fileName - The name of the shader file.
     * @param {Boolean} isVertex - Indicates whether the shader is a vertex shader (true) or a fragment shader (false).
     */
    read(fileName, isVertex) {
        const xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                isVertex 
                    ? this.vertexShader = xmlhttp.responseText 
                    : this.fragmentShader = xmlhttp.responseText;
                this.buildShader.bind(this)();
            }
        }
        xmlhttp.open("GET", fileName, true);
        xmlhttp.send();
    }

    /**
     * Builds a Three.js ShaderMaterial using stored shaders and uniform values.
     */
    buildShader() {
        if (this.vertexShader !== undefined && this.fragmentShader !== undefined) {
            this.material = new THREE.ShaderMaterial({
                uniforms: (this.uniformValues !== null ? this.uniformValues : {}),
                vertexShader: this.vertexShader,
                fragmentShader: this.fragmentShader,
            });
        }
    }

    /**
     * Checks if a uniform with the specified key exists.
     * @param {String} key - The key of the uniform to check.
     * @returns {Boolean} - Returns true if the uniform exists, false otherwise.
     */
    hasUniform(key) {
        return this.uniformValues[key] !== undefined
    }

    /**
     * Updates the value of a specific uniform in the Three.js material.
     * @param {String} type - The key of the uniform to update.
     * @param {*} value - The new value for the uniform.
     */
    update(type, value) {
        if (this.hasUniform(type)) {
            this.uniformValues[type].value = value
            this.material.uniforms[type].value = value
        }
    }
}

export { Shader };