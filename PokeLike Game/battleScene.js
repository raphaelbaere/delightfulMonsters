const battleBackgroundImage = new Image();
battleBackgroundImage.src = './imgs/battleBackground.png';

const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    image: battleBackgroundImage,
});

let goldRacoon

let oneEyed

let renderedSprites

let battleAnimationId

let queue

function initBattle() {
    document.querySelector('#user-interface').style.display = 'block';
    document.querySelector('#dialogue-div').style.display = 'none';
    document.querySelector('#foe-health-actual').style.width = '100%';
    document.querySelector('#friend-health-actual').style.width = '100%';
    document.querySelector('#attack-div').replaceChildren()


    goldRacoon = new Monster(monsters.GoldRaccon)
    oneEyed = new Monster(monsters.OneEyed)
    renderedSprites = [goldRacoon, oneEyed];
    queue = []

    oneEyed.attacks.forEach((attack) => {
        const button = document.createElement('button');
        button.innerHTML = attack.name
        const attackDiv = document.querySelector('#attack-div')
        attackDiv.appendChild(button)
        })

        const buttons = document.querySelectorAll('button');

buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
        const attackName = event.currentTarget.innerHTML
        oneEyed.attack({ 
            attack: attacks[attackName],
            recipient: goldRacoon,
            renderedSprites
        })

        if (goldRacoon.health <= 0) {
            queue.push(() => {
                goldRacoon.faint()
                audio.battle.stop()
                audio.bruno.play()
            })
            queue.push(() => {
                //fade back to black
                gsap.to('#overlappingDiv', {
                    opacity: 1,
                    onComplete: () => {
                        window.cancelAnimationFrame(battleAnimationId)
                        animate()
                        document.querySelector('#user-interface').style.display = 'none';
                        gsap.to('#overlappingDiv', {
                            opacity: 0
                        })
                        battle.initiated = false
                        audio.victory.stop()
                        audio.Map.play()
                    }
                })
            })
        }
        // enemy attacks here
        const randomAttack = goldRacoon.attacks[Math.floor(Math.random() * goldRacoon.attacks.length)]

        queue.push(() => {
            goldRacoon.attack({ 
                attack: randomAttack,
                recipient: oneEyed,
                renderedSprites
            })

            if (oneEyed.health <= 0) {
                queue.push(() => {
                    oneEyed.faint()
                    audio.battle.stop()
                    audio.lostBattle.play()
                })

                queue.push(() => {
                    //fade back to black
                    gsap.to('#overlappingDiv', {
                        opacity: 1,
                        onComplete: () => {
                            window.cancelAnimationFrame(battleAnimationId)
                            animate()
                            document.querySelector('#user-interface').style.display = 'none';
                            gsap.to('#overlappingDiv', {
                                opacity: 0
                            })
                            battle.initiated = false
                            audio.battle.stop()
                            audio.Map.play()
                        }
                    })
                })
            }
        })
    })  
    button.addEventListener('mouseenter', (event) => {
        const attackTypeHTML = document.querySelector('#attack-type');
        const damageTypeHTML = document.querySelector('#damage-type');
        attackTypeHTML.innerHTML = `ATTACK TYPE/${attacks[event.currentTarget.innerHTML].type}`
        attackTypeHTML.style.color = attacks[event.currentTarget.innerHTML].color
        damageTypeHTML.innerHTML = `${attacks[event.currentTarget.innerHTML].damageType} ATTACK`
    })
})

}

function animateBattle() {
    battleAnimationId = window.requestAnimationFrame(animateBattle)
    battleBackground.draw()
    renderedSprites.forEach((sprite) => {
        sprite.draw()
    })
}

document.querySelector('#dialogue-div').addEventListener('click', (event) => {
    if (queue.length > 0) {
        queue[0]();
        queue.shift();
    } else {
        event.currentTarget.style.display = 'none'
    }
})