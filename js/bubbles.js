class Bubbles {
    constructor(game, level, player, fx) {
        this.group = game.physics.add.group();
        this.bubbles = [];
        this.fx = fx;
        var coordinates = Bubbles.levels[level];
        for (var i = 0; i < coordinates.length; i++) {
            this.bubbles.push(this.makeBubble(coordinates[i].x, coordinates[i].y));
        }
        this.text = game.add.text(16, 16, 'Bubbles Left: 10', { fontSize: '24px', fill: '#ffffff' });
        this.text.setScrollFactor(0);
        game.physics.add.collider(this.group, game.layer);
        game.physics.add.overlap(player, this.group, this.collect, null, this);
    }

    makeBubble(x, y) {
        var bubble = this.group.create(x, y, 'bubble');
        bubble.setScale(.1, .1);
        bubble.body.setGravityY(-.01);
        bubble.body.collideWorldBounds = true;
        return bubble;
    }

    collect(player, bubble) {
        this.group.remove(bubble, true, true);
        this.fx.play('collect');
        this.text.text = 'Bubbles Left: ' + this.group.countActive();
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