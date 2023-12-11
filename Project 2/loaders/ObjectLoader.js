/**
 * @file ObjectLoader.js
 * @desc Provides functions to load and set up objescts on the scene (nodes, lods, primitives, lights, etc).
 */

import * as THREE from 'three';
import { SceneObject } from '../objects/SceneObject.js';
import { nurbsGenerator } from '../utils/NurbSurfaceUtils.js';
import { lightLoader } from './LightLoader.js';
import { materialLoader } from './MaterialLoader.js';
import { Triangle } from '../objects/Triangle.js';
import { Polygon } from '../objects/Polygon.js';

/**
 * Provides functions to load and set up objects in the scene.
 * @namespace objectLoader
 */
export const objectLoader = {

  allObjects: {}, // Add allObjects property to store loaded objects
  materialMap: {},

  /**
   * @method
   * Load objects based on an object containing object data.
   * @param {Object} objectData - Object with information to load the objects.
   * @param {string} rootId - The ID of the root object.
   * @param {THREE.Object3D} MainNode - A map of materials.
   * @returns {THREE.Object3D} Main node to add to the other objects
   */
  load(objectData, rootId, materialMap) {
    this.allObjects = {};
    this.materialMap = materialMap;
    const rootNode = objectData[rootId];
    return this.parseNode(rootNode);
  },

  /**
   * @method
   * Create a primitive object based on primitive data.
   * @param {Object} primitive - Primitive data.
   * @param {String} materialID - material to be applied.
   * @param {Boolean} castShadow - if primitive casts shodows onto other object
   * @param {Boolean} receiveShadow - if primitive receives shadows from other objects
   * @returns {THREE.Mesh} A primitive object.
   */
  createPrimitive(primitive, materialId, castShadow =false, receiveShadow=false) {
    let objPrimitive;
    let parameters = primitive.representations[0];
    let material;
    let materialData;
    
    if (materialId === "defaultMaterial") {
      const randomHexColor = 0xFFFFFF;
      material = new THREE.MeshPhongMaterial({
        color: randomHexColor,
      });
    } else {
      materialData = this.materialMap.get(materialId);
    }

    switch (primitive.subtype) {
      case 'rectangle':
        objPrimitive = this.getRectangle(parameters, materialData, material);
        break;
      case 'triangle':
        objPrimitive = this.getTriangle(parameters, materialData, material);
        break;
      case 'cylinder':
        objPrimitive = this.getCylinder(parameters, materialData);      
        break;
      case 'box':
        objPrimitive = this.getBox(parameters, materialData);
        break;
      case 'nurbs':
        objPrimitive = this.getNurbs(parameters, materialData, material);
        break;
      case 'sphere':
        objPrimitive = this.getSphere(parameters, materialData, material); 
        break;
      case 'polygon':     
        objPrimitive = this.getPolygon(parameters, material);
        break;
      default:
        return;
    }

    objPrimitive.castShadow = castShadow;
    objPrimitive.receiveShadow = receiveShadow;
    objPrimitive.name = primitive.subtype + "_obj";
    return objPrimitive;
  },

  /**
   * @method
   * Parse a node and its children to create a hierarchical object structure.
   * @desc It uses a stack to go throught all the nodes, when it is looking at a nodes it goes throught its children and either adds them to the stacks (if node or lod),
   * or create an object if primitive or light.
   * @param {Object} node - The node to parse.
   * @returns {SceneObject} The parsed object structure.
   */
  parseNode(node) {
    const stack = [];
    const allObjects = {};

    const rootObject = new SceneObject(node.id);
    const rootCastShadow = node.castShadows ? node.castShadows : false;
    const rootReceiveShadow = node.receiveShadows ? node.receiveShadows : false;
    stack.push({ node, object: rootObject, currentMaterials: node.materialIds, castShadow: rootCastShadow, receiveShadow: rootReceiveShadow, dist: 0 });
  
    while (stack.length > 0) {
      let { node: treeNode, object, currentMaterials, castShadow, receiveShadow, dist } = stack.pop();
      const returnedObject = treeNode.type === "lod" ?  new THREE.LOD() : new SceneObject(treeNode.id);
      let newMaterials = this.getMaterials(treeNode, currentMaterials);
      
      if(treeNode.castShadows) castShadow = true;
      if(treeNode.receiveShadows) receiveShadow =true;
      
      for(const key in treeNode.children) {
        const child = treeNode.children[key];

        const granpaName = object.name.replace(/_obj|_lod/g, '_');
        const parentName = granpaName + returnedObject.name.replace(/_obj|_lod/g, '_');
        
        if (child.type === "primitive"){
          const primitive = this.createPrimitive(child, newMaterials[1], castShadow, receiveShadow);
          primitive.name = parentName + "_" + primitive.name;
          primitive.name = primitive.name.replace(/^scene(?=scene)/, '');
          returnedObject.add(primitive); //create primitive
        }
        else if (["pointlight", "spotlight", "directionallight"].includes(child.type)) {
          const light = lightLoader.load(child);
          light.name = parentName + "_" + light.name;
          light.name = light.name.replace(/^scene(?=scene)/, '');
          light.children[0].name = light.name + light.children[0].name;
          returnedObject.add(light); //create light
        }
        else { // nodes or lods
          const objectChild = allObjects[child.id];
          if (objectChild) {
            const clonedChild = objectChild.clone();
            this.updateCloneNames(clonedChild, parentName);
            returnedObject.add(clonedChild); // clone node
          } else if(returnedObject.isLOD){
            stack.push({ node: child.node, object: returnedObject, currentMaterials: newMaterials[0], castShadow, receiveShadow, dist: child.mindist}); //create node with distance
          } else {
            stack.push({ node: child, object: returnedObject, currentMaterials: newMaterials[0], castShadow, receiveShadow, dist: 0}); //create node without distance
          }
        }
      }
      
      // transformations
      let finalObj = this.transform(returnedObject, treeNode.transformations);
      
      // Change name to put info about object
      const parentName = object.name.replace(/_obj|_lod/g, '_');
      finalObj.name = parentName + finalObj.name + (finalObj.isLOD ? "_lod" : "_obj");
      finalObj.name = finalObj.name.replace(/^scene(?=scene)/, '');
      if (object.isLOD) object.addLevel(finalObj, dist);
      else object.add(finalObj);

      allObjects[treeNode.id] = finalObj;
    }
  
    return rootObject;
  },
  
  /**
   * Applies transformations to the given object based on the provided transformation parameters.
   *
   * @param {THREE.Object3D} object - The 3D object to be transformed.
   * @param {Object} transformations - Transformation parameters.
   * @returns {void}
  */
  transform: function(object, transformations) {
    const matrix = new THREE.Matrix4();
  
    for (const key in transformations) {
      let transformation = transformations[key];
  
      switch (transformation.type) {
        case 'R':
          // Create a rotation matrix
          const rotationMatrix = new THREE.Matrix4();
          rotationMatrix.makeRotationFromEuler(
            new THREE.Euler(
              transformation.rotation[0],
              0,
              0,
              'XYZ'
            )
          );
          matrix.multiply(rotationMatrix);
          rotationMatrix.makeRotationFromEuler(
            new THREE.Euler(
              0,
              transformation.rotation[1],
              0,
              'XYZ'
            )
          );
          matrix.multiply(rotationMatrix);
          rotationMatrix.makeRotationFromEuler(
            new THREE.Euler(
              0,
              0,
              transformation.rotation[2],
              'XYZ'
            )
          );
          // Multiply the rotation matrix with the object's matrix
          matrix.multiply(rotationMatrix);
          break;
        case 'T':
          // Create a translation matrix
          const translationMatrix = new THREE.Matrix4();
          translationMatrix.makeTranslation(
            transformation.translate[0],
            transformation.translate[1],
            transformation.translate[2]
          );
          // Multiply the translation matrix with the object's matrix
          matrix.multiply(translationMatrix);
          break;
        case 'S':
          // Create a scale matrix
          const scaleMatrix = new THREE.Matrix4();
          scaleMatrix.makeScale(
            transformation.scale[0],
            transformation.scale[1],
            transformation.scale[2]
          );
          // Multiply the scale matrix with the object's matrix
          matrix.multiply(scaleMatrix);
          break;
        default:
          break;
      }
    }

    object.applyMatrix4(matrix);
    return object;
  },

  /**
   * Retrieves the list of materials associated with a node and returns the material IDs.
   *
   * @param {Object} node - The node containing material information.
   * @param {Array} materialList - The list of available materials.
   * @returns {[Array, string]} - An array containing the material IDs and the default material ID.
  */
  getMaterials: function (node, materialList) {

      if ((typeof node.materialIds) === "undefined" || 
           node.materialIds.length === 0) {
        if (materialList.length === 0){
          return [materialList, "defaultMaterial"];
        }
        return [materialList, materialList[0]];
      }
      return [node.materialIds, node.materialIds[0]];
  },

  /**
   * Updates the names of cloned objects and their descendants based on the new father's name.
   *
   * @param {THREE.Object3D} cloneChild - The cloned object whose name needs to be updated.
   * @param {string} newFatherName - The new name of the father object.
   * @returns {void}
  */
  updateCloneNames: function(cloneChild, newFatherName) {
    const secondToLastUnderscoreIndex = cloneChild.name.lastIndexOf('_', cloneChild.name.lastIndexOf('_')-1);
    const relevantName = cloneChild.name.substring(secondToLastUnderscoreIndex);
    cloneChild.name = newFatherName + relevantName;
    cloneChild.traverse( item => {
      if(item.name === cloneChild.name) return;
      let parentName = item.parent.name.replace(/_obj|_lod/g, '_');
      let indexPos= item.name.lastIndexOf('_', item.name.lastIndexOf('_')-1);
      let impPart = item.name.substring(indexPos);
      item.name = parentName + impPart;
    })
  },

  /**
   * Generates a rectangle mesh based on the provided parameters.
   *
   * @param {Object} parameters - Rectangle parameters.
   * @param {Array} parameters.xy1 - Coordinates of the first corner.
   * @param {Array} parameters.xy2 - Coordinates of the second corner.
   * @param {number} parameters.parts_x - Number of parts along the x-axis.
   * @param {number} parameters.parts_y - Number of parts along the y-axis.
   * @param {Object} materialData - Material data for creating the material.
   * @param {THREE.Material} material - Optional material to use.
   * @returns {THREE.Mesh} - The generated rectangle mesh.
  */
  getRectangle: function(parameters, materialData, material) {
    let width =  Math.abs(parameters.xy2[0] - parameters.xy1[0]);
    let height = Math.abs(parameters.xy2[1] - parameters.xy1[1]);

    if (materialData)
      material = materialLoader.create(materialData, width, height);

    let objGeometry = new THREE.PlaneGeometry(
      width,
      height,
      parameters.parts_x,
      parameters.parts_y
    );

    let objPrimitive = new THREE.Mesh(objGeometry, material);
    objPrimitive.position.x = (parameters.xy2[0] + parameters.xy1[0])/2;
    objPrimitive.position.y = (parameters.xy2[1] + parameters.xy1[1])/2;

    return objPrimitive;
  },

  /**
   * Generates a triangle mesh based on the provided parameters.
   *
   * @param {Object} parameters - Triangle parameters.
   * @param {Array} parameters.xyz1 - Coordinates of the first vertex.
   * @param {Array} parameters.xyz2 - Coordinates of the second vertex.
   * @param {Array} parameters.xyz3 - Coordinates of the third vertex.
   * @param {Object} materialData - Material data for creating the material.
   * @param {THREE.Material} material - Optional material to use.
   * @returns {THREE.Mesh} - The generated triangle mesh.
  */
  getTriangle: function(parameters, materialData, material) {
    const p1 = new THREE.Vector3(... parameters.xyz1);
    const p2 = new THREE.Vector3(... parameters.xyz2);
    const p3 = new THREE.Vector3(... parameters.xyz3);
    const width = p1.distanceTo(p2);
    const a = p1.distanceTo(p2);
    const b = p2.distanceTo(p3);
    const c = p3.distanceTo(p1);
    const s = 0.5 * (a + b + c);
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    const height = 2*area / width;
    if (materialData)
      material = materialLoader.create(materialData, width, height);
    
    const objGeometry = new Triangle([parameters.xyz1,parameters.xyz2,parameters.xyz3], width, height);
    const objPrimitive = new THREE.Mesh(objGeometry, material);
    
    return objPrimitive;
  },

  /**
   * Generates a cylinder mesh based on the provided parameters.
   *
   * @param {Object} parameters - Cylinder parameters.
   * @param {number} parameters.top - Radius of the top of the cylinder.
   * @param {number} parameters.base - Radius of the base of the cylinder.
   * @param {number} parameters.height - Height of the cylinder.
   * @param {number} parameters.slices - Number of slices around the cylinder.
   * @param {number} parameters.stacks - Number of stacks along the height of the cylinder.
   * @param {boolean} parameters.capsclose - Whether to close the cylinder caps.
   * @param {number} parameters.thetastart - Starting angle for the cylinder.
   * @param {number} parameters.thetalength - Angular length of the cylinder.
   * @param {Object} materialData - Material data for creating the material.
   * @returns {THREE.Mesh} - The generated cylinder mesh.
  */
  getCylinder: function(parameters, materialData) {
    const faceMaterials = [];
    if (materialData) {
    
      const dimensions = [
        [2* Math.PI * ((parameters.top + parameters.base) / 2), parameters.height],
        [2*parameters.top, 2*parameters.top],
        [2*parameters.bottom, 2*parameters.bottom],  
      ];
          
      for (const dimension of dimensions) {
        const faceMaterial = materialLoader.create(materialData, dimension[0], dimension[1]);
        faceMaterials.push(faceMaterial);
      }
    }

    const cylinderGeometry = new THREE.CylinderGeometry(
      parameters.top, parameters.base,
      parameters.height, parameters.slices,
      parameters.stacks, !parameters.capsclose,
      parameters.thetastart, parameters.thetalength
    );
      
    const objPrimitive = new THREE.Mesh(cylinderGeometry, faceMaterials);
    return objPrimitive; 
  },
  
  /**
   * Generates a box mesh based on the provided parameters.
   *
   * @param {Object} parameters - Box parameters.
   * @param {Array} parameters.xyz1 - Coordinates of one corner of the box.
   * @param {Array} parameters.xyz2 - Coordinates of the opposite corner of the box.
   * @param {Object} materialData - Material data for creating the material.
   * @returns {THREE.Mesh} - The generated box mesh.
  */
  getBox: function(parameters, materialData) {
    const width = Math.abs(parameters.xyz2[0] - parameters.xyz1[0]);
    const height = Math.abs(parameters.xyz2[1] - parameters.xyz1[1]);
    const depth = Math.abs(parameters.xyz2[2] - parameters.xyz1[2]);
    const faceMaterials = [];

    if (materialData) {
      const faceDimensions = [
        [depth, height],
        [depth, height],
        [width, depth],
        [width, depth],
        [width, height ],
        [width, height],
      ];
    
      for (const dimension of faceDimensions) {
        const faceMaterial = materialLoader.create(materialData, dimension[0], dimension[1]);
        faceMaterials.push(faceMaterial);
      }
    }
  
    const positionX = (parameters.xyz2[0] + parameters.xyz1[0]) / 2;
    const positionY = (parameters.xyz2[1] + parameters.xyz1[1]) / 2;
    const positionZ = (parameters.xyz2[2] + parameters.xyz1[2]) / 2;
  
    const objGeometry = new THREE.BoxGeometry(width, height, depth);
    const objPrimitive = new THREE.Mesh(objGeometry, faceMaterials);
    objPrimitive.position.set(positionX, positionY, positionZ);

    return objPrimitive;
  },

  /**
   * Generates a NURBS surface mesh based on the provided parameters.
   *
   * @param {Object} parameters - NURBS parameters.
   * @param {Object} materialData - Material data for creating the material.
   * @param {THREE.Material} material - Optional material to use.
   * @returns {THREE.Mesh} - The generated NURBS mesh.
  */
  getNurbs: function (parameters, materialData, material) { 
    
    if (materialData){

      const points = parameters.controlpoints;
      const findMinMax = points.reduce((res, {xx,yy,zz}) => ({
        minX: Math.min(res.minX, xx),
        minY: Math.min(res.minY, yy),
        minZ: Math.min(res.minZ, zz),
        maxX: Math.max(res.maxX, xx),
        maxY: Math.max(res.maxY, yy),
        maxZ: Math.max(res.maxZ, zz),
      }), { minX: Infinity, minY: Infinity, minZ: Infinity, maxX: -Infinity, maxY: -Infinity, maxZ: -Infinity });
      
      const ranges = {
        xx: findMinMax.maxX - findMinMax.minX,
        yy: findMinMax.maxY - findMinMax.minY,
        zz: findMinMax.maxZ - findMinMax.minZ,
      };

      const width = ranges.xx;
      const height = ranges.yy;
      material = materialLoader.create(materialData, width, height);
    }
    return nurbsGenerator.parseNurbs(parameters, material);
  },

  /**
   * Generates a sphere mesh based on the provided parameters.
   * 
   * @param {Object} parameters - Sphere parameters.
   * @param {number} parameters.radius - Radius of the sphere.
   * @param {number} parameters.slices - Number of slices around the sphere.
   * @param {number} parameters.stacks - Number of stacks along the height of the sphere.
   * @param {Object} materialData - Material data for creating the material.
   * @param {THREE.Material} material - Optional material to use.
   * @returns {THREE.Mesh} - The generated sphere mesh.
  */
  getSphere: function (parameters, materialData, material) {

    const radius = parameters.radius;
    const widthSegments = parameters.slices;
    const heightSegments = parameters.stacks;
    const phiStart = parameters.phistart ?? 0;
    const phiLength = parameters.philength ?? Math.PI * 2;
    const thetaStart = parameters.thetastart ?? 0;
    const thetaLength = parameters.thetalength ?? Math.PI;

    if (materialData) {
      material = materialLoader.create(materialData, 2*Math.PI*radius, 2*Math.PI*radius);
    }

    const objGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength);
    const objPrimitive = new THREE.Mesh(objGeometry, material);

    return objPrimitive;
  },

  /**
   * Generates a polygon mesh based on the provided parameters.
   * 
   * @param {Object} parameters - Polygon parameters.
   * @param {number} parameters.radius - Radius of the polygon.
   * @param {number} parameters.stacks - Number of stacks along the height of the polygon.
   * @param {number} parameters.slices - Number of slices around the polygon.
   * @param {number} parameters.color_c - Color for the center of the polygon.
   * @param {number} parameters.color_p - Color for the perimeter of the polygon.
   * @returns {THREE.Mesh} - The generated polygon mesh.
  */
  getPolygon: function (parameters) {
    const polygon = new Polygon(parameters.radius,parameters.stacks,parameters.slices,parameters.color_c, parameters.color_p);
    const material = new THREE.MeshBasicMaterial( {
      color: 0xffffff, side: THREE.DoubleSide, vertexColors: true, transparent: false
    });
    return new THREE.Mesh(polygon, material);
  }
}
