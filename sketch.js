var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;
var feed, lastFed;
var feedTheDog;

//create feed and lastFed variable here


function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here
  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  feedTheDog = createButton("Feed The dog");
  feedTheDog.position(700, 95);
  feedTheDog.mousePressed(feedDog);
}

function draw() {
  background(46,139,87);
  foodObj.display();

  //write code to read fedtime value from the database 
  database.ref('FeedTime').on("value",readLastFed);

  //write code to display text lastFed time here
  fill("white");
  if(lastFed === 12) {
    text("Last Fed: 12 noon", 350, 30);
  }
  else if(lastFed === 0) {
    text("Last Fed: 12 midnight", 350, 30);
  }
  else if(lastFed > 0 && lastFed < 12) {
    text("Last Fed: " + lastFed + " a.m.", 350, 30);
  }
  else if(lastFed > 12) {
    var lastFedPM = lastFed - 12;
    text("Last Fed: " + lastFedPM + " p.m.", 350, 30);
  }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);
  //write code here to update food stock and last fed time
  foodObj.deductFood();

  database.ref('/').update({
    Food:foodObj.foodStock
  });

  lastFed = hour();
  foodObj.getFedTime(lastFed);

  database.ref('/').update({
    FeedTime:foodObj.lastFed
  });
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function readLastFed(data) {
  lastFed = data.val();

}

