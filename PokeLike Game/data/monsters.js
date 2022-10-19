const monsters = {
    OneEyed: {
        position: {
            x: 220,
            y:286
        },
        image: {
            src: './imgs/oneEyed.png'
        },
        frames: {
            max: 4,
            hold: 30
        },
        animate: true,
        health: 100,
        name: 'Eyie',
        attacks: [attacks.Tackle, attacks.Ember, attacks.Icepike, attacks.RockThrow]
    },
    GoldRaccon: {
        position: {
            x: 700,
            y: 105
        },
        image: {
            src: './imgs/goldRacoon.png'
        },
        frames: {
            max: 3,
            hold: 30
        },
        animate: true,
        health: 100,
        isEnemy: true,
        name: 'Scorter',
        attacks: [attacks.Tackle, attacks.Ember]
    }
}