class Bubbles {
    constructor(game, level, player) {
        this.group = game.physics.add.group();
        this.bubbles = [];
        var coordinates = Bubbles.levels[level];
        for (var i = 0; i < coordinates.length; i++) {
            this.bubbles.push(this.makeBubble(coordinates[i].x, coordinates[i].y));
        }
        game.physics.add.collider(this.group, game.layer);
        game.physics.add.overlap(player, this.group, this.collectBubble, null, this);

    }

    makeBubble(x, y) {
        var bubble = this.group.create(x, y, 'bubble');
        bubble.setScale(.1, .1);
        bubble.body.setGravityY(-.01);
        bubble.body.collideWorldBounds = true;
        return bubble;
    }

    collectBubble(player, bubble) {
        bubble.destroy();
        // fx.play('collect');
        game.score -= 1;
        game.scoreText.text = 'Bubbles Left: ' + game.score;
    }

    static get levels() {
        return {
            prototype: [
                { x: 700, y: 504 },
                { x: 0, y: 348 },
                { x: 650, y: 318 },
                { x: 1091, y: 544 },
                { x: 1091, y: 288 },
                { x: 1155, y: 544 },
                { x: 1155, y: 288 },
                { x: 2083, y: 544 },
                { x: 2291, y: 288 },
                { x: 2115, y: 96 }
            ]
        };
    }
}