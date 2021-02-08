var monkey, monkey_running, monkey_collided;
var banana, bananaImage, obstacle, obstacleImage;
var FoodGroup, obstacleGroup;
var score;
var ground, invisibleGround, groundImage, ground2;
var gameState, survivalTime,bananas;
var restart, restartImage;

function preload() {


  monkey_running = loadAnimation("sprite_0.png", "sprite_1.png", "sprite_2.png", "sprite_3.png", "sprite_4.png", "sprite_5.png", "sprite_6.png", "sprite_7.png", "sprite_8.png");
  
  monkey_collided = loadImage("sprite_8.png")
  monkeyImage = loadImage("sprite_5.png");

  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");

  groundImage = loadImage("ground_image.png");
  
  restartImage = loadImage("restart.png");

}



function setup() {
  createCanvas(500, 425);

  monkey = createSprite(50, 350, 100, 100);
  monkey.addAnimation("running", monkey_running);
  monkey.scale = 0.145

  ground = createSprite(250, 475, 510, 4)
  ground.addImage(groundImage);
  ground.velocityX = -7;


  invisibleGround = createSprite(250, 395, 500, 10);
  invisibleGround.visible = false;

  //  console.log(ground.width);

  obstacleGroup = new Group();
  bananaGroup = new Group();

  gameState = "play";
  survivalTime = 0;
  bananas = 0;
  
  monkey.debug = true;
  monkey.setCollider("rectangle",-50,0,450,550)
//  obstacle.debug = true
  
  restart = createSprite(250,250,100,100)
  restart.addImage(restartImage);
  restart.scale = 0.3
  restart.visible = false;
}


function draw() {
  background("225");

  text("bananas "+bananas,400,25);
  text("survival time "+survivalTime,400,10);

  if (gameState === "play") {

    survivalTime = Math.round(frameCount/frameRate());
    calcBananas();
    
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    ground.velocityX = -(7 + survivalTime/10)

    spawnObstacles();

    spawnFood();
    
    if(monkey.isTouching(obstacleGroup)){
      gameState = "over";
    } 
    
    //    console.log(monkey.velocityY)
// JUMP MONKEY
    if (keyDown("space") && monkey.y > 300) {
      monkey.velocityY = -15
    }
    monkey.velocityY = monkey.velocityY + 1;
    monkey.collide(invisibleGround);
  }
  /* GAMESTATE "OVER" */
  else if (gameState === "over") {
    textSize(20)
    text("game over",200, 190);
    ground.velocityX = 0;
    monkey.addImage(monkeyImage);
    monkey.velocityX = 0;
    monkey.velocityY = 0;
    obstacleGroup.setVelocityXEach(0);
    obstacleGroup.setLifetimeEach(-1);
    bananaGroup.setVelocityXEach(0);
    monkey.addImage("collided",monkey_collided);
    restart.visible = true;
  }
  
  if(mousePressedOver(restart) && gameState === "over"){
    gameState = "play";
    restart.visible = false;
    obstacleGroup.destroyEach();
    survivalTime = 0;
    bananaGroup.destroyEach();
    bananas = 0;
    frameCount = 0;
  }

  drawSprites();
}


function spawnObstacles() {
  if (frameCount % 200 === 0) {
    obstacle = createSprite(width, 360, 10, 10)
    obstacle.lifetime = 100;
    obstacle.addImage(obstacleImage)
    obstacle.scale = 0.2
    obstacle.velocityX = -(7 + survivalTime/10)
    obstacle.setCollider("rectangle",-50,0,500,250,-50)

    obstacleGroup.add(obstacle)
  }
}

function spawnFood() {
  if (frameCount % 100 === 0) {
    banana = createSprite(510, 10);
    banana.addImage(bananaImage);
    banana.scale = 0.15;
    banana.y = Math.round(random(150, 350));
    banana.velocityX = -(7 + survivalTime/10)
    banana.lifetime = 100;

    bananaGroup.add(banana);
  }
    if(bananaGroup.isTouching(obstacleGroup)){
    banana.x = banana.x + 5
  }
}

function calcBananas(){
  if(monkey.isTouching(bananaGroup)){
    bananas = bananas + 1;
    bananaGroup.destroyEach();
  }  
}


