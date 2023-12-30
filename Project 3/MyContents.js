/**
 * @file MyContents.js
 * @desc Contains the contents of the application.
 */

import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { cameraLoader } from './loaders/CameraLoader.js';
import { textureLoaderC } from './loaders/TextureLoaderC.js';
import { materialLoader } from './loaders/MaterialLoader.js';
import { objectLoader } from "./loaders/ObjectLoader.js";
import { skyboxLoader } from './loaders/SkyboxLoader.js';
import { Cart } from './objects/Cart.js';
import { Road } from './objects/Road.js';
import { Route } from './objects/Route.js';
import { Obstacle } from './objects/Obstacle.js';
import { PowerUp } from './objects/PowerUp.js';
import { Firework } from './objects/Firework.js';
import { Shader } from './shaders/Shader.js';
import { Outdoor } from './objects/Outdoor.js';
import { Button } from './objects/Button.js';
import { SceneObject } from './objects/SceneObject.js';
import { HUD } from './HUD.js';
import { textDisplayHelper } from './utils/TextDisplayUtils.js';
import { states } from './GameConfig.js';

/**
 * @class
 * This class contains the contents of the application.
 */
class MyContents {

    /**
     * @constructor
     * @param {MyApp} app - The application object.
     */
    constructor(app) {
        this.app = app;
        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
        this.axis = new MyAxis(this);
        this.textureLoader = new THREE.TextureLoader();
        this.clock = new THREE.Clock();
        this.reader.open("scene/scene.xml");
        this.keys = {};
    }

    /*
     * Initializes the contents.
     */
    init() {

        // Init buttons
        this.buttons = [
            // Main menu
            this.startButton = new Button(this.extractObject('scene_mainMenuIsland_mainMenuBoard_startButton_obj')),
            this.userCarButton = new Button(this.extractObject('scene_mainMenuIsland_mainMenuBoard_userCarButton_obj')),
            this.botCarButton = new Button(this.extractObject('scene_mainMenuIsland_mainMenuBoard_botCarButton_obj')),
            this.nameButton = new Button(this.extractObject('scene_mainMenuIsland_mainMenuBoard_nameButton_obj')),
            this.minusDifficultyButton = new Button(this.extractObject('scene_mainMenuIsland_mainMenuBoard_minusDifficultyButton_obj')),
            this.plusDifficultyButton = new Button(this.extractObject('scene_mainMenuIsland_mainMenuBoard_plusDifficultyButton_obj')),
            this.minusLapButton = new Button(this.extractObject('scene_mainMenuIsland_mainMenuBoard_minusLapButton_obj')),
            this.plusLapButton = new Button(this.extractObject('scene_mainMenuIsland_mainMenuBoard_plusLapButton_obj')),

            // End menu
            this.restartButton = new Button(this.extractObject('scene_endMenuIsland_endMenuBoard_raceAgainButton_obj')),
            this.goToStartButton = new Button(this.extractObject('scene_endMenuIsland_endMenuBoard_goToStartButton_obj')),
        ];

        // Init keyboard events
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));

        // Init picking
        this.pointer = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.raycaster.near = 1;
        this.raycaster.far = 200;
        document.addEventListener('pointermove', this.onMouseMove.bind(this));
        document.addEventListener('click', this.onMouseMove.bind(this));

        // Init road and autonomous paths
        this.road = new Road(this.extractObject('scene_road_obj'));
        this.easyRoute = new Route(this.extractObject('scene_easyRoute_obj'));
        this.mediumRoute = new Route(this.extractObject('scene_mediumRoute_obj'));
        this.difficultRoute = new Route(this.extractObject('scene_difficultRoute_obj'));
        this.routes = [ this.easyRoute, this.mediumRoute, this.difficultRoute ];

        // Init cameras
        this.camera1 = this.app.cameras['car1_cam'];

        // Init configs
        this.configs = {
            gameState: states.start,
            max_velocity: 30,
            velocity_increment: 1,
            angle_increment: Math.PI / 2,
            factor: 1,
            keys: this.keys,
            laps: 3,
            difficulty: 1,
            raceTime: 0,
            penaltyMultiplier: 0.7,
            penaltyCooldown: 5,
            powerUpMultiplier: 2,
            powerUpCooldown: 5,
        }

        // Init obstacles
        this.obstacles = [
            new Obstacle(this.extractObject('scene_obstacle1_obj'), 'time'),
            new Obstacle(this.extractObject('scene_obstacle2_obj'), 'speed'),
        ];
        this.obstaclesToSelect = [
            new Obstacle(this.extractObject('scene_obstacle3_obj'), 'time'),
            new Obstacle(this.extractObject('scene_obstacle4_obj'), 'speed'),
            new Obstacle(this.extractObject('scene_obstacle5_obj'), 'time'),
        ];

        // Init power-ups
        this.powerUps = [
            new PowerUp(this.extractObject('scene_powerup1_obj'), 'speed'),
            new PowerUp(this.extractObject('scene_powerup2_obj'), 'obstacle'),
        ];

        // Init cars
        this.car1 = new Cart(this.extractObject('scene_car1_obj'), this.app, "simple");
        this.car2 = new Cart(this.extractObject('scene_car2_obj'), this.app, "normal");
        this.car3 = new Cart(this.extractObject('scene_car3_obj'), this.app, "cool");
        this.car4 = new Cart(this.extractObject('scene_car4_obj'), this.app, "racer1");
        this.car5 = new Cart(this.extractObject('scene_car5_obj'), this.app, "racer2");
        this.car6 = new Cart(this.extractObject('scene_car6_obj'), this.app, "racer3");
        this.userCars = [ this.car1, this.car2, this.car3 ];
        this.botCars = [ this.car4, this.car5, this.car6 ];
        this.cars = [...this.userCars, ...this.botCars];

        // Init fireworks
        this.fireworks = [
            new Firework(this.extractObject('scene_fireworkBox1_obj'), this.app),
            new Firework(this.extractObject('scene_fireworkBox2_obj'), this.app),
            new Firework(this.extractObject('scene_fireworkBox3_obj'), this.app),
        ];

        this.animatedObjects = [
            ...this.userCars,
            ...this.botCars,
            ...this.obstacles,
            ...this.powerUps,
            ...this.fireworks,
            ...this.buttons,
            ...this.obstaclesToSelect,
            this.road,
        ];
        
        // Init chars in spritesheet of text display utils
        textDisplayHelper.initChars();

        ///// MAIN MENU //////////////////////////////////////////////////////////////////////////////////////

        // Find selected car
        this.userCar = (this.userCars.find(car => car.selected) || null);
        this.botCar =(this.botCars.find(car => car.selected) || null);

        // Init main menu outdoor
        this.mainMenuOutdoor = new Outdoor(this.extractObject("scene_mainMenuIsland_obj"), 44, 14, 0.5);
        this.mainMenuOutdoor.addText("Speeding Galactic Inferno - KARTS", 2, 1, 1, 0.2);
        this.mainMenuOutdoor.addText("Username: null", 3, 3, 1, 0.2);
        this.mainMenuOutdoor.addText(`difficulty: ${this.configs.difficulty}`, 3, 5, 1, 0.2);
        this.mainMenuOutdoor.addText(`Lap count:  ${this.configs.laps}`, 3, 7, 1, 0.2);
        this.mainMenuOutdoor.addText(`User: ${this.userCar? this.userCar.name : "none"}`, 2, 9, 1, 0.2);
        this.mainMenuOutdoor.addText(`Bot: ${this.botCar? this.botCar.name : "none"}`, 30, 9, 1, 0.2);
        this.mainMenuOutdoor.addText("Fabio Sa & Marcos Ferreira | FEUP 2024 LIMITED", 7.5, 13, 0.5, 0.1);

        // Init player's username
        this.playerUsername = null;

        ///// END MENU ////////////////////////////////////////////////////////////////////////////////////////

        // Init main menu outdoor
        this.endMenuOutdoor = new Outdoor(this.extractObject("scene_endMenuIsland_obj"), 44, 14, 0.5);
        this.endMenuOutdoor.addText("STATS", 2, 1, 1, 0.2);
        this.endMenuOutdoor.addText(`Winner: ${this.playerUsername ? this.playerUsername : "error"} | Loser: error`, 3, 3, 1, 0.2);
        this.endMenuOutdoor.addText(`difficulty: ${this.configs.difficulty}`, 3, 5, 1, 0.2);
        this.endMenuOutdoor.addText(`Lap count:  ${this.configs.laps}`, 3, 7, 1, 0.2);
        this.endMenuOutdoor.addText(`User: ${this.userCar? this.userCar.name : "none"} | Time: ${this.userCar? this.userCar.finalTime : "error"}`, 2, 9, 1, 0.2);
        this.endMenuOutdoor.addText(`Bot: ${this.botCar? this.botCar.name : "none"} | Time: ${this.botCar? this.botCar.finalTime : "error"}`, 2, 11, 1, 0.2);

        ///// GAME ////////////////////////////////////////////////////////////////////////////////////////////

        // Init hud outdoor
        this.outdoor = new Outdoor(this.extractObject("scene_hudOutdoorIsland_obj"), 44, 14, 0.5);
        this.outdoor.addText('Information:', 2 , 2, 2, 0.2);
        this.outdoor.addText('', 2 , 4, 2, 0.2); // Time starts empty not to create ghost letters
        this.outdoor.addText(`Lap: 0/${this.configs.laps}`, 2 , 6, 2, 0.2);
        this.outdoor.addText('Speed: 0 MAX: '+ this.configs.max_velocity, 2 , 8, 2, 0.2);
        this.outdoor.addText('Powerup time: none', 2 , 10, 2, 0.2);
        this.outdoor.addText('Game: paused', 2 , 12, 2, 0.2);

        // Init shaders outdoor
        this.outdoor2 = new Outdoor(this.extractObject('scene_bumpOutdoorIsland_outdoorIsland2_outdoorBillBoard2_outdoorBackPanel2_obj'));

        // Init hud in main game screen
        this.hud = new HUD(this.app.scene, this.camera1, this.app.renderer);
        this.hud.addText('MY SPEED: 0/MAX', { offsetX: -0.2, offsetY: 0.1, letterSize: 0.01, spacing: 0.001 });
        this.hud.addText('POWERUP: TIMELEFT', { offsetX: -0.2, offsetY: 0.085, letterSize: 0.01, spacing: 0.001 });
        this.hud.addText('1st', { offsetX: -0.2, offsetY: -0.095, letterSize: 0.03, spacing: 0.0002 });
        this.hud.addText('TIME: 00:00', { offsetX: 0.1, offsetY: 0.1, letterSize: 0.01, spacing: 0.001 });
        this.hud.addText('LAP: 1/3', { offsetX: 0.1, offsetY: 0.085, letterSize: 0.01, spacing: 0.001 });

        // Enable picking
        this.enablePicking();

        // Init external textures
        this.initTextures();

        // Init shaders
        this.initShaders();
    }

    /**
     * Called to start and prepare when a new game is starting
     * @method
     */
    startRace(){

        // Reset the animations
        this.stop();
        this.play();
        
        // Set Car initial position
        this.userCar.obj.position.copy(new THREE.Vector3(-37, 0, 0));
        this.userCar.obj.rotation.set(0, 0, 0);

        // Set configs
        this.userCar.setConfig(this.configs);
        this.botCar.setConfig(this.configs);

        // Set obstacles, powerups, opponent and road for manual car
        this.userCar.setObstacles(this.obstacles);
        this.userCar.setPowerUps(this.powerUps);
        this.userCar.setOpponent(this.botCar);
        this.userCar.setRoad(this.road);
        
        // set checkpoints for cars
        this.userCar.setCheckPoints(this.road.getPoints());
        this.botCar.setCheckPoints(this.road.getPoints());

        // Set opponent route
        this.botCar.setRoute(this.routes[this.configs.difficulty -1]);

        // Set cameras
        this.userCar.setCamera(this.camera1);

        // Move user placeable obstacle to parking lot
        this.obstaclesToSelect.forEach(obstacle => obstacle.moveToPosition());

        // Init obstacles/powerups animations
        this.obstacles.forEach(obstacle => obstacle.animate());
        this.powerUps.forEach(powerup => powerup.animate());

        // Set road trap position to undefined
        this.road.trapPosition = undefined;

        // Start counting time
        this.configs.raceTime = 0;
        this.timePassed = 0;
        this.play();
    }

    /**
     * Verifies if a game has ended
     * @method
     */
    verifyEndRace(){
        if (this.userCar.verifyEndRace(this.configs.raceTime) & this.botCar.verifyEndRace(this.configs.raceTime)){
           this.endRace();
        }
    }

    /**
     * Verifies if a game is running
     * @method
     */
    running() {
        return ![states.pause, states.chooseName, states.chooseTrap, states.putTrap].includes(this.configs.gameState);
    }

    /**
     * Terminates the game and changes to the end menu (also load it)
     * @param {boolean} gaveUp allows player to giveup when in pause without ending the game, go to main menu if that is the case
     */
    endRace(gaveUp = false){
        if(gaveUp){
            this.configs.gameState = states.start;
            this.setCamera("mainMenu");
        } else{
            this.configs.gameState = states.end;
            this.setCamera('endMenu');
        }
        this.updateEndMenuOutdoor(); //needs to be first before finishRace (because of resets)
        this.userCar.finishRace();
        this.botCar.finishRace();     
    }

    /**
     * Inits external textures
     * @method
     */
    initTextures() {
        this.obstacleTexture = this.textureLoader.load('./scene/textures/bomb.jpg');
        this.obstacleTexture.wrapS = THREE.RepeatWrapping;
        this.obstacleTexture.wrapT = THREE.RepeatWrapping;
        this.obstacleBumpTexture = this.textureLoader.load('./scene/bumpTextures/bomb.jpg');
        this.obstacleBumpTexture.wrapS = THREE.RepeatWrapping;
        this.obstacleBumpTexture.wrapT = THREE.RepeatWrapping;
    }

    /**
     * Init shaders content
     * @method
     */
    initShaders() {
        this.shaders = [
            this.obstacleShader = new Shader('blow-up', {
                scale: { value: 0 },
                texture1: { type: 'sampler2D', value: this.obstacleTexture },
                texture2: { type: 'sampler2D', value: this.obstacleBumpTexture },
            }),
            this.outdoorShader = new Shader('outdoor', {
                texture1: { type: 'sampler2D', value: null },
                texture2: { type: 'sampler2D', value: null },
            }),
        ];

        this.setShaders();
    }

    /**
     * Sets all shaders and its dependencies
     * @method
     */
    setShaders() {
        for (let i=0; i<this.shaders.length; i++) {
            if (!this.shaders[i].material) {
                setTimeout(this.setShaders.bind(this), 100)
                return;
            }
        }

        this.obstacles.forEach(obstacle => obstacle.setShader(this.obstacleShader));

        const updateTextures = () => {
            this.outdoorShader.update('texture1', this.app.getRGBTexture());
            this.outdoorShader.update('texture2', this.app.getLGRAYTexture());
            this.app.textureUpdate = true;
        };
        updateTextures();

        this.outdoor2.setShader(this.outdoorShader);
        setInterval(updateTextures, 60 * 1000);
    }

    /**
     * Retrieves an object from the collection by its name.
     *
     * @param {string} id - The name of the object to retrieve.
     * @returns {Object|undefined} - The matching object, or 'undefined' if not found.
     */
    extractObject(id) {
        let object;
        this.objects.traverse(
            (obj) => { if (obj.name && obj.name === id) object = obj }
        );
        return object;
    }

    /**
     * Handles the selection/picking of scene objects.
     * @param {Object} intersected - The object being interacted with.
     * @param {Array} objectsList - List of scene objects to consider for selection.
     */
    selectObject(intersected, objectsList = this.animatedObjects) {
        const objectName = intersected.object.name;
        const point = intersected.point;
        for (const animated of objectsList) {
            if (objectName && animated.canBePicked && this.includes(animated, objectName)) {
                if (animated.selected && animated.isPointed) animated.deselect();
                else if (animated.isPointed) animated.select(point);
                return;
            }
        }
    }

    /**
     * Handles the pointing of scene objects.
     * @param {Object} intersected - The object being interacted with.
     * @param {Array} objectsList - List of scene objects to consider for pointing.
     */
    pointObject(intersected, objectsList = this.animatedObjects) {
        this.unpointAllObjects();
        const objectName = intersected.object.name;
        for (const animated of objectsList) {
            if (objectName && animated.canBePicked && this.includes(animated, objectName)) {
                animated.point();
                return;
            }
        }
    }

    /**
     * Checks if a specified child object with the given name exists within a SceneObject.
     * @param {SceneObject} object - object to search for
     * @param {String} candidate - candidate name
     * @returns 
     */
    includes(object, candidate) {
        let found = false;
        object.obj.traverse((obj) => {
            if (obj.name && obj.name === candidate) found = true;
        });
        return found;
    }

    /**
     * Unpoints all scene objects.
     * @param {Array} objects - List of scene objects to unpoint.
     */
    unpointAllObjects(objects = this.animatedObjects) {
        objects.forEach((obj) => obj.unpoint());
    }

    /**
     * Deselects all scene objects.
     * @param {Array} objects - List of scene objects to deselect.
     */
    deselectAllObjects(objects = this.animatedObjects) {
        objects.forEach((obj) => obj.deselect());
    }

    /**
     * Handles the onKeyDown event.
     * @param {KeyboardEvent} event - The keydown event containing information about the pressed key.
     */
    onKeyDown(event) {
        if (this.configs.gameState === states.race) {
            this.keys[event.key.toUpperCase()] = true;

            if (event.key.toUpperCase() === ' ') {
                this.configs.gameState = states.pause;
                this.setCamera("pauseMenu");
                this.carPauseSpeed = this.userCar.speed;
                this.userCar.speed = 0;
            }
        } else if (this.configs.gameState === states.pause) {
            if (event.key.toUpperCase() === ' ') {
                this.configs.gameState = states.race;
                this.setCamera("car1");
                this.userCar.speed = this.carPauseSpeed;
            } else if (event.key.toUpperCase() === 'ESCAPE') {
                this.endRace(true);
            }
        }
    }

    /**
     * Handles the onKeyUp event.
     * @param {KeyboardEvent} event - The keydup event containing information about the pressed key.
     */
    onKeyUp(event) {
        this.keys[event.key.toUpperCase()] = false;
    }

    /**
     * Handles the mouse movement event for object selection.
     * @param {MouseEvent} event - The mouse event containing information about the mouse movement.
     */
    onMouseMove(event) {
        if (event.type === 'pointermove') {
            this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }

        this.raycaster.setFromCamera(this.pointer, this.app.getActiveCamera());

        const intersects = this.raycaster.intersectObjects(this.app.scene.children);
        if (intersects.length > 0) {
            event.type === 'pointermove' 
                ? this.pointObject(intersects[0])
                : this.selectObject(intersects[0])
        }
    }

    /**
     * Called when the scene XML file load is complete.
     * @method
     * @param {MySceneData} data - The entire scene data object.
     */
    onSceneLoaded(data) {
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    /**
     * Executed after the scene is loaded and before rendering.
     * @method
     * @param {MySceneData} data - The entire scene data object.
     */
    onAfterSceneLoadedAndBeforeRender(data) {

        // Cameras
        cameraLoader.load(data.cameras).forEach(camera => {
            this.app.cameras[camera.name] = camera;
        });
        this.app.initialCamera = data.activeCameraId;
        this.app.setActiveCamera();

        // Globals
        const globalSettings = {
            background: new THREE.Color(...data.options.background),
            ambient: new THREE.Color(...data.options.ambient),
        };
        this.app.scene.background = globalSettings.background;
        const ambientLight = new THREE.AmbientLight(globalSettings.ambient);
        this.app.lights["ambient_light"] = ambientLight;
        this.app.scene.add(ambientLight);

        // Fog
        if (data.fog !== "undefined") {
            const fogParams = {
                color: new THREE.Color(...data.fog.color),
                near: data.fog.near,
                far: data.fog.far,
                type: data.fog.type,
            };
            const fog = new THREE.Fog(data.color, fogParams.near, fogParams.far);
            this.app.scene.fog = fog;
        }

        // Textures and Materials
        let texturePaths = textureLoaderC.getTexPaths(data.textures);
        let materialMap = materialLoader.getMatDetails(data.materials, texturePaths);

        // Skybox
        let skybox = skyboxLoader.load(data.skyboxes);
        this.app.scene.add(skybox);

        // Scene Objects
        this.objects = objectLoader.load(data.nodes, data.rootId, materialMap);
        this.app.scene.add(this.objects);

        // Add object to list used in GUI interface
        this.objects.traverse((item) => {
            if (item.name && item.name.endsWith("_obj"))
                this.app.objectList.push(item);
        });

        // Add lights to list used in GUI interface
        this.objects.traverse((item) => {
            if (item.name && item.name.endsWith("_light"))
                this.app.lights[item.name] = item;
        });
    }

    /**
     * Init movements
     * @method
     */
    play() {
        this.animatedObjects.forEach((obj) => obj.play());
    }

    /**
     * Stop movements
     * @method
     */
    stop() {
        this.animatedObjects.forEach((obj) => obj.stop());
    }

    ///// UPDATE FUNCTIONS ////////////////////////////////////////////////////////////////////////

    /**
     * Update contents and state machine
     * @method
     */
    update() {

        switch(this.configs.gameState) {
            case states.start:
                this.setCamera('mainMenu');
                this.verifyMainMenuButtons();
                this.updateMainMenuOutdoor();
                break;
            case states.chooseUserCar:
                this.setCamera("selectUserCar");
                const selectedUserCar = this.userCars.find(car => car.selected);
                if (selectedUserCar) {
                    this.userCar = selectedUserCar;
                    selectedUserCar.racingCar = true;
                    selectedUserCar.selected = false;
                    this.configs.gameState = states.start;
                }
                this.verifyCarSelection();
                break;
            case states.chooseBotCar:
                this.setCamera("selectBotCar");
                const selectedBotCar = this.botCars.find(car => car.selected);
                if (selectedBotCar) {
                    this.botCar = selectedBotCar;
                    selectedBotCar.racingCar = true;
                    selectedBotCar.selected = false;
                    this.configs.gameState = states.start;
                }
                this.verifyCarSelection();
                break;
            case states.chooseTrap:
                this.setCamera('selectTrap');
                this.enablePicking(this.obstaclesToSelect);
                this.verifyTrapSelection();
                break;
            case states.putTrap:
                this.setCamera('Minimap');
                this.disablePicking(this.obstaclesToSelect);
                this.verifyPutTrap();
                break;
            case states.race:
                this.resetSizes();
                this.setCamera("car1");
                if (this.timePassed >= 1) {
                    this.configs.raceTime++;
                    this.updateHUD();
                    this.updateHUDOutdoor();
                    this.userCar.updateMultipliers();
                    this.timePassed = 0;  
                }
                this.verifyEndRace();
                break;
            case states.pause:
                this.updateHUDOutdoor();
                break;        
            case states.powerup:
                break;
            case states.end:
                this.enableFireworks();
                this.verifyEndMenuButtons();
                break;
            default:
                return;
        }
        
        const delta = this.clock.getDelta();
        if (this.running()) {
            this.animatedObjects.forEach((obj) => obj.update(delta));
        }

        this.timePassed += delta;
        this.hud.updatePosition();
    }

    /**
     * Verifies main menu buttons state
     * @method
     */
    verifyMainMenuButtons() {
        if (this.startButton.selected) {
            if(this.verifyUsername() && this.userCar && this.botCar){
                this.configs.gameState = states.race;
                this.startRace();
                this.setCamera("car1");
            }
        }
        if (this.userCarButton.selected) {
            this.configs.gameState = states.chooseUserCar;
            this.userCar = null;
            this.userCars.forEach(car => {
                car.selected = false;
                car.racingCar = false;
            });
        }
        if (this.botCarButton.selected) {
            this.configs.gameState = states.chooseBotCar;
            this.botCar = null;
            this.botCars.forEach(car => {
                car.selected = false;
                car.racingCar = false;
            });
        }
        if (this.nameButton.selected) {
            this.configs.gameState = states.chooseName;
            this.editPlayerName();
        }
        if (this.minusDifficultyButton.selected && this.configs.difficulty > 1){
            this.configs.difficulty--;
        }
        if (this.plusDifficultyButton.selected && this.configs.difficulty < 3){
            this.configs.difficulty++;
        }
        if (this.minusLapButton.selected && this.configs.laps > 3) {
            this.configs.laps--;
        }
        if (this.plusLapButton.selected && this.configs.laps < 20) {
            this.configs.laps++;
        }

        this.deselectAllObjects(this.buttons);
    }

    /**
     * Verifies end menu buttons state
     * @method
     */
    verifyEndMenuButtons() {
        if (this.goToStartButton.selected) this.configs.gameState = states.start;
        if (this.restartButton.selected){
            if(this.verifyUsername() && this.userCar && this.botCar){
                this.configs.gameState = states.race;
                this.deselectAllObjects();
                this.unpointAllObjects();
                this.startRace();
            }
        }
        this.deselectAllObjects(this.buttons);
    }

    /**
     * Selects another scene's camera
     * @param {String} cameraName - the desired camera name 
     */
    setCamera(cameraName) {
        this.app.activeCameraName = cameraName + "_cam";
        this.app.updateCameraIfRequired();
    }

    /**
     * Updates the Heads-Up Display (HUD) with various information including power-up status,
     * speed, current time, player position, lap count, etc.
     * @method
     */
    updateHUD() {

        // Update speed information
        const currentSpeed = this.userCar.getSpeed();
        this.hud.updateText(0, `My speed: ${currentSpeed}/${this.userCar.getMaxVelocity()}`);

        // Update power-up status
        this.hud.updateText(1, `POWERUP TIME: ${this.getTimeFormat(this.userCar.powerUpTimeLeft)}`);

        // Update time information
        const currentTime = this.getTimeFormat(this.configs.raceTime);
        this.hud.updateText(3, `Time: ${currentTime}`);

        // Update player position (1st, 2nd)
        const playerPosition = this.calculatePosition();
        if (playerPosition === 1) {
            this.hud.updateText(2, "1st");
        } else if (playerPosition === 2) {
            this.hud.updateText(2, "2nd");
        }

        // Update lap count
        const lapCount = this.userCar.getLapCount();
        this.hud.updateText(4, `LAP: ${lapCount}/${this.configs.laps}`);
    }

    /**
     * Function to be called every second for updating the outdoor Heads-Up Display (HUD).
     * string} - Updates the time, speed, and lap information on the outdoor HUD.
     * @method
     */
    updateHUDOutdoor() {
        // Update time information
        const currentTime = this.getTimeFormat(this.configs.raceTime);
        this.outdoor.updateText(1, `TIME: ${currentTime}`);

        // Update lap information
        const lapCount = this.userCar.getLapCount();
        this.outdoor.updateText(2, `Lap: ${lapCount}/${this.configs.laps}`);

        // Update speed information
        const currentSpeed = this.userCar.getSpeed();
        this.outdoor.updateText(3, `Speed: ${currentSpeed} MAX: ${this.userCar.getMaxVelocity()}`);

        //update powerUp power left
        this.outdoor.updateText(4,`PowerUp time: ${this.getTimeFormat(this.userCar.powerUpTimeLeft)}`);

        // Update lap information
        let gameStatePrint;
        if (this.configs.gameState === states.race) gameStatePrint = "running";
        else if (this.configs.gameState === states.pause) gameStatePrint = "paused";

        this.outdoor.updateText(5, `Game: ${gameStatePrint}`);
    }

   /**
     * Updates the main menu display for outdoor racing with the current configuration and user information.
     * @return {void}
     */
    updateMainMenuOutdoor() {
        this.mainMenuOutdoor.updateText(2, `Difficulty: ${this.configs.difficulty}`);
        this.mainMenuOutdoor.updateText(3, `Lap count: ${this.configs.laps}`);
        this.mainMenuOutdoor.updateText(4, `User: ${this.userCar ? this.userCar.name : "none"}`);
        this.mainMenuOutdoor.updateText(5, `Bot: ${this.botCar ? this.botCar.name : "none"}`);
    }

    /**
     * Updates the end menu display for outdoor racing with race results and details.
     * @return {void}
     */
    updateEndMenuOutdoor() {
        const winner = this.userCar.raceTime <= this.botCar.raceTime ? this.playerUsername : "bot";
        const loser = winner === "bot" ? this.playerUsername : "bot";

        this.endMenuOutdoor.updateText(1, `Winner: ${winner} | Loser: ${loser}`);
        this.endMenuOutdoor.updateText(2, `Difficulty: ${this.configs.difficulty}`);
        this.endMenuOutdoor.updateText(3, `Lap count: ${this.configs.laps}`);
        this.endMenuOutdoor.updateText(4, `User: ${this.userCar.name} | Time: ${this.getTimeFormat(this.userCar.raceTime)}`);
        this.endMenuOutdoor.updateText(5, `Bot: ${this.botCar.name} | Time: ${this.getTimeFormat(this.botCar.raceTime)}`);
    }

    /**
    * Convert time in the format "mm:ss".
    * @returns {string} - The current time.
    */
    getTimeFormat(time) {
        const minutes = Math.floor(time / 60).toString().padStart(2, '0');
        const seconds = Math.floor((time% 60)).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }
    
    /** Enables picking for a list of scene objects.
     * @param {Array} objects - List of scene objects to enable picking for.
     */
    enablePicking(objects = this.animatedObjects) {
        objects.forEach((obj) => obj.enablePicking());
    }

    /**
     * Disables picking for a list of scene objects.
     * @param {Array} objects - List of scene objects to disable picking for.
     */
    disablePicking(objects = this.animatedObjects) {
        objects.forEach((obj) => obj.disablePicking());
    }

    /**
     * Enables the firework particles
     * @method
     */
    enableFireworks() {
        this.fireworks.forEach(firework => firework.play());
    }

    /**
     * Disables the firework particles
     * @method
     */
    disableFireworks() {
        this.fireworks.forEach(firework => firework.stop());
    }

    /**
     * Verifies car selection
     * @method
     */
    verifyCarSelection() {
        this.cars.forEach(car => car.verifySelection());
    }

    /**
     * Verifies obstacles selection
     * @method
     */
    verifyTrapSelection() {
        this.obstaclesToSelect.forEach(obstacle => obstacle.verifySelection());
        this.selectedObstacle = this.obstaclesToSelect.find(obstacle => obstacle.selected);
        if (this.selectedObstacle) this.configs.gameState = states.putTrap;
    }

    /**
     * Verifies put trap
     * @method
     */
    verifyPutTrap() {
        this.road.verifySelection();
        const position = this.road.getTrapPosition();
        if (position) {
            this.selectedObstacle.obj.position.set(position.x, 1.5, position.z);
            this.selectedObstacle.animate();
            this.deselectAllObjects(this.obstaclesToSelect);
            this.obstacles.push(this.selectedObstacle);
            this.configs.gameState = states.race;
        }
    }

    /**
     * Calculates the position of the user compared to the bot at a point in the race
     * @method
     * @returns {number} - The position code:
     *   - 0: If user and bot are at the same lap and checkpoint -> mantain position
     *   - 1: If user is ahead in either lap or checkpoint -> user in 1st place
     *   - 2: If bot is ahead in either lap or checkpoint -> user in 2nd place
     */
    calculatePosition() {
        let userLap = this.userCar.getLapCount();
        let userCheckPoint = this.userCar.getNextCheckPoint();

        let botLap = this.botCar.getLapCount();
        let bothCheckPoint = this.botCar.getNextCheckPoint();

        if (userLap === botLap && userCheckPoint === bothCheckPoint) {
            return 0;
        } else if (userLap > botLap) {
            return 1;
        } else if (botLap > userLap) {
            return 2;
        } else if (userCheckPoint > bothCheckPoint) {
            return 1;
        }
        return 2;
    }

    /**
     * Edits the player's name based on keyboard input and updates the main menu outdoor.
     * This function is active when the game state is set to "chooseName."
     * @method
     */
    editPlayerName() {
        if (this.configs.gameState === states.chooseName) {
            
            const keydownHandler = (event) => {

                // Check if the pressed key is alphanumeric, a space, or Backspace
                const isAlphanumeric = /^[a-zA-Z0-9 ]$/.test(event.key);

                if (isAlphanumeric || (event.key === 'Backspace' && this.playerUsername)) {

                    if (event.key === 'Backspace') {
                        this.playerUsername = this.playerUsername.slice(0, -1);
                    } else {
                        this.playerUsername = (this.playerUsername || '') + event.key;
                    }

                    this.playerUsername = this.playerUsername.slice(0, 12);

                    this.mainMenuOutdoor.updateText(1, `Username: ${this.playerUsername}`);
                } else if (event.key === 'Enter' && this.verifyUsername()) {

                    this.configs.gameState = states.start;
                    this.deselectAllObjects(this.buttons);
                    
                    // Remove the event listener
                    document.removeEventListener('keydown', keydownHandler);
                }
            };

            document.addEventListener('keydown', keydownHandler);
        }
    }
    
    /**
     * Verifies if username is valid before starting a race
     * @returns true is username is valid false if otherwise
     */
    verifyUsername() {
        return (this.playerUsername && this.playerUsername.length >= 1 && this.playerUsername.length <= 16);
    }

    /**
     * Reset animated objects size
     * @method
     */
    resetSizes() {
        this.animatedObjects.forEach(obj => obj.resetSize());
    }
}


export { MyContents };
