class Player {
    constructor(game) {
        this.player = game.physics.add.sprite(32, 500, 'dude');
        this.player.setBounceY(.2);
        this.player.body.setGravityY(300);
        this.player.body.collideWorldBounds = true;
        game.anims.create({
            key: "left",
            frames: game.anims.generateFrameNumbers('dude', { start: 3, end: 5 }),
            frameRate: 10,
            repeat: true
        })
        game.anims.create({
            key: "right",
            frames: game.anims.generateFrameNumbers('dude', { start: 6, end: 8 }),
            frameRate: 10,
            repeat: true
        })
        this.player.setScale(1.25, 1.25);
        game.physics.add.collider(this.player, game.layer);
    }
}