/**
 * @file rotationUtils.js
 * @desc Provides functions to aux the roptation of points in a 3d space with arbitrary parameters
 */

/**
 * @namespace rotationHelper
 */
export const rotationHelper = {

    /**
     * Rotate a point around an axis in 3D space.
     * @method
     * @param {Array} point - The point to be rotated [x, y, z].
     * @param {Array} axisOrigin - The origin of the rotation axis [x, y, z].
     * @param {Array} axisDirection - The direction vector of the rotation axis [x, y, z].
     * @param {number} angleInRadians - The angle of rotation in radians.
     * @returns {Array} The rotated point.
     */
    rotatePointAroundAxis: function rotatePointAroundAxis(point, axisOrigin, axisDirection, angleInRadians) {
        // Translate the point and axis to the origin
        const translatedPoint = [
            point[0] - axisOrigin[0],
            point[1] - axisOrigin[1],
            point[2] - axisOrigin[2]
        ];

        // Calculate the length of the axis direction vector
        const axisLength = Math.sqrt(
            axisDirection[0] * axisDirection[0] +
            axisDirection[1] * axisDirection[1] +
            axisDirection[2] * axisDirection[2]
        );

        // Normalize the axis direction vector
        const normalizedAxisDirection = [
            axisDirection[0] / axisLength,
            axisDirection[1] / axisLength,
            axisDirection[2] / axisLength
        ];

        // Calculate the rotation matrix
        const cosTheta = Math.cos(angleInRadians);
        const sinTheta = Math.sin(angleInRadians);
        const x = normalizedAxisDirection[0];
        const y = normalizedAxisDirection[1];
        const z = normalizedAxisDirection[2];
        const rotationMatrix = [
            [cosTheta + (1 - cosTheta) * x * x, (1 - cosTheta) * x * y - sinTheta * z, (1 - cosTheta) * x * z + sinTheta * y],
            [(1 - cosTheta) * y * x + sinTheta * z, cosTheta + (1 - cosTheta) * y * y, (1 - cosTheta) * y * z - sinTheta * x],
            [(1 - cosTheta) * z * x - sinTheta * y, (1 - cosTheta) * z * y + sinTheta * x, cosTheta + (1 - cosTheta) * z * z]
        ];

        // Apply the rotation to the translated point
        const rotatedPoint = [
            rotationMatrix[0][0] * translatedPoint[0] + rotationMatrix[0][1] * translatedPoint[1] + rotationMatrix[0][2] * translatedPoint[2],
            rotationMatrix[1][0] * translatedPoint[0] + rotationMatrix[1][1] * translatedPoint[1] + rotationMatrix[1][2] * translatedPoint[2],
            rotationMatrix[2][0] * translatedPoint[0] + rotationMatrix[2][1] * translatedPoint[1] + rotationMatrix[2][2] * translatedPoint[2]
        ];

        // Translate the rotated point back to the original position
        const finalPoint = [
            rotatedPoint[0] + axisOrigin[0],
            rotatedPoint[1] + axisOrigin[1],
            rotatedPoint[2] + axisOrigin[2]
        ];

        return finalPoint;
    }
}
