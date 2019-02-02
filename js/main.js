var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 640,
    parent: "game",
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
}

var game = new Phaser.Game(config);

function preload() {
    this.load.tilemapTiledJSON('map', 'assets/map2.json');
    this.load.image('tiles', 'assets/tiles/tiles.png');
    this.load.image('bg', 'assets/background.jpg');
    this.load.image('bubble', 'assets/bubble.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 32 });
    this.load.image('block', 'assets/block.png');
    this.load.audio('sfx', 'assets/sfx.wav');
    this.load.audio('music', 'assets/music.wav');
    this.load.audio('wind', 'assets/wind.wav');
    this.load.image('oxygen', 'assets/oxygen.png');
    this.load.image('parts', 'assets/parts.jpg');
    this.load.image('tool', 'assets/tool.jpg');
    // this.load.script('filterX', 'https://cdn.rawgit.com/photonstorm/phaser-ce/master/filters/BlurX.js');
    // this.load.script('filterY', 'https://cdn.rawgit.com/photonstorm/phaser-ce/master/filters/BlurY.js');
    // this.load.script('Gray', 'https://cdn.rawgit.com/photonstorm/phaser-ce/master/filters/Gray.js');
}
var player;
var intoText;
var hasTool = false;

function create() {
    // music = this.add.audio('music');
    // music.play();
    // wind = this.add.audio('wind');

    // fx = this.add.audio('sfx');
    // fx.allowMultiple = true;
    // fx.addMarker('jump', 0, .32, .15);
    // fx.addMarker('walk', .5, .7, .25);
    // fx.addMarker('collect', 1.5, .2, 1);

    this.background = this.add.sprite(0, 0, 'bg');
    this.background.setScale(.5, .5);
    this.background.setScrollFactor(0);

    this.map = this.make.tilemap({ key: "map", tileWidth: 32, tileHeight: 32 })
    const tileset = this.map.addTilesetImage("tiles");
    this.layer = this.map.createStaticLayer('Tile Layer 1', tileset, 0, 0);
    this.layer.setCollisionByExclusion([-1, 24, 29]);
    this.physics.world.bounds.width = this.layer.width;
    this.physics.world.bounds.height = this.layer.height;

    // const debugGraphics = this.add.graphics().setAlpha(0.75);
    // this.layer.renderDebug(debugGraphics, {
    //     tileColor: null, // Color of non-colliding tiles
    //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //     faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    // });

    // blurX = this.add.filter('BlurX');
    // blurY = this.add.filter('BlurY');
    // gray = this.add.filter('Gray');

    player = new Player(this);
    this.bubbles = new Bubbles(this, "prototype", player.player);
    this.oxygen = new Oxygen(this, "prototype", player.player);
    this.parts = new Parts(this, "prototype", player.player);
    this.blocks = new Blocks(this, "prototype", player.player);

    tool = this.physics.add.sprite(2350, 0, 'tool');
    tool.setScale(.07, .07);
    tool.body.setGravityY(600);
    tool.body.collideWorldBounds = true;
    this.physics.add.collider(this.layer, tool);
    this.physics.add.overlap(player.player, tool, collectTool, null, this);

    introText = this.add.text(0, 100, "Your ship has crash landed on the newly discovered\nexoplanet MSP-1 leaving you the only survivor. The US\nCongress funded this mission to collect the valuable\nbubbles that Earth desperately needs found only on\nMSP-1. Collect ten bubbles to bring back to Earth\nbefore finding all three parts to repair your ship and\ncomplete your mission.\nBe careful, the oxygen supply is limited...\n\nPress the space bar to remove text.", { fontSize: '24px', fill: '#ffffff', align: 'center' });
    introText.fixedToCamera = true;

    this.input.keyboard.on('keydown_RIGHT', function (event) {
        player.player.setVelocityX(150);
        player.player.anims.play('right', true);
    });
    this.input.keyboard.on('keyup_RIGHT', function (event) {
        player.player.setVelocityX(0);
        player.player.anims.stop();
    });
    this.input.keyboard.on('keydown_LEFT', function (event) {
        player.player.setVelocityX(-150);
        player.player.anims.play('left', true);
    });
    this.input.keyboard.on('keyup_LEFT', function (event) {
        player.player.setVelocityX(0);
        player.player.anims.stop();
    });
    this.input.keyboard.on('keydown_UP', function (event) {
        if (player.player.body.blocked.down || player.player.body.touching.down || hasTool) {
            player.player.body.setGravityY(300);
            player.player.setVelocityY(-500);
        }
    });
    this.input.keyboard.on('keydown_DOWN', function (event) {
        if (!player.player.body.blocked.down) {
            player.player.body.setGravityY(600);
        }
    });
    this.input.keyboard.on('keydown_SPACE', function (event) {
        introText.visible = false;
    });

    this.cameras.main.startFollow(player.player);
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
}

function collectTool(player, tool) {
    tool.destroy();
    this.layer.setCollision(12, collides = false);
    hasTool = true;
}

function applyBlur(object) {
    object.filters = [blurX, blurY];
}
function applyGray(object) {
    object.filters = [blurX, blurY, gray];
}

function update() {

    this.blocks.group.children.iterate(function (child) {
        child.setVelocityX(0);
    });

    if (this.oxygen.o2Level <= 0) {
        this.oxygen.timer.paused = true;
        introText.text = "You have run out of oxygen \nand died on this lifeless planet.\nMission Failed.";
        introText.setScrollFactor(0);
        introText.visible = true;
    }

    if (this.parts.group.countActive() == 0) {
        this.oxygen.timer.paused = true;
        introText.setScrollFactor(0);
        if (this.bubbles.group.countActive() > 0) {
            introText.text = "You have repaired your ship but failed to get \nenough bubbles to complete your mission. You return to \nEarth without the bubbles and without \nyour crew and are seen as a failure.";
        }
        else {
            introText.text = "Congratulations!\nYou have repaired your ship and completed your mission.\nYou are welcomed back to Earth a hero.";
        }
        introText.visible = true;
    }
    /*
    if (oxygen_value < 70) {
        background.filters = [blurX, blurY];
    }
    if (oxygen_value < 60) {
        layer.filters = [blurX, blurY];
    }
    if (oxygen_value < 50) {
        blocks.forEach(applyBlur, this);
        parts.forEach(applyBlur, this);
        oxygen.forEach(applyBlur, this);
        tool.filters = [blurX, blurY];
    }
    if (oxygen_value < 40) {
        bubbles.forEach(applyBlur, this);
    }
    if (oxygen_value < 30) {
        player.filters = [blurX, blurY];
    }
    if (oxygen_value < 20) {
        background.filters = [blurX, blurY, gray];
    }
    if (oxygen_value < 10) {
        layer.filters = [blurX, blurY, gray];
        blocks.forEach(applyGray, this);
        parts.forEach(applyGray, this);
        oxygen.forEach(applyGray, this);
        bubbles.forEach(applyGray, this);
        tool.filters = [blurX, blurY, gray];
        player.filters = [blurX, blurY, gray];
    }
    if (!wind.isPlaying) {
        wind.restart('', 0, .2);
    }
    
    if (oxygen_value > 0) {
        if (partsLeft > 0) {
            if (this.player.body.velocity.x != 0 && this.player.body.onFloor() && (!fx.isPlaying)) {
                fx.play('walk');
            }
            if (this.cursors.up.isDown && (this.player.body.onFloor() || this.player.body.touching.down || score < 4)) {
                fx.pause('walk');
                if (score > 3) {
                    fx.play('jump');
                }
            }
        }
    }
    */
}