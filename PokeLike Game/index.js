const canvas = document.querySelector('canvas');

const context = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;
// Esse código pra baixo é como mapeia os blocos.
const collisionsMap = [];
for (let index = 0; index < collisions.length; index += 70) {
    collisionsMap.push(collisions.slice(index, 70 + index));
}

const mapEntersMap = [];
for (let index = 0; index < mapZoneData.length; index += 70) {
    mapEntersMap.push(mapZoneData.slice(index, 70 + index));
}

const characterMap = [];
for (let index = 0; index < characterData.length; index += 70) {
    characterMap.push(characterData.slice(index, 70 + index));
}

const battleZoneMap = [];
for (let index = 0; index < battleZoneData.length; index += 70) {
    battleZoneMap.push(battleZoneData.slice(index, 70 + index));
}

const offset = {
    x: -785,
    y: -500
}
// Organiza o mapeamento dos blocos pra caber no canvas.
const boundaries = [];
collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025)
        boundaries.push(new Boundary({position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
        }}))
    })
})

const mapEntersZones = [];
mapEntersMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025)
        mapEntersZones.push(new Boundary({position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
        },
    }))
    })
})

const charactersZones = [];
characterMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025)
        charactersZones.push(new Boundary({position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
        }}))
    })
})


const battleZones = [];
battleZoneMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025)
        battleZones.push(new Boundary({position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
        },
    }))
    })
})

const foregroundImage = new Image();
foregroundImage.src = './imgs/foregroundObjects.png';

const snowyTownBackground = new Image();
snowyTownBackground.src = './imgs/maps/snowyTown.png'

const backgroundImage = new Image();
backgroundImage.src = './imgs/PelletTown.png';

const playerDownImage = new Image();
playerDownImage.src = './imgs/playerDown.png';

const playerUpImage = new Image();
playerUpImage.src = './imgs/playerUp.png';

const playerLeftImage = new Image();
playerLeftImage.src = './imgs/playerLeft.png';

const mariaImage = new Image();
mariaImage.src = './imgs/maria.png'

const brennoImage = new Image();
brennoImage.src = './imgs/brenno.png'

const playerRightImage = new Image();
playerRightImage.src = './imgs/playerRight.png';

const brenno = new NPC({
    position: {
        x: 175,
        y: 100,
    },
    image: brennoImage,
    frames: {
        max: 4,
    },
    name: 'Brenno',
    dialogue: 'Oi, eu sou o Brenno!'
})

const player = new Sprite({
    position: {
        x: 440,
        y: 380,
    },
    image: playerDownImage,
    frames: {
        max: 4,
        hold: 10
    },
    sprites: {
        up: playerUpImage,
        down: playerDownImage,
        left: playerLeftImage,
        right: playerRightImage,
    }
})

const interrogationImage = new Image();
interrogationImage.src = './imgs/interrogation.png';
const interrogation = new Sprite({
    position: {
        x: 519,
        y: 545,
    },
    image: interrogationImage,
    frames: {
    max: 1,
    }
})

const maria = new NPC({
    position: {
        x: 511,
        y: 580,
    },
    image: mariaImage,
    frames: {
        max: 4,
    },
    name: 'Maria',
    dialogue: 'Oi, eu sou a Maria!',
    isEnemy: true
})

const background = new Sprite({ position: {
    x: offset.x,
    y: offset.y
},
 image: backgroundImage,
 sprites: {
    map2: snowyTownBackground
 }
})

const foreground = new Sprite({ position: {
    x: offset.x,
    y: offset.y
},
 image: foregroundImage
})

let keys = {
    e: {
        pressed: false,
    },
    w: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    s: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
}

const charactersArray = [maria, brenno]

// Se algo se move, tem que estar nessa array.

const movables = [background, ...boundaries, foreground, maria, brenno, ...battleZones, ...charactersZones,
     ...mapEntersZones]

//Funções pra calcular a colisão entre o player e algo

function rectangularCollision({ rectangle1, rectangle2 }) {
    return(rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.width &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
}

function rectangularCollisionForChat({ rectangle1, rectangle2 }) {
    return(rectangle1.position.x + 20 + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + 20 + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + 20 + rectangle2.width &&
        rectangle1.position.y + 20 + rectangle1.height >= rectangle2.position.y)
}

function rectangularCollisionForNPCBattleFront({ rectangle1, rectangle2 }) {
    return(rectangle1.position.x + rectangle1.width / 8 >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width / 8 &&
        rectangle1.position.y <= rectangle2.position.y + 200 + rectangle2.width &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
}

function rectangularCollisionForMap({ rectangle1, rectangle2 }) {
    return(rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + 3 + rectangle2.width &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
}

const changeMap = {
    initiated: false
}

const dialogue = {
    initiated: false
}

const battle = {
    initiated: false
}
// Função que anima o mapa e os personagens. Ela se auto-chama pra fazer os frames.
function animate() {
    document.querySelector('#user-interface').style.display = 'none';
    const animationId = window.requestAnimationFrame(animate);
    background.draw()
    boundaries.forEach((boundary) => {
        boundary.draw()
    })
    charactersZones.forEach((characterZone) => {
        characterZone.draw()
    })
    battleZones.forEach((battleZone) => {
        battleZone.draw()
    })
    mapEntersZones.forEach((enterZone) => {
        enterZone.draw()
    })
    maria.draw()
    brenno.draw()
    player.draw()
    maria.draw()
    foreground.draw()


    let moving = true;
    player.animate = false
    if (battle.initiated) return;
    if (changeMap.initiated) return;
    if (dialogue.initiated) return;
    //Ativa batalha quando anda no gramado com porcentagem de chance no Math.random
    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
        for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i];
            const overlappingArea = (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width) - Math.max(player.position.x, battleZone.position.x)) * (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height) - Math.max(player.position.y, battleZone.position.y))
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: battleZone,
            })&& 
            overlappingArea > (player.width * player.height) / 2 
            && Math.random() < 0.01) {
                //battle from grass initiates
                audio.Map.stop()
                audio.initBattle.play()
                audio.battle.play()
                battle.initiated = true
                window.cancelAnimationFrame(animationId)
                gsap.to('#overlappingDiv', {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.5,
                    onComplete() {
                        gsap.to('#overlappingDiv', {
                            opacity: 1,
                            duration: 0.4,
                            onComplete() {
                                initBattle()
                                animateBattle()
                                gsap.to('#overlappingDiv', {
                                    opacity: 0,
                                    duration: 0.4,
                                })
                            }
                        })
                    }
                })
                break;
            }   
        }
    }
// Confere as zonas de personagens, se apertar E perto de um personagem NPC, diálogo, se for trainer, luta.
        for (let i = 0; i < charactersZones.length; i++) {
            const characterZone = charactersZones[i];
            if (rectangularCollisionForChat({
                rectangle1: player,
                rectangle2: {...characterZone, position: {
                    x: characterZone.position.x,
                    y: characterZone.position.y
                }},
            })) {
                if (keys.e.pressed && lastKey === 'e') {
                    charactersArray.forEach((character) => {
                        if (character.position.x === characterZone.position.x) {
                            if (!character.isEnemy) {
                            const npcDiv = document.querySelector('#npc-dialogue');
                            npcDiv.style.display = 'block';
                            npcDiv.innerHTML = character.dialogue;
                            dialogue.initiated = true
                            npcDiv.addEventListener('click', () => {
                                npcDiv.style.display = 'none';
                                lastKey = ''
                                dialogue.initiated = false;
                            })
                        } else {
                            interrogation.position.x = character.position.x + 8;
                            interrogation.position.y = character.position.y - 35                        
                            interrogation.draw()
                            //Initiates poketrainer battle
                            audio.Map.stop()
                            audio.initBattle.play()
                            audio.battle.play()
                            battle.initiated = true
                            window.cancelAnimationFrame(animationId)
                            gsap.to('#overlappingDiv', {
                                opacity: 1,
                                repeat: 3,
                                yoyo: true,
                                duration: 0.5,
                                onComplete() {
                                    gsap.to('#overlappingDiv', {
                                        opacity: 1,
                                        duration: 0.4,
                                        onComplete() {
                                            initBattle()
                                            animateBattle()
                                            gsap.to('#overlappingDiv', {
                                                opacity: 0,
                                                duration: 0.4,
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    }})
                }
        }
    }
// Confere as zonas, se colidir com um personagem e um NPC trainer, dispara uma luta
    for (let i = 0; i < charactersZones.length; i++) {
        const characterZone = charactersZones[i];
        if (rectangularCollisionForNPCBattleFront({
            rectangle1: player,
            rectangle2: {...characterZone, position: {
                x: characterZone.position.x,
                y: characterZone.position.y
            }},
        })) {
            charactersArray.forEach((character) => {
                if (character.position.x === characterZone.position.x) {
                    if (character.isEnemy) {
                        interrogation.position.x = character.position.x + 8;
                        interrogation.position.y = character.position.y - 35                        
                        interrogation.draw()
                        //Initiates poketrainer battle
                        audio.Map.stop()
                        audio.initBattle.play()
                        audio.battle.play()
                        battle.initiated = true
                        window.cancelAnimationFrame(animationId)
                        gsap.to('#overlappingDiv', {
                            opacity: 1,
                            repeat: 3,
                            yoyo: true,
                            duration: 0.5,
                            onComplete() {
                                gsap.to('#overlappingDiv', {
                                    opacity: 1,
                                    duration: 0.4,
                                    onComplete() {
                                        initBattle()
                                        animateBattle()
                                        gsap.to('#overlappingDiv', {
                                            opacity: 0,
                                            duration: 0.4,
                                        })
                                    }
                                })
                            }
                        })
                    }
                }
            })
    }
}
// Confere as zonas de mapa. Se o player colidir com o bloco de entrada do mapa, vai pro novo mapa.
for (let i = 0; i < mapEntersZones.length; i++) {
    const mapZone = mapEntersZones[i];
    if (rectangularCollisionForMap({
        rectangle1: player,
        rectangle2: {...mapZone, position: {
            x: mapZone.position.x,
            y: mapZone.position.y
        }},
    })) {
        if (keys.w.pressed && lastKey === 'w') {                  
            //Initiates map change
            gsap.to('#overlappingDiv', {
                opacity: 1,
                duration: 1,
                onComplete() {
                    gsap.to('#overlappingDiv', {
                        opacity: 1,
                        duration: 1,
                        onComplete() {
                            gsap.to('#overlappingDiv', {
                                opacity: 0,
                                duration: 0.4,
                                onComplete() {
                                }
                            })
                        }
                    })
                }
            })
        }
}
}



    if (keys.w.pressed && lastKey === 'w') {
        player.animate = true;
        player.image = player.sprites.up
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position : {
                    x: boundary.position.x,
                    y: boundary.position.y + 3
                }}
            })) {
                moving = false;
                break;
            }   
        }
        for (let i = 0; i < charactersZones.length; i++) {
            const characterZone = charactersZones[i];
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {...characterZone, position : {
                    x: characterZone.position.x,
                    y: characterZone.position.y + 3
                }}
            })) {
                moving = false;
                break;
            }   
        }

        if (moving) {
            movables.forEach((movable) => {
                movable.position.y += 3
            })
        }
    } else if (keys.a.pressed && lastKey === 'a') {
        player.animate = true;
        player.image = player.sprites.left
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary, 
                    position : {
                    x: boundary.position.x + 3,
                    y: boundary.position.y
                }
              }
            })
            ) {
                moving = false;
                break;
            }   
        }
        for (let i = 0; i < charactersZones.length; i++) {
            const characterZone = charactersZones[i];
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {...characterZone, position : {
                    x: characterZone.position.x + 3,
                    y: characterZone.position.y
                }}
            })) {
                moving = false;
                break;
            }   
        }
        if (moving) {
            for (let i = 0; i < battleZones.length; i++) {
                const battleZone = battleZones[i];
                const overlappingArea = (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width) - Math.max(player.position.x, battleZone.position.x)) * (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height) - Math.max(player.position.y, battleZone.position.y))
                if (rectangularCollision({
                    rectangle1: player,
                    rectangle2: battleZone,
                })&& 
                overlappingArea > (player.width * player.height) / 2) {
                    audio.grassFootStep.play()
                    setTimeout(audio.grassFootStep.stop, 0.1)
            }
        }
            movables.forEach((movable) => {
                movable.position.x += 3
            })
        }
    } else if (keys.s.pressed && lastKey === 's') {
        player.animate = true;
        player.image = player.sprites.down
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary, 
                    position : {
                    x: boundary.position.x,
                    y: boundary.position.y - 3,
                }
              }
            })
            ) {
                moving = false;
                break;
            }   
        }
        for (let i = 0; i < charactersZones.length; i++) {
            const characterZone = charactersZones[i];
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {...characterZone, position : {
                    x: characterZone.position.x,
                    y: characterZone.position.y - 3
                }}
            })) {
                moving = false;
                break;
            }   
        }
        if (moving) {
            movables.forEach((movable) => {
                movable.position.y -= 3
            })
        }
    } else if (keys.d.pressed && lastKey === 'd') {
        player.animate = true;
        player.image = player.sprites.right
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary, 
                    position : {
                    x: boundary.position.x - 3,
                    y: boundary.position.y,
                }
              }
            })
            ) {
                moving = false;
                break;
            }   
        }
        for (let i = 0; i < charactersZones.length; i++) {
            const characterZone = charactersZones[i];
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {...characterZone, position : {
                    x: characterZone.position.x - 3,
                    y: characterZone.position.y
                }}
            })) {
                moving = false;
                break;
            }   
        }
        if (moving) {
            for (let i = 0; i < battleZones.length; i++) {
                const battleZone = battleZones[i];
                const overlappingArea = (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width) - Math.max(player.position.x, battleZone.position.x)) * (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height) - Math.max(player.position.y, battleZone.position.y))
                if (rectangularCollision({
                    rectangle1: player,
                    rectangle2: battleZone,
                })&& 
                overlappingArea > (player.width * player.height) / 2) {
                    audio.grassFootStep.play()
                    setTimeout(audio.grassFootStep.stop, 0.1)
            }
        }
            movables.forEach((movable) => {
                movable.position.x -= 3
            })
        }
    }
}

 animate()

let lastKey = ''
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'e':
            keys.e.pressed = true;
            lastKey = 'e';
        break;
        case 'w':
           keys.w.pressed = true;
           lastKey = 'w';
        break;
        case 'a':
            keys.a.pressed = true;
            lastKey = 'a';
        break;
        case 's':
            keys.s.pressed = true;
            lastKey = 's';
        break;
        case 'd':
            keys.d.pressed = true;
            lastKey = 'd';
        break;
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'e':
            keys.e.pressed = true;
            lastKey = 'e';
        break;
        case 'w':
           keys.w.pressed = false;
        break;
        case 'a':
            keys.a.pressed = false;
        break;
        case 's':
            keys.s.pressed = false;
        break;
        case 'd':
            keys.d.pressed = false;
        break;
    }
})


let clicked = false
window.addEventListener('click', () => {
    if (!clicked) {
    audio.Map.play()
    clicked = true
    }
})