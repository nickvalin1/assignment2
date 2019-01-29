class Oxygen {
    constructor(game, level) {
        this.group = game.physics.add.group();
        this.tanks = [];
        var coordinates = Oxygen.levels[level];
        for (var i = 0; i < coordinates.length; i++) {
            this.tanks.push(this.makeTank(coordinates[i].x, coordinates[i].y));
        }
        game.physics.add.collider(this.group, game.layer);
    }

    makeTank(x, y) {
        var tank = this.group.create(x, y, 'oxygen');
        tank.body.setGravityY(600);
        tank.body.collideWorldBounds = true;
        tank.setScale(.015, .015);
        return tank;
    }

    static get levels() {
        return {
            prototype: [
                { x: 2158, y: 544 },
                { x: 1198, y: 384 }
            ]
        };
    }
}



