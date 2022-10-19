class Sprite {
    constructor({position, velocity, image, frames = { max: 1, hold: 10 }, sprites, animate, rotation = 0 }) {
        this.position = position
        this.image = new Image()
        this.frames = { ...frames, val: 0, elapsed: 0 }
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.image.src = image.src
        this.animate = animate
        this.sprites = sprites
        this.opacity = 1
        this.rotation = rotation
    }

    draw() {
        context.save()
        context.translate(this.position.x + this.width / 2, this.position.y + this.height / 2)
        context.rotate(this.rotation)
        context.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2)
        context.globalAlpha = this.opacity
        context.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        );
        context.restore()

        if (!this.animate) return

        if (this.frames.max > 1) {
            this.frames.elapsed++
        }

        if (this.frames.elapsed % this.frames.hold === 0)
        if (this.frames.val < this.frames.max - 1) this.frames.val++
        else this.frames.val = 0
    }
}

class Monster extends Sprite {
    constructor({
        position,
        velocity,
        image,
        frames = { max: 1, hold: 10 },
        sprites, 
        animate,
        rotation = 0,
        isEnemy = false,
        name,
        attacks
    }) {
        super({
            position,
            velocity,
            image,
            frames,
            sprites,
            animate,
            rotation,
            name 
            })
        this.health = 100
        this.isEnemy = isEnemy
        this.name = name
        this.attacks = attacks
    }

    faint() {
        document.querySelector('#dialogue-div').innerHTML = `${this.name} fainted`;
        gsap.to(this.position, {
            y: this.position.y + 20
        })
        gsap.to(this, {
            opacity: 0
        })
    }

    attack({ attack, recipient }) {

        const dialogueDiv = document.querySelector('#dialogue-div');
        dialogueDiv.innerHTML = `${this.name} used ${attack.name}`
        dialogueDiv.style.display = 'block'

        let healthBar = '#foe-health-actual'
        recipient.health -= attack.damage

        if (this.isEnemy) healthBar = '#friend-health-actual'

        let rotation = 1
        if (this.isEnemy) rotation = -2.2
        
        switch(attack.name) {
            case 'RockThrow':
                const rockThrowImage = new Image();
                rockThrowImage.src = './imgs/rockthrow.png'
                const rockthrow = new Sprite({
                    position: {
                        x: this.position.x,
                        y: this.position.y
                    },
                    image: rockThrowImage,
                    frames: {
                        max: 4,
                        hold: 10
                    },
                    animate:true,
                    rotation
                })
                renderedSprites.splice(1, 0, rockthrow)

                gsap.to(rockthrow.position, {
                    x: recipient.position.x + 50,
                    y: recipient.position.y + 30,
                    onComplete: () => {
                        //attack hits
                        audio.rockThrowHit.play()
                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        })
                    gsap.to(recipient.position, {
                        x: recipient.position.x + 10,
                        yoyo: true,
                        duration: 0.08,
                        repeat: 5
                    })
        
                    gsap.to(recipient, {
                        opacity: 0,
                        repeat: 5,
                        yoyo: true,
                        duration: 0.08
                    })
                        renderedSprites.splice(1, 1)
                    }
                })
                break;
            case 'Icepike':
                const icePikeImage = new Image();
                icePikeImage.src = './imgs/icepike.png'
                const icepike = new Sprite({
                    position: {
                        x: this.position.x,
                        y: this.position.y
                    },
                    image: icePikeImage,
                    frames: {
                        max: 3,
                        hold: 10
                    },
                    animate:true,
                    rotation
                })
                renderedSprites.splice(1, 0, icepike)

                gsap.to(icepike.position, {
                    x: recipient.position.x + 50,
                    y: recipient.position.y + 30,
                    onComplete: () => {
                        //attack hits
                        audio.icepikeHit.play()
                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        })
                    gsap.to(recipient.position, {
                        x: recipient.position.x + 10,
                        yoyo: true,
                        duration: 0.08,
                        repeat: 5
                    })
        
                    gsap.to(recipient, {
                        opacity: 0,
                        repeat: 5,
                        yoyo: true,
                        duration: 0.08
                    })
                        renderedSprites.splice(1, 1)
                    }
                })
                break;
            case 'Ember':
                audio.initFireball.play()
                const fireballImage = new Image();
                fireballImage.src = './imgs/fireball.png'
                const fireball = new Sprite({
                    position: {
                        x: this.position.x,
                        y: this.position.y
                    },
                    image: fireballImage,
                    frames: {
                        max: 4,
                        hold: 10
                    },
                    animate:true,
                    rotation
                })
                renderedSprites.splice(1, 0, fireball)

                gsap.to(fireball.position, {
                    x: recipient.position.x,
                    y: recipient.position.y,
                    onComplete: () => {
                        //attack hits
                        audio.fireballHit.play()
                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        })
                    gsap.to(recipient.position, {
                        x: recipient.position.x + 10,
                        yoyo: true,
                        duration: 0.08,
                        repeat: 5
                    })
        
                    gsap.to(recipient, {
                        opacity: 0,
                        repeat: 5,
                        yoyo: true,
                        duration: 0.08
                    })
                        renderedSprites.splice(1, 1)
                    }
                })
                break;
            case 'Tackle':
                const timeLine = gsap.timeline()

                recipient.health -= attack.damage
        
                let movementDistance = 20
                if (this.isEnemy) movementDistance = -20
        
                timeLine.to(this.position, {
                    x: this.position.x - movementDistance
                }).to(this.position, {
                    x: this.position.x + movementDistance * 2,
                    duration: 0.1,
                    onComplete: () => {
                        //enemy gets hit
                        audio.tackleHit.play()
                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        })
                    gsap.to(recipient.position, {
                        x: recipient.position.x + 10,
                        yoyo: true,
                        duration: 0.08,
                        repeat: 5
                    })
        
                    gsap.to(recipient, {
                        opacity: 0,
                        repeat: 5,
                        yoyo: true,
                        duration: 0.08
                    })
        
                    }
                }).to(this.position, {
                    x: this.position.x
                })
                break;
        }
    }

}

class NPC extends Sprite {
    constructor({
        position,
        velocity,
        image,
        frames = { max: 1, hold: 10 },
        sprites, 
        animate,
        rotation = 0,
        isEnemy = false,
        dialogue,
        name,
        monsters
    }) {
        super({
            position,
            velocity,
            image,
            frames,
            sprites,
            animate,
            rotation
            })
        this.isEnemy = isEnemy
        this.name = name
        this.dialogue = dialogue
        this.monsters = monsters

    }
}


class Boundary {
    static width = 48
    static height = 48
    constructor({ position }) {
        this.position = position
        this.width = 48
        this.height = 48
    }

    draw () {
        context.fillStyle = 'rgb(255, 0, 0, 0)'
        context.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}