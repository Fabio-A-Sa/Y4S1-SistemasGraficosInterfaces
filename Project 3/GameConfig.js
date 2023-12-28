/**
 * Game states
 */
const states = {
    start: "startMenu",
    chooseName: "chooseName",
    chooseUserCar: "userCar",
    chooseBotCar: "botCar",
    chooseTrap: "trap",
    putTrap: "put",
    race: "gaming",
    pause: "pauseMenu",
    powerup: "powerupMenu",
    end: "endMenu",
};

/**
 * Game constants
 */
const gameConsts = {
    obstacleCooldown: 10,
    powerupCooldown: 10,
}

export { states, gameConsts };