/**
 * @file Cart.js
 * @class Cart
 */

import * as THREE from 'three';
import { SceneObject } from './SceneObject.js';
import { Particle } from './Particle.js';
import { states, gameConsts } from '../GameConfig.js';

/**
 * @class
 * @classdesc Represents a cart derived from the base SceneObject class.
 * @extends SceneObject
 */
class Cart extends SceneObject {
 
    /**
     * Constructs a cart object.
     * @constructor
     * @param {SceneObject} object - The object associated with the cart.
     * @param {Object} app - The application object.
    */
    constructor(object, app, name) {
        super(object.name);
        this.app = app;
        this.obj = object;
        this.name = name;
        this.orientation = 0;
        this.speed = 0;
        this.autonomous = false;
        this.move = false;
        this.obstacles = [];
        this.powerUps = [];
        this.opponent = null;
        this.configs = null;
        this.outOfRoad = false;
        this.initialPosition = this.obj.position.clone();
        this.initialRotation = this.obj.rotation.clone();
        this.racingCar = false;
        this.racingStarted = false;
        this.raceTime = null;

        // New property to track the passed route points
        this.checkPoints = null;
        this.lapCount = 0;
        this.nextPoint = 1;

        this.penaltyMultiplier = 1;
        this.penaltyTimeLeft = 0;
        this.powerUpMultiplier = 1;
        this.powerUpTimeLeft = 0;

        // For collision detection
        this.calculateLimit(this.obj);

        // Get wheels
        this.wheels = this.traverseObject(["wheel_front_left_cylinder", "wheel_front_right_cylinder", "wheel_back_left_cylinder", "wheel_back_right_cylinder"]);
        this.frontWheels = this.wheels.slice(2, 4);

        // Smoke particle system
        this.setSmoke();
    }

    /**
     * Sets configuration settings for the cart.
     * @method
     * @param {Object} configs - The configuration settings for the cart.
     */
    setConfig(configs) {
        this.configs = configs;
        this.lapCount = 0;
        this.racingStarted = true;
    }

    /**
     * Sets a predefined route for the autonomous cart.
     * @method
     * @param {Object} route - The predefined route for the autonomous cart.
     */
    setRoute(route) {
        this.route = route;
        this.autonomous = true;
        this.speed = this.configs.max_velocity;
    }

    /**
     * Sets a road for the manual cart
     * @method
     * @param {Object} road - The predefined road for the manual cart.
     */
    setRoad(road) {
        this.road = road;
    }

    /**
     * Sets the camera associated with the cart.
     * @method
     * @param {THREE.PerspectiveCamera} camera - The camera associated with the cart.
     */
    setCamera(camera) {
        this.camera = camera;
    }

    /**
     * Sets obstacles in the cart's path.
     * @method
     * @param {Array<Obstacle>} obstacles - Array of obstacles in the cart's path.
     */
    setObstacles(obstacles) {
        this.obstacles = obstacles;
    }

    /**
     * Sets power-ups in the cart's path.
     * @method
     * @param {Array<PowerUp>} powerUps - Array of power-ups in the cart's path.
     */
    setPowerUps(powerUps) {
        this.powerUps = powerUps;
    }

    /**
     * Sets the opponent cart.
     * @method
     * @param {Cart} opponent - The opponent cart.
     */
    setOpponent(opponent) {
        this.opponent = opponent;
    }

    /**
     * Set exhaust and smoke properties
     * @method
     */
    setSmoke() {
        this.exhausts = this.traverseObject(["gas_exhaust1_obj", "gas_exhaust2_obj"]);
        for (const exhaust of this.exhausts) {
            exhaust.particles = [];
            exhaust.distance = 0.3;
        }
        this.exhausts[0].orientation = Math.PI / 10;
        this.exhausts[1].orientation = - Math.PI / 10;
    }

    /**
     * Initiates the cart's motion.
     * @method
     */
    play() {
        if (this.route) this.route.play();
        this.move = true;
    }

    /**
     * Stops the cart's motion.
     * @method
     */
    stop() {
        if (this.route) this.route.stop();
        this.move = false;
    }

    /**
     * Turns the cart by a specified value.
     * @method
     * @param {Number} value - The value by which to turn the cart.
     */
    turn(value) {
        if (this.move) {
            this.orientation += value;
            this.obj.rotation.y = this.orientation;
        }
    }

    /**
     * Calculate final max velocity depending on powerUps and penalties
     */
    getMaxVelocity(){
        const outOfRoadSpeed = this.outOfRoad? 0.7 : 1;
        const finalPenaltySpeed = Math.min(outOfRoadSpeed, this.penaltyMultiplier);
        return this.configs.max_velocity * this.powerUpMultiplier * finalPenaltySpeed;
    }

    /**
     * Accelerates the cart's speed by a specified value.
     * @method
     * @param {Number} value - The value by which to change the cart's speed.
     */
    accelerate(value, delta) {
        if (this.move) {
            const acceleration = value * delta * 10;
            const newSpeed = this.speed + acceleration;
            this.speed = Math.max(-this.getMaxVelocity(), Math.min(newSpeed, this.getMaxVelocity()));
        }
    }

    /**
     * Decelerates the cart's speed by a specified value.
     * @method
     * @param {Number} value - The value by which to change the cart's speed.
     */
    decelerate(value, delta) {
        if (this.move) {
            const acceleration = value * delta * 10;
            const newSpeed = this.speed + acceleration;
            if(this.speed > 0) this.speed = Math.max(0, newSpeed);
            else if (this.speed < 0) this.speed = Math.min(0, newSpeed);
            else this.speed = newSpeed; //just in case
        }
    }

    /**
     * Calculates the point the cart is looking at based on its orientation.
     * @method
     * @returns {THREE.Vector3} - The point the cart is looking at.
     */
    calculateLookAt() {
        return new THREE.Vector3(
            this.obj.position.x + 2 * Math.sin(this.orientation),
            this.obj.position.y,
            this.obj.position.z + 2 * Math.cos(this.orientation)
        );
    }

    /**
     * Updates the cart's camera position and target.
     * @method
     */
    updateCamera() {
        const offsetX = 0.7 * Math.sin(this.orientation);
        const offsetZ = 0.7 * Math.cos(this.orientation);
        this.camera.position.set(this.obj.position.x -offsetX, this.obj.position.y + 1.3, this.obj.position.z - offsetZ);
        this.camera.userData.target = this.calculateLookAt();
        this.app.updateCameraTarget();
    }

    /**
     * Checks for collisions with obstacles in the cart's path.
     * @method
     */
    obstaclesColision() {
        for (const obstacle of this.obstacles) {
            const distance = this.getPosition().distanceTo(obstacle.getPosition());
            if ( (distance - this.limit - obstacle.limit <= 0) && obstacle.cooldown <= 0) {
                if(obstacle.type === "time"){
                    this.configs.raceTime += 5;
                } else if(obstacle.type === "speed"){
                    this.addPenalties();
                }
                obstacle.cooldown = gameConsts.obstacleCooldown;
                return;
            }
        }
    }

    /**
     * Checks for collisions with power-ups in the cart's path.
     * @method
     */
    powerUpsColision() {
        for (const powerup of this.powerUps) {
            const distance = this.getPosition().distanceTo(powerup.getPosition());
            if (distance - this.limit - powerup.limit <= 0 && powerup.cooldown <= 0) {
                if(powerup.type === "speed"){
                    this.addPowerUp();
                } else if(powerup.type == "obstacle"){
                    this.configs.gameState = states.chooseTrap;
                }
                powerup.cooldown = gameConsts.powerupCooldown;
                return;
            }
        }
    }

    /**
     * Calculates penalties for the car
     * @method
     */
    addPenalties(){
        this.penaltyMultiplier = this.configs.penaltyMultiplier;
        this.penaltyTimeLeft = this.configs.penaltyCooldown;
    }

    /**
     * Calculates powerups for the car
     * @method
     */
    addPowerUp(){
        this.powerUpMultiplier = this.configs.powerUpMultiplier;
        this.powerUpTimeLeft = this.configs.powerUpCooldown;
    }

    /**
     * Removes penalties and powerUps if they are no longer active
     * @method
     */
    cleanPenaltyAndPowerUp(){
        if(this.powerUpTimeLeft <= 0){
            this.powerUpTimeLeft = 0;
            this.powerUpMultiplier = 1;
        }
        if(this.penaltyTimeLeft <= 0){
            this.penaltyTimeLeft = 0;
            this.penaltyMultiplier = 1;
        }
    }

    /**
     * update penalties and powerUp timeleft
     * @method
     */
    updateMultipliersTimeLeft() {
        this.powerUpTimeLeft = Math.max(0, this.powerUpTimeLeft-1);
        this.penaltyTimeLeft = Math.max(0, this.penaltyTimeLeft-1);
    }

    /**
     * Calculates the powerups and multipliers timeleft and values
     */
    updateMultipliers() {
        //update cars timeleft for powerup and penalties
        this.updateMultipliersTimeLeft();
        this.cleanPenaltyAndPowerUp();
    }

    /**
     * Checks for collisions with the opponent cart.
     * @method
     */
    carColision() {
        const distance = this.getPosition().distanceTo(this.opponent.getPosition());
        if (distance - this.limit - this.opponent.limit <= 0) {
            this.addPenalties();
        }
    }

    /**
     * Checks for collisions with obstacles, power-ups, and the opponent cart.
     * @method
     */
    verifyColisions() {
        this.obstaclesColision();
        this.powerUpsColision();
        this.carColision();
    }

    /**
     * Checks if the cart is within the road boundaries.
     * @method
     */
    verifyRoad() {
        this.outOfRoad = this.road.has(this);
    }

    /**
     * Resets the object's position to its initial coordinates and sets the speed to zero.
     * @method
     */
    resetPosition() {
        ['W', 'S'].forEach(command => this.configs.keys[command] = false);
        this.obj.position.set(...this.initialPosition);
        this.speed = 0;
    }

    /**
     * Resets the object's rotation to the default rotation and sets the orientation to zero.
     * @method
     */
    resetRotation() {
        ['A', 'D'].forEach(command => this.configs.keys[command] = false);
        this.obj.rotation.y = 0;
        this.orientation = 0;
    }

    /**
     * Updates the cart's position and orientation based on user input or predefined route.
     * @method
     * @param {Number} delta - The delta time.
     */
    update(delta) {
        if(!this.racingStarted || !this.move) return;

        if (this.autonomous) {
            this.speed=0.5;
            this.route.update(delta);
            this.orientation = this.obj.rotation.y;

            // Update rotation
            this.obj.rotation.y = this.route.obj.rotation.y;

            // Update position
            this.obj.position.set(...this.route.obj.position);
        
        } else {

            // Velocity
            if (this.configs.keys['W']) {
                this.accelerate(this.configs.velocity_increment, delta);
            } else if (this.configs.keys['S']) {
                this.accelerate(-this.configs.velocity_increment, delta);
            } else if (this.speed > 0) {
                // Decelerate gradually when 'W' key is released
                this.decelerate(-this.configs.velocity_increment, delta);
            } else if (this.speed < 0) {
                // Decelerate gradually when 'S' key is released
                this.decelerate(this.configs.velocity_increment, delta);
            }

            // Rotation
            const angle = this.configs.angle_increment * delta;
            if (this.configs.keys['A']){
                if(Math.round(this.speed) !== 0) this.turn(angle);
                this.setAngleFrontWheels(Math.PI/6);
            } else if (this.configs.keys['D']){
                if(Math.round(this.speed) !== 0) this.turn(-angle);
                this.setAngleFrontWheels(-Math.PI/6);
            } else {
                this.setAngleFrontWheels(0);
            }

            // Calculate how much the car should move then calculate its new position
            const moveDistance = this.speed * delta;
            const newPosition = this.obj.position.clone();
            newPosition.x += moveDistance * Math.sin(this.orientation);
            newPosition.z += moveDistance * Math.cos(this.orientation);

            // Calculate car's distance to island center
            const distanceToCenter = Math.sqrt(newPosition.x ** 2 + newPosition.z ** 2);
           
            // if new  car's position is further than maximum distance allowed, don't move car
            // else allow for the car movement
            const maxDistance = 70;
            if (distanceToCenter <= maxDistance) {
                this.obj.position.copy(newPosition);
            } else {
                this.speed = 0;
            }

            // Verify collisions
            this.verifyColisions();

            // Verify out-of-road
            this.verifyRoad();
        }

        // Verify completition of race
        this.nextControlPoint();

        // Rotate wheels based on velocity
        this.rotateWheels();

        // Update car smoke
        this.updateSmoke();

        // Update the cart's camera if it is being used
        if (this.camera && this.camera.selected) {
            this.updateCamera();
        }
    }

    /**
     * Update the wheels rotation depending on car's speed
     * @method
     */
    rotateWheels() {
        const wheelRotationSpeed = -this.speed * 0.005;
        for (const wheel of this.wheels) {
            wheel.rotation.y += wheelRotationSpeed;
        }
    }

    /**
     * Update the front wheels rotation depending on car's turning
     * @method
     * @param {Number} turnValue - The value to turn the wheel.
     */
    setAngleFrontWheels(turnValue) {
        for (const wheel of this.frontWheels) {
            wheel.rotation.x = turnValue;
        }
    }

    /**
     * Updates smoke particles system
     * @method
     */
    updateSmoke() {
        for (const exhaust of this.exhausts) {

            /**
             * The smoke particle is created when the car is able to move. 
             * There is a 10% probability of this happening. 
             * The probability is also proportional to the absolute value of the speed.
             */
            const produceParticle = this.move && (
                Math.random() < 0.1 || Math.random() * Math.abs(this.speed) > 0.7
            );

            if (produceParticle) {

                /**
                 * The particle initial position depends on:
                 * - the car's position
                 * - the distance from the tube to the car's center of mass
                 * - the orientation of the car
                 */
                const position = new THREE.Vector3(
                    this.obj.position.x - exhaust.distance * Math.sin(this.orientation - exhaust.orientation),
                    this.obj.position.y + 0.2,
                    this.obj.position.z - exhaust.distance * Math.cos(this.orientation - exhaust.orientation)
                );

                const grayColor = Math.floor(Math.random() * 128);
                
                exhaust.particles.push(new Particle({
                    position: position, 
                    app: this.app, 
                    color: `rgb(${grayColor}, ${grayColor}, ${grayColor})`,
                    direction: 'z',
                    limit: 1,
                    radius: 0.05,
                    height: 0.3,
                    orientation: this.orientation,
                }));
            }

            // Check particles state
            for (let i = 0; i < exhaust.particles.length; i++) {
                const firework = exhaust.particles[i];

                // If the firework has completed its display, delete it, else update motion
                if (firework.done) exhaust.particles.splice(i, 1)
                else exhaust.particles[i].update();
            }
        }
    }

    /**
     * Handles the selection/picking of the Car object:
     * - If pointed at by the cursor, it increases in size
     * - If clicked, its color changes
     */
     verifySelection() {
        if (this.canBePicked) {
            // If pointed
            if (this.isPointed || this.selected)
                this.obj.scale.set(2, 2, 2);
            else 
                this.obj.scale.set(1, 1, 1);
            
            // If clicked
            if (this.selected)
                this.setColor(0.5);
            else
                this.setColor(1);
        }
    }

    /**
     * Checks if the cart is currently moving.
     * @method
     * @returns {boolean} - True if the cart is moving, false otherwise.
     */
    isMoving() {
        return this.move;
    }

    /**
     * Sets the checkpoints for the cart to follow during a race.
     * @method
     * @param {Array<Object>} checkpoints - The array of checkpoint objects.
     */
    setCheckPoints(checkpoints) {
        this.checkPoints = checkpoints;
    }

    /**
     * Checks if car passed next control Point and updates information about laps and control points
     * @method
     * @returns {boolean} - True if a lap is completed, false otherwise.
     */
    nextControlPoint() {

        const voxelSize = 20;
        const halfVoxelSize = voxelSize / 2;
        const checkpoint = this.checkPoints[this.nextPoint];

        const isWithinVoxelGrid =
            Math.abs(this.obj.position.x - checkpoint.x) < halfVoxelSize &&
            Math.abs(this.obj.position.z - checkpoint.z) < halfVoxelSize;

        // Check if the car's position is inside the bounding box
        if (isWithinVoxelGrid) {
            this.nextPoint = (this.nextPoint+1) % this.checkPoints.length;
            if (this.nextPoint === 1) {
                this.lapCount += 1;
                return true;
            }
        }
        return false;
    }
    
    /**
     * Gets the lap count of the kart.
     * @method
     * @returns {number} - The lap count.
     */
    getLapCount() {
        return this.lapCount;
    }

    /**
     * Gets the index of the next checkpoint the kart is aiming to pass.
     * @method
     * @returns {number} - The index of the next checkpoint.
     */
    getNextCheckPoint() {
        return this.nextPoint;
    }

    /**
     * Gets the rounded speed of the kart.
     * @method
     * @returns {number} - The rounded speed value.
     */
    getSpeed() {
        return Math.round(this.speed);
    }

    /**
     * Verifies is car has ended the race
     * @method
     */
    verifyEndRace(time){
        if(this.lapCount >= this.configs.laps){
            if(this.raceTime === null) {
                this.raceTime = time;
            }
            return true;
        }
        return false;
    }

    /**
     * Set car racing status to false and position the car in the original Position
     * @method
     */
    finishRace(){
        this.racingStarted = false;
        this.speed = 0;
        this.orientation = 0;
        this.raceTime = null;
        this.obj.rotation.copy(this.initialRotation);
        this.obj.position.copy(this.initialPosition);
    }
}

export { Cart };
