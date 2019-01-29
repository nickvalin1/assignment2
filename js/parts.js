class Parts {
    constructor(game, level) {
        this.group = game.physics.add.group();
        this.parts = [];
        var coordinates = Parts.levels[level];
        for (var i = 0; i < coordinates.length; i++) {
            this.parts.push(this.makePart(coordinates[i].x, coordinates[i].y));
        }
        game.physics.add.collider(this.group, game.layer);
    }

    makePart(x, y) {
        var part = this.group.create(x, y, 'parts');
        part.body.setGravityY(600);
        part.body.collideWorldBounds = true;
        part.setScale(.1, .1);
        return part
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


