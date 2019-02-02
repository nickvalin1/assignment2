class Parts {
    constructor(game, level, player) {
        this.group = game.physics.add.group();
        this.parts = [];
        var coordinates = Parts.levels[level];
        for (var i = 0; i < coordinates.length; i++) {
            this.parts.push(this.makePart(coordinates[i].x, coordinates[i].y));
        }
        this.text = game.add.text(268, 16, 'Parts Left: 10', { fontSize: '24px', fill: '#ffffff' });
        this.text.setScrollFactor(0);
        game.physics.add.collider(this.group, game.layer);
        game.physics.add.overlap(player, this.group, this.collect, null, this);
    }

    makePart(x, y) {
        var part = this.group.create(x, y, 'parts');
        part.body.setGravityY(600);
        part.body.collideWorldBounds = true;
        part.setScale(.1, .1);
        return part
    }

    collect(player, part) {
        this.group.remove(part, true, true);
        this.text.text = 'Parts Left ' + this.group.countActive();
    }

    static get levels() {
        return {
            prototype: [
                { x: 864, y: 150 },
                { x: 15, y: 100 },
                { x: 2208, y: 256 }
            ]
        };
    }
}


