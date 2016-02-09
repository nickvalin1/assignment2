var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('sky', 'assets/background.jpg');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('bubble', 'assets/bubble.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 32);
    game.load.image('block', 'assets/block.png');
    game.load.image('spring', 'assets/spring_burned.png');
    game.load.audio('sfx', 'assets/sfx.mp3');
    game.load.audio('music', 'assets/music.wav');
}
var music;
var background;
var platforms;
var player;
var bubbles;
var score=12;
var scoreText;
var blocks;
var spring;
var restart;
var fx;
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    music=game.add.audio('music');
    music.play();
    
    fx=game.add.audio('sfx');
    fx.allowMultiple=true;
    fx.addMarker('jump', 0, .36,.25);
    fx.addMarker('bubble', .5, .26,.25);
    fx.addMarker('spring', .8, .44,.25);
    
    var background=game.add.sprite(0,0, 'sky');
    background.scale.setTo(.2,.2);
    
    platforms=game.add.group();
    platforms.enableBody=true;
    var ground=platforms.create(0, game.world.height-64, 'ground');
    ground.scale.setTo(2,2);
    ground.body.immovable=true;
    
    var ledge=platforms.create(400,350,'ground');
    ledge.body.immovable=true;
    ledge=platforms.create(-150,150,'ground');
    ledge.body.immovable=true;
    ledge=platforms.create(-275,380,'ground');
    ledge.body.immovable=true;
    
    
    player=game.add.sprite(32, game.world.height-150, 'dude');
    game.physics.arcade.enable(player);
    player.body.bounce.y=.2;
    player.body.gravity.y=300;
    player.body.collideWorldBounds=true;
    player.animations.add('left', [3,4,5], 10, true);
    player.animations.add('right', [6,7,8], 10, true);
    player.scale.setTo(1.25,1.25);
    
    bubbles=game.add.group();
    bubbles.enableBody=true;
    for (var i=0; i<12; i++) {
        var bubble=bubbles.create(i*70, 0, 'bubble');
        bubble.scale.setTo(.1,.1);
        bubble.body.gravity.y=100;
        bubble.body.bounce.y=.7+Math.random()*.2;
    }
    
    blocks=game.add.physicsGroup();
    blocks.enableBody=true;
    var block=blocks.create(350,game.world.height-96, 'block');
    block=blocks.create(80,350, 'block');
    blocks.forEach(addBounds, this);
    
    spring=game.add.sprite(515,250, 'spring');
    spring.scale.setTo(.25,.25);
    game.physics.arcade.enable(spring);
    spring.body.gravity.y=600;
    spring.body.collideWorldBounds=true;
    
    
    scoreText=game.add.text(16,16, 'Bubbles Left: 12', {fontSize: '32px', fill:'#ffffff'});
    
    cursors=game.input.keyboard.createCursorKeys();
    restart=game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR); 
    
}
    
function addBounds(block){
    block.body.collideWorldBounds=true;
    block.body.gravity.y=600;
}

function collectBubble(player, bubble) {
    bubble.kill();
    fx.play('bubble');
    score-=1;
    if (score==0){
        scoreText.text='Bubbles Left: '+score+'  Mission Complete!';
    }
    else {
        scoreText.text='Bubbles Left: '+score;
    }
}

function changeVelocity(block){
    block.body.velocity.x=0;
}
    
function collisionHandler(){
    if (!(player.body.touching.left||player.body.touching.right)){
        fx.play('spring');
        player.body.velocity.y=-475;
    }
}

function update() {
    game.physics.arcade.collide(player,platforms);
    game.physics.arcade.collide(bubbles, platforms);
    game.physics.arcade.collide(player,blocks);
    game.physics.arcade.collide(blocks, platforms);
    game.physics.arcade.collide(blocks,blocks);
    game.physics.arcade.collide(spring, player, collisionHandler);
    game.physics.arcade.collide(spring, platforms);
    game.physics.arcade.collide(spring, blocks);
    game.physics.arcade.overlap(player, bubbles, collectBubble, null, this);
    player.body.velocity.x=0;
    blocks.forEach(changeVelocity, this);
    spring.body.velocity.x=0;
    if (restart.isDown) {
        var first=blocks.getTop();
        var second=blocks.getBottom();
        first.body.x=80;
        first.body.y=350;
        second.body.x=350;
        second.body.y=game.world.height-96;
        spring.body.x=515;
        spring.body.y=250;
    }
    if (cursors.left.isDown) {
        player.body.velocity.x=-150;
        player.animations.play('left');
    }
    else if (cursors.right.isDown) {
        player.body.velocity.x=150;
        player.animations.play('right');
    }
    else {
        player.animations.stop();
        player.frame=1;
    }
    if (cursors.up.isDown && player.body.touching.down) {
        fx.play('jump');
        player.body.gravity.y=300;
        player.body.velocity.y=-275;
    }
    if (cursors.down.isDown &&!player.body.touching.down) {
        player.body.gravity.y=600;
    } 
}