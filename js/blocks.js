class Blocks {
    constructor(game, level, player) {
        this.group = game.physics.add.group();
        this.blocks = [];
        var coordinates = Blocks.levels[level];
        for (var i = 0; i < coordinates.length; i++) {
            this.blocks.push(this.makeBlock(coordinates[i].x, coordinates[i].y));
        }
        game.physics.add.collider(this.group, game.layer);
        game.physics.add.collider(this.group, player, this.pushBlock, null, this);
        game.physics.add.collider(this.group, this.group);
    }

    makeBlock(x, y) {
        var block = this.group.create(x, y, 'block');
        block.body.setGravityY(600);
        block.body.collideWorldBounds = true;
        return block;
    }

    pushBlock(block, player) {
        if (block.body.blocked.right) {
            block.setVelocityX(100);
        }
        if (block.body.blocked.left) {
            block.setVelocityX(-100);
        }
    }

    static get levels() {
        return {
            prototype: [
                { x: 80, y: 350 },
                { x: 350, y: 544 },
            ]
        };
    }
}


