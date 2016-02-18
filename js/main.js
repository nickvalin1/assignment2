var game = new Phaser.Game(800, 640, Phaser.WEBGL, 'game', { preload: preload, create: create, update: update });

function preload() {
    game.load.tilemap('map', 'assets/map2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/tiles/tiles.png');
    game.load.image('bg', 'assets/background.jpg');
    game.load.image('bubble', 'assets/bubble.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 32);
    game.load.image('block', 'assets/block.png');
    game.load.audio('sfx', 'assets/sfx.wav');
    game.load.audio('music', 'assets/music.wav');
    game.load.audio('wind', 'assets/wind.wav');
    game.load.image('oxygen', 'assets/oxygen.png');
    game.load.image('parts', 'assets/parts.jpg');
    game.load.image('tool', 'assets/tool.jpg');
    game.load.script('filterX', 'https://cdn.rawgit.com/photonstorm/phaser/master/filters/BlurX.js');
    game.load.script('filterY', 'https://cdn.rawgit.com/photonstorm/phaser/master/filters/BlurY.js');
    game.load.script('Gray', 'https://cdn.rawgit.com/photonstorm/phaser/master/filters/Gray.js');
}
var music;
var wind;
var background;
var map;
var layer;
var player;
var bubbles;
var oxygen;
var parts;
var score=10;
var partsLeft=3;
var oxygen_value=100;
var scoreText;
var partsText;
var oxygenText;
var tool;
var hasTool=false;
var blocks;
var restart;
var fx;
var introText;
var blurX;
var blurY;
var gray;
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    music=game.add.audio('music');
    music.play();
    wind=game.add.audio('wind');
    
    fx=game.add.audio('sfx');
    fx.allowMultiple=true;
    fx.addMarker('jump', 0, .32,.15);
    fx.addMarker('walk', .5, .7,.25);
    fx.addMarker('collect', 1.5, .2,1);
    
    background=game.add.sprite(0,0, 'bg');
    background.scale.setTo(.5,.5);
    
    map=game.add.tilemap('map');
    map.addTilesetImage('tiles');
    map.setCollisionByExclusion([0,24,29]);
    layer=map.createLayer('Tile Layer 1');
    layer.resizeWorld();
    
    blurX = game.add.filter('BlurX');
    blurY = game.add.filter('BlurY');
    gray=game.add.filter('Gray');
    
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
    makeBubble(700,504);
    makeBubble(0,348);
    makeBubble(650, 318);
    makeBubble(1088+3,544);
    makeBubble(1088+3, 288);
    makeBubble(1152+3, 544);
    makeBubble(1152+3, 288);
    makeBubble(2080+3,544);
    makeBubble(2288+3,288);
    makeBubble(2112+3,96);
    
    oxygen=game.add.group();
    oxygen.enableBody=true;
    makeTank(2144+14,544);
    makeTank(1184+14,384);
    
    parts=game.add.group();
    parts.enableBody=true;
    makePart(864,150);
    makePart(15,100);
    makePart(2208,256);
    
    blocks=game.add.physicsGroup();
    blocks.enableBody=true;
    var block=blocks.create(350,game.world.height-96, 'block');
    block=blocks.create(80,350, 'block');
    blocks.forEach(addBounds, this);
    
    tool=game.add.sprite(2350,0, 'tool');
    tool.scale.setTo(.07,.07);
    game.physics.arcade.enable(tool);
    tool.body.gravity.y=600;
    tool.body.collideWorldBounds=true;
    
    scoreText=game.add.text(16,16, 'Bubbles Left: 10', {fontSize: '28px', fill:'#ffffff'});
    scoreText.fixedToCamera=true;
    partsText=game.add.text(268,16, 'Parts Left: 10', {fontSize: '28px', fill:'#ffffff'});
    partsText.fixedToCamera=true;
    oxygenText=game.add.text(488,16, 'Oxygen Level: '+oxygen_value+'%', {fontSize: '28px', fill:'#ffffff'});
    oxygenText.fixedToCamera=true;
    game.time.events.loop(Phaser.Timer.SECOND, decreaseOxygen, this);
    
    introText=game.add.text(50,100,"Your ship has crash landed on the newly discovered \nexoplanet MSP-1 leaving you the only survivor. The US \nCongress funded this mission to collect the valuable \nbubbles that Earth desperately needs found only on \nMSP-1. Collect ten bubbles to bring back to Earth \nbefore finding all three parts to repair your ship and \ncomplete your mission. \nBe careful, the oxygen supply is limited...\n\nPress the space bar to remove text.",{fontSize: '28px', fill:'#ffffff', align: 'center'});
    introText.fixedToCamera=true;
    
    cursors=game.input.keyboard.createCursorKeys();
    restart=game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR); 
    
    game.camera.follow(player);
    
}
    
function decreaseOxygen(){
    if (oxygen_value>0&&partsLeft>0){
        oxygen_value--;
        oxygenText.text='Oxygen Level: '+oxygen_value+'%';
    }
}

function makeBubble(x,y){
    var bubble=bubbles.create(x,y,'bubble');
    bubble.scale.setTo(.1,.1);
    bubble.body.gravity.y=-.01;
    bubble.body.collideWorldBounds=true;
}

function makeTank(x,y){
    var tank=oxygen.create(x,y,'oxygen');
    tank.body.gravity.y=600;
    tank.scale.setTo(.015,.015);
}

function makePart(x,y){
    var part=parts.create(x,y,'parts');
    part.body.gravity.y=600;
    part.scale.setTo(.1,.1);
}

function addBounds(block){
    block.body.collideWorldBounds=true;
    block.body.gravity.y=600;
}

function collectBubble(player, bubble) {
    bubble.kill();
    fx.play('collect');
    score-=1;
    scoreText.text='Bubbles Left: '+score;
}

function collectPart(player, part) {
    part.kill();
    partsLeft-=1;
    partsText.text='Parts Left '+partsLeft;
}

function collectTank(player, tank) {
    tank.kill();
    if (oxygen_value<90){
        oxygen_value+=10;
    }
    else {
        oxygen_value=100;       
    }
    oxygenText.text='Oxygen Level: '+oxygen_value+'%';
}

function changeVelocity(block){
    block.body.velocity.x=0;
}

function collectTool(player, tool){
    tool.kill();
    hasTool=true;
}

function collisionTest(){
    if (player.body.velocity.y<0){
        return false;
    }
    return true;
}
function applyBlur(object){
    object.filters=[blurX,blurY];
}
function applyGray(object){
    object.filters=[blurX,blurY,gray];
}

function update() {
    game.physics.arcade.collide(layer, player);
    game.physics.arcade.collide(layer, blocks);
    game.physics.arcade.collide(layer, bubbles);
    game.physics.arcade.collide(layer, oxygen);
    game.physics.arcade.collide(layer, parts);
    game.physics.arcade.collide(layer, tool);
    game.physics.arcade.collide(player,blocks);
    game.physics.arcade.collide(blocks,blocks);
    game.physics.arcade.overlap(player, bubbles, collectBubble, null, this);
    game.physics.arcade.overlap(player, oxygen, collectTank, null, this);
    game.physics.arcade.overlap(player, parts, collectPart, null, this);
    game.physics.arcade.overlap(player, tool, collectTool, null, this);
    player.body.velocity.x=0;
    blocks.forEach(changeVelocity, this);
    if (oxygen_value<70){
        background.filters=[blurX,blurY];
    }
    if (oxygen_value<60){
        layer.filters=[blurX,blurY];
    }
    if (oxygen_value<50){
        blocks.forEach(applyBlur,this);
        parts.forEach(applyBlur,this);
        oxygen.forEach(applyBlur,this);
        tool.filters=[blurX,blurY];
    }
    if (oxygen_value<40){
        bubbles.forEach(applyBlur,this);
    }
    if (oxygen_value<30){
        player.filters=[blurX,blurY];
    }
    if (oxygen_value<20){
        background.filters=[blurX,blurY,gray];
    }
    if (oxygen_value<10){
        layer.filters=[blurX,blurY,gray];
        blocks.forEach(applyGray, this);
        parts.forEach(applyGray, this);
        oxygen.forEach(applyGray, this);
        bubbles.forEach(applyGray, this);
        tool.filters=[blurX,blurY,gray];
        player.filters=[blurX,blurY,gray];
    }
    if(!wind.isPlaying){
        wind.restart('',0,.2);
    }
    if (oxygen_value>0){
        if (partsLeft>0){
            if (hasTool==true){
                map.setCollision(12, collides=false);
            }
            if (restart.isDown) {
                introText.visible=false;
                var first=blocks.getTop();
                var second=blocks.getBottom();
                first.body.x=80;
                first.body.y=350;
                second.body.x=350;
                second.body.y=game.world.height-96;
                player.body.x=32;
                player.body.y=game.world.height-150;
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
            if (player.body.velocity.x!=0&&player.body.onFloor()&&(!fx.isPlaying)){
                fx.play('walk');
            }
            if (cursors.up.isDown && (player.body.onFloor()||player.body.touching.down||score<4)) {
                fx.pause('walk');
                if (score>3){
                    fx.play('jump');
                }
                player.body.gravity.y=300;
                player.body.velocity.y=-300;
            }
            if (cursors.down.isDown &&(!player.body.onFloor()||player.body.touching.down)) {
                player.body.gravity.y=600;
            }
        }
        else if (partsLeft==0&&score>0){
            introText.text="You have repaired your ship but failed to get \nenough bubbles to complete your mission. You return to \nEarth without the bubbles and without \nyour crew and are seen as a failure.";
            introText.visible=true;
        }
        else if (partsLeft==0&&score==0){
            introText.text="Congratulations!\nYou have repaired your ship and completed your mission.\nYou are welcomed back to Earth a hero.";
            introText.visible=true;
        }
    }
    else{
        introText.text="You have run out of oxygen \nand died on this lifeless planet.\nMission Failed.";
        introText.visible=true;
    }
}