//Create variables here
var dog, happyDog;
var dogImage, dogImage1;
var database;
var foodS, foodStock;
var feed, addFood;
var lastFed, fedTime, currentTime;

function preload()
{
	//load images here
  dogImage=loadImage('images/dogImg.png');
  dogImage1=loadImage('images/dogImg1.png');
  bedroomImage=loadImage('images/Bed Room.png');
  washroomImage=loadImage('images/Wash Room.png');
  gardenImage=loadImage('images/Garden.png');
}

function setup() {
	createCanvas(2000, 1000);

  foodObject=new Food();

  database=firebase.database();

  foodStock=database.ref('Food');
  foodStock.on('value',readStock);

  readState=database.ref('gameState');
  readState.on('value',(data)=>{gameState=data.val();});

  database.ref('feedTime').on('value',(data)=>{lastFed=data.val();});

  dog=createSprite(250,300,150,150);
  dog.scale=0.3;
  dog.addImage(dogImage);

  feed=createButton('Feed the dog');
  feed.position(700,95);
  feed.mousePressed(feedDog);
  
  addFood=createButton('Add food');
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}


function draw() {  
  background(255,255,255);

  for(var i=1;i<=foodS;i++){
    //foodObject.position.x=foodObject.position.x+50*i;
    foodObject.display(400+(50*i),220);
  }

  currentTime=hour();

  if(currentTime==lastFed+1){
    update('playing');
    foodObject.garden();
  } else if(currentTime==lastFed+2) {
    update('sleeping');
    foodObject.bedroom();
  } else {
    update('hungry');
    foodObject.display();
  }

  if(gameState!='hungry'){
    feed.hide();
    addFood.hide();
    dog.remove();
  } else {
    feed.show();
    addFood.show();
    dog.addImage(dogImage);
  }

  drawSprites();
  //add styles here
  textSize(15);
  stroke('black');
  text('Food remaining: '+foodS,170,200);
}

function update(state){
  database.ref('/').update({gameState:state});
}

function readStock(data){
  foodS=data.val();
  foodObject.updateFoodStock(foodS);
}

function writeStock(x){
  if(x<=0){
    x=0;
  } else {
    x=x-1;
  }
  database.ref('/').update({Food:x});
}

function feedDog(){
  writeStock(foodS);
  dog.addImage(dogImage1);
  foodObject.updateFoodStock(foodObject.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObject.getFoodStock(),
    feedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}