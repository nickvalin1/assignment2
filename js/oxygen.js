class Oxygen {
    constructor(game, level, player) {
        this.group = game.physics.add.group();
        this.o2Level = 100;
        this.tanks = [];
        var coordinates = Oxygen.levels[level];
        for (var i = 0; i < coordinates.length; i++) {
            this.tanks.push(this.makeTank(coordinates[i].x, coordinates[i].y));
        }
        this.text = game.add.text(488, 16, 'Oxygen Level: ' + this.o2Level + '%', { fontSize: '24px', fill: '#ffffff' });
        this.text.setScrollFactor(0);
        game.physics.add.collider(this.group, game.layer);
        game.physics.add.overlap(player, this.group, this.collect, null, this);
        this.timer = game.time.addEvent({
            delay: 1000,
            callback: this.decreaseO2,
            callbackScope: this,
            loop: true
        });
    }

    makeTank(x, y) {
        var tank = this.group.create(x, y, 'oxygen');
        tank.body.setGravityY(600);
        tank.body.collideWorldBounds = true;
        tank.setScale(.015, .015);
        return tank;
    }

    collect(player, tank) {
        this.group.remove(tank, true, true);
        if (this.o2Level < 90) {
            this.o2Level += 10;
        }
        else {
            this.o2Level = 100;
        }
        this.text.text = 'Oxygen Level: ' + this.o2Level + '%';
    }

    decreaseO2() {
        this.o2Level--;
        this.text.text = 'Oxygen Level: ' + this.o2Level + '%';
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



