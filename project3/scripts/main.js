//creating the pixi application with the right resolution and other jawns
const app = new PIXI.Application({ 
    width: 800,         // default: 800
    height: 600,        // default: 600
    antialias: true,    // default: false
    transparent: false, // default: false
    resolution: 1       // default: 1
  }
);
//changing background color to something more sky like
app.renderer.backgroundColor = 0x061639;
// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);

// pre-loading our images
app.loader.
    add([
        "media/gameSprites/duck.png"
    ]);
app.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
app.loader.onComplete.add(setup);
app.loader.load();
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
const money = document.querySelector("#money");
        //creating something to hold our search term
        const prefix = "mjr4427-";
        const moneyKey = prefix + "money";
        //getting what is stored at launch
        const storedMoney = localStorage.getItem(moneyKey);
        // if we find a previously set name value, display it
        if (storedMoney){
	       // money.value = storedMoney;
            money.innerHTML = storedMoney;
        }else{
	        money.value = "0"; 
        }
        //adding the event listener
        money.onchange = e=>{ localStorage.setItem(moneyKey, e.target.value); };
        /////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
const numberOfBullets = document.querySelector("#ammoCount");
        //creating something to hold our search term
        const ammoCountKey = prefix + "numberOfBullets";
        //getting what is stored at launch
        const storednumberOfBullets = JSON.parse(localStorage.getItem(ammoCountKey));

        // if we find a previously set name value, display it
        if (storednumberOfBullets)
        {
            if(storednumberOfBullets<10)
            {
                localStorage.setItem(ammoCountKey,10);
            }
            numberOfBullets.innerHTML = storednumberOfBullets;         
        }
        else{
	        numberOfBullets.value = "10"; 
        }
        //adding the event listener
        numberOfBullets.onchange = e=>{ localStorage.setItem(ammoCountKey, e.target.value); };
/////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

const typeOfBullets = document.querySelector("#ammoType");
        //creating something to hold our search term
        const ammoTypeKey = prefix + "typesOfBullets";
        //getting what is stored at launch
        const storedAmmoType = JSON.parse(localStorage.getItem(ammoTypeKey));

        // if we find a previously set name value, display it
        if (storedAmmoType)
        {
            typeOfBullets.innerHTML = storedAmmoType;         
        }
        else
        {
	        typeOfBullets.innerHTML = "6.5"; 
        }
        //adding the event listener
        typeOfBullets.onchange = e=>{ localStorage.setItem(ammoTypeKey, e.target.value); };

/////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////


//out global variables
//anytime these variables change the dom will get updated

let moneyLocal = 0;
// aliases
let stage;

// game variables
let startScene;
let gameScene;
let shopScene;
let tournamentOverScene;

//shop buttons
let upgradeAmmoButton;
let buyBoxButton;
let buyAmmoButton;

let bulletType;

let bullets = [];
let ducks = [];

let paused = true;
//constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

//function that handles the initial set up of the game
function setup() {
    stage = app.stage;
	// Create the start scene
    startScene = new PIXI.Container();
    stage.addChild(startScene);
    startScene.visible = true;
	
	//Create the main game scene and make it invisible
    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);

	//Create the shop scene and make it invisible
    shopScene = new PIXI.Container();
    shopScene.visible = false;
    stage.addChild(shopScene);

    //creating the end game screen and making it invisible
    tournamentOverScene = new PIXI.Container();
    tournamentOverScene.visible = false;
    stage.addChild(tournamentOverScene);

	// #4 - Create labels for all 3 scenes
    createLabelsAndButtons();

    //starting our game loop which is where all the magic happens
	  app.ticker.add(gameLoop);   
    
}

function createLabelsAndButtons()
{
    //creating a button style to help make our labels and stuff
    let buttonStyle = new PIXI.TextStyle({
    fill:0x006600,
    fontSize: 48,
    fontFamily:"Futura"
    });

    //creating a button style to help make our labels and stuff
    let buttonStyleShop = new PIXI.TextStyle({
        fill:0x006600,
        fontSize: 30,
        fontFamily:"Futura"
        });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////start scene////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let startLabel1 = new PIXI.Text("Duck Hunt");
    startLabel1.style = new PIXI.TextStyle({
    fill:0x00cc00,
    fontSize: 96,
    fontFamily:"Futura",
    stroke: 0x006600,
    strokeThickness: 6

    });
startLabel1.x = 150;
startLabel1.y = 50;
startScene.addChild(startLabel1);
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//making the button that starts the game
let startGameScene = new PIXI.Text("Enter Competition");
//making it a button and clickable
startGameScene.style = buttonStyle;
//where on my stage itll live
startGameScene.x = 175;
startGameScene.y = 300;
//making sure it can be clicked
startGameScene.interactive = true;
startGameScene.buttonMode = true;
//basically css for links but pixijs for buttons
startGameScene.on("pointerup",startGame);
startGameScene.on('pointerover',e=>e.target.alpha = 0.7);
startGameScene.on('pointerout',e=>e.currentTarget.alpha = 1.0);
//making sure it gets added to our scene
startScene.addChild(startGameScene);
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//making the button that starts the shop
let startShopScene = new PIXI.Text("Enter Shop");
//making it a button and clickable
startShopScene.style = buttonStyle;
//where on my stage itll live
startShopScene.x = 175;
startShopScene.y = 400;
//making sure it can be clicked
startShopScene.interactive = true;
startShopScene.buttonMode = true;
//basically css for links but pixijs for buttons
startShopScene.on("pointerup",startShop);
startShopScene.on('pointerover',e=>e.target.alpha = 0.7);
startShopScene.on('pointerout',e=>e.currentTarget.alpha = 1.0);
//making sure we add it to scene
startScene.addChild(startShopScene);
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//making the button that starts the shop
let resetGame = new PIXI.Text("Reset Entire Game");
//making it a button and clickable
resetGame.style = buttonStyleShop;
//where on my stage itll live
resetGame.x = 550;
resetGame.y = 550;
//making sure it can be clicked
resetGame.interactive = true;
resetGame.buttonMode = true;
//basically css for links but pixijs for buttons
resetGame.on("pointerup",startGameCompletly);
resetGame.on('pointerover',e=>e.target.alpha = 0.7);
resetGame.on('pointerout',e=>e.currentTarget.alpha = 1.0);
//making sure we add it to scene
startScene.addChild(resetGame);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////gamescene///////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
leaveTournamentButton = new PIXI.Text("Leave Tournament Early");
//making it a button and clickable
leaveTournamentButton.style = buttonStyleShop;
//where on my stage itll live
leaveTournamentButton.x = 495;
leaveTournamentButton.y = 0;
//making sure it can be clicked
leaveTournamentButton.interactive = true;
leaveTournamentButton.buttonMode = true;
//basically css for links but pixijs for buttons
leaveTournamentButton.on("pointerup",end);
leaveTournamentButton.on('pointerover',e=>e.target.alpha = 0.7);
leaveTournamentButton.on('pointerout',e=>e.currentTarget.alpha = 1.0);
//making sure it gets added to our scene
gameScene.addChild(leaveTournamentButton);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////tournamentoverscene///////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//creating label and styling it
let endLabel1 = new PIXI.Text("Congrats on a successful Hunt");
    endLabel1.style = new PIXI.TextStyle({
    fill:0x00cc00,
    fontSize: 50,
    fontFamily:"Futura",
    stroke: 0x006600,
    strokeThickness: 6

    });
    //given it some locations 
    endLabel1.x = 105;
    endLabel1.y = 50;
    tournamentOverScene.addChild(endLabel1);
    /////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//making the button that starts the game
let startMenuGameSceneButton = new PIXI.Text("Return To Menu");
//making it a button and clickable
startMenuGameSceneButton.style = buttonStyle;
//where on my stage itll live
startMenuGameSceneButton.x = 250;
startMenuGameSceneButton.y = 300;
//making sure it can be clicked
startMenuGameSceneButton.interactive = true;
startMenuGameSceneButton.buttonMode = true;
//basically css for links but pixijs for buttons
startMenuGameSceneButton.on("pointerup",startMenu);
startMenuGameSceneButton.on('pointerover',e=>e.target.alpha = 0.7);
startMenuGameSceneButton.on('pointerout',e=>e.currentTarget.alpha = 1.0);
//making sure it gets added to our scene
tournamentOverScene.addChild(startMenuGameSceneButton);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////shop scene///////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//making the button that starts the game
buyAmmoButton = new PIXI.Text("Buy Single Round of Shotgun Shells");
//making it a button and clickable
buyAmmoButton.style = buttonStyleShop;
//where on my stage itll live
buyAmmoButton.x = 300;
buyAmmoButton.y = 300;
//making sure it can be clicked
buyAmmoButton.interactive = true;
buyAmmoButton.buttonMode = true;
//basically css for links but pixijs for buttons
buyAmmoButton.on("pointerup",buyRound);
buyAmmoButton.on('pointerover',e=>e.target.alpha = 0.7);
buyAmmoButton.on('pointerout',e=>e.currentTarget.alpha = 1.0);
//making sure it gets added to our scene
shopScene.addChild(buyAmmoButton);
    /////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//making the button that starts the game
buyBoxButton = new PIXI.Text("Buy Box of Shotgun Shells");
//making it a button and clickable
buyBoxButton.style = buttonStyleShop;
//where on my stage itll live
buyBoxButton.x = 300;
buyBoxButton.y = 400;
//making sure it can be clicked
buyBoxButton.interactive = true;
buyBoxButton.buttonMode = true;
//basically css for links but pixijs for buttons
buyBoxButton.on("pointerup",buyBox);
buyBoxButton.on('pointerover',e=>e.target.alpha = 0.7);
buyBoxButton.on('pointerout',e=>e.currentTarget.alpha = 1.0);
//making sure it gets added to our scene
shopScene.addChild(buyBoxButton);
    /////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//making the button that starts the game
upgradeAmmoButton = new PIXI.Text("Upgrade Shells to Larger ShotSpread");
//making it a button and clickable
upgradeAmmoButton.style = buttonStyleShop;
//where on my stage itll live
upgradeAmmoButton.x = 300;
upgradeAmmoButton.y = 500;
//making sure it can be clicked
upgradeAmmoButton.interactive = true;
upgradeAmmoButton.buttonMode = true;
//basically css for links but pixijs for buttons
upgradeAmmoButton.on("pointerup",upgradeAmmo);
upgradeAmmoButton.on('pointerover',e=>e.target.alpha = 0.7);
upgradeAmmoButton.on('pointerout',e=>e.currentTarget.alpha = 1.0);
//making sure it gets added to our scene
shopScene.addChild(upgradeAmmoButton);
  /////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//making the button that starts the game
returnToMenuButton = new PIXI.Text("Return To Main Menu");
//making it a button and clickable
returnToMenuButton.style = buttonStyleShop;
//where on my stage itll live
returnToMenuButton.x = 100;
returnToMenuButton.y = 100;
//making sure it can be clicked
returnToMenuButton.interactive = true;
returnToMenuButton.buttonMode = true;
//basically css for links but pixijs for buttons
returnToMenuButton.on("pointerup",startMenu);
returnToMenuButton.on('pointerover',e=>e.target.alpha = 0.7);
returnToMenuButton.on('pointerout',e=>e.currentTarget.alpha = 1.0);
//making sure it gets added to our scene
shopScene.addChild(returnToMenuButton);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
//function that increases ammo by one
function buyRound(){
//first setting money down
//grabbing the current amount of money the user has
let amountOfMoneyLocal = JSON.parse(localStorage.getItem(moneyKey));
//making sure it goes up 1 every time
amountOfMoneyLocal--;
//resetting our local storage with the right value
localStorage.setItem(moneyKey,amountOfMoneyLocal);
//gaining access to our dom
money.innerHTML = localStorage.getItem(moneyKey);

//now increasing ammo
let amountOfAmmoLocal = JSON.parse(localStorage.getItem(ammoCountKey));
//making sure we get an extra shell
amountOfAmmoLocal++;
//setting what we need in our local storage
localStorage.setItem(ammoCountKey,amountOfAmmoLocal);
numberOfBullets.innerHTML= localStorage.getItem(ammoCountKey);
manageShop();

//console.log(amountOfMoneyLocal);

}
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
//function that increases ammo by a box
function buyBox(){
//first setting money down
//grabbing the current amount of money the user has
let amountOfMoneyLocal = JSON.parse(localStorage.getItem(moneyKey));
//making sure it goes up 1 every time
amountOfMoneyLocal = amountOfMoneyLocal - 8;
//resetting our local storage with the right value
localStorage.setItem(moneyKey,amountOfMoneyLocal);
//gaining access to our dom
money.innerHTML = localStorage.getItem(moneyKey);
//now increasing ammo
let amountOfAmmoLocal = JSON.parse(localStorage.getItem(ammoCountKey));
//making sure we get an extra shell
amountOfAmmoLocal= amountOfAmmoLocal +20;
//setting what we need in our local storage
localStorage.setItem(ammoCountKey,amountOfAmmoLocal);
numberOfBullets.innerHTML= localStorage.getItem(ammoCountKey);
manageShop();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
function upgradeAmmo()
{
    //first setting money down
    //grabbing the current amount of money the user has
    let amountOfMoneyLocal = JSON.parse(localStorage.getItem(moneyKey));
    //making sure it goes up 1 every time
    amountOfMoneyLocal = amountOfMoneyLocal - 10;
    //resetting our local storage with the right value
    localStorage.setItem(moneyKey,amountOfMoneyLocal);
    //gaining access to our dom
    money.innerHTML = localStorage.getItem(moneyKey);
    if(typeOfBullets.innerHTML == "6.5")
    {
        
        typeOfBullets.innerHTML = "7.5";
        localStorage.setItem(ammoTypeKey,typeOfBullets.innerHTML);
        manageShop();
        return;
    }
    if(typeOfBullets.innerHTML == "7.5")
    {
        typeOfBullets.innerHTML = "8.5";
        localStorage.setItem(ammoTypeKey,typeOfBullets.innerHTML);
        manageShop();
        return;
    }
    if(typeOfBullets.innerHTML == "8.5")
    {
        typeOfBullets.innerHTML = "9.5";
        localStorage.setItem(ammoTypeKey,typeOfBullets.innerHTML);
        manageShop();
        return;
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
//function that handles restarting the game over completly this is mainly for testing purposes
function startGameCompletly()
{
    paused = true;
    tournamentOverScene.visible = false;
    gameScene.visible = false;
    shopScene.visible = false;
    startScene.visible = true;     
    //
    money.innerHTML = 10;
    localStorage.setItem(moneyKey,10);
    //
    numberOfBullets.innerHTML = 5;
    localStorage.setItem(numberOfBullets,5);
    //
    typeOfBullets.innerHTML = 6.5;
    localStorage.setItem(ammoTypeKey,"6.5");

}
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
//function that handles loading the competition, all it does is change the scene appropiatly at the moment
function startGame(){
startScene.visible = false;
shopScene.visible = false;
tournamentOverScene.visible = false;
gameScene.visible = true;
paused = false;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
//function that handles loading the menu after the competition
function startMenu()
{
    paused = true;
    tournamentOverScene.visible = false;
    gameScene.visible = false;
    shopScene.visible = false;
    startScene.visible = true;      
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
//function that handles the opening of the shop
function startShop(){
    paused = true;
    tournamentOverScene.visible = false;
    gameScene.visible = false;
    startScene.visible = false;
    shopScene.visible = true;
    //making sure everytime the shop is loaded the right buttons are made interactable
    upgradeAmmoButton.interactive = false;
    buyAmmoButton.interactive = false;
    buyBoxButton.interactive = false;
    manageShop();
}
//this function will work along with and help manage the shop
function manageShop(){
    //grabbing current amount of money the user has to check a few things
    let amountOfMoneyLocal = JSON.parse(localStorage.getItem(moneyKey));
    //buy single round
    if(amountOfMoneyLocal > 1){
        buyAmmoButton.interactive = true;
    }
    else
    {
        buyAmmoButton.interactive = false;
    }
    //buy box
    if(amountOfMoneyLocal > 9){
        buyBoxButton.interactive = true;
    }
    else
    {
        buyBoxButton.interactive = false;
    }
    //upgrade anni
    if(amountOfMoneyLocal > 10 && typeOfBullets.innerHTML != "9.5")
    {
        upgradeAmmoButton.interactive = true;
    }
    else
    {
        upgradeAmmoButton.interactive = false;
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
//function handles when the tournament is over
function end()
{    
paused = true;

//setting all of our bullets as dead to take care of the shots that missed
for(let i = 0;i<bullets.length;i++)
{
    gameScene.removeChild(bullets[i]);
    bullets[i].isAlive = false;
}
//setting all of our ducks as dead to take care of the shots that missed
for(let i = 0;i<ducks.length;i++)
{
    gameScene.removeChild(ducks[i]);
    ducks[i].isAlive = false;
}

shopScene.visible = false;
startScene.visible = false;
gameScene.visible = false;
tournamentOverScene.visible = true;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
//function that handles the firing of a bullet
function fireBullet(e){

if(!paused){
//passing in the mouse information we need
let xpos = app.renderer.plugins.interaction.mouse.global.x;
let ypos = app.renderer.plugins.interaction.mouse.global.y;
//declaring our bullet not as a bullet yet tho
let b;
if(typeOfBullets.innerHTML=="6.5")
{
    b = new Bullet(0x660000,400,600,15,15,xpos,ypos);
}
else if(typeOfBullets.innerHTML=="7.5")
{
    b = new Bullet(0x660000,400,600,20,20,xpos,ypos);
}
else if(typeOfBullets.innerHTML=="8.5")
{
    b = new Bullet(0x660000,400,600,25,25,xpos,ypos);
}
else{
    b = new Bullet(0x660000,400,600,30,30,xpos,ypos);
}

//adding the bullet to the correct data structure
bullets.push(b);
//making sure the bullet exists in the scene
gameScene.addChild(b);

//grabbing the current numberOfBullets the user has
let numberOfBulletsLocal = JSON.parse(localStorage.getItem(ammoCountKey));
//making sure it goes down 1 every time
numberOfBulletsLocal--;
//resetting our local storage with the right value
localStorage.setItem(ammoCountKey,numberOfBulletsLocal);

//gaining access to our dom
numberOfBullets.innerHTML = localStorage.getItem(ammoCountKey);
}
         


 
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
function releaseDuck(e)
{
if(!paused)
    {
        //random value can only be 1 or 2
        let randomValue = Math.floor(Math.random() * 2) + 1 ;
        if(randomValue == 1)
        {
            let y = Math.floor(Math.random() * 400) + 0 ;
            //creating our duck at its launch location
            let duck = new Duck(-100,y,0);
            //adding duck to our duck list
            ducks.push(duck);
            gameScene.addChild(duck);
        }
        else
        {
            let y = Math.floor(Math.random() * 400) + 0 ;
            //creating our duck at its launch location
            let duck = new Duck(900,y,1);
            //adding duck to our duck list
            ducks.push(duck);
            gameScene.addChild(duck);
        }
        
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
function checkCollisions(e)
{
    if(!paused)
    {
        for(let b of bullets){
            for(let d of ducks){
                if(rectsIntersect(b,d))
                {
                    gameScene.removeChild(d);
                    d.isAlive = false;
                    gameScene.removeChild(b);
                    b.isAlive = false;
                    increaseMoney();
                }
            }
        }

    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
function increaseMoney(e)
{
//grabbing the current amount of money the user has
let amountOfMoneyLocal = JSON.parse(localStorage.getItem(moneyKey));
//making sure it goes up 1 every time
amountOfMoneyLocal++;
//resetting our local storage with the right value
localStorage.setItem(moneyKey,amountOfMoneyLocal);

//gaining access to our dom
money.innerHTML = localStorage.getItem(moneyKey);
}
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
function gameLoop()
{

    if (paused) return;
///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
    //deleting bullets at start to easy fix a bug
    bullets = bullets.filter(b=>b.isAlive);
    ducks = ducks.filter(d=>d.isAlive);
///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
    //IF IN THE RIGHT SCENE CLICKING SHOOTS A BULLET
    if(!paused)
      {
            //adding the ability to shoot a bullet
            app.view.onclick = fireBullet;
      }
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
  //if (paused) return; // keep this commented out for now
 
    // #1 - Calculate "delta time"
    let dt = 1/app.ticker.FPS;
    if (dt > 1/12) dt=1/12;
 
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
   //Making sure Bullets move every frame
    for(let b of bullets)
    {
    b.move(dt);
    }
    //making sure ducks move every frame
    for(let d of ducks)
    {
        d.move(dt);
    }
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
    //retrieiving number of bullets and number of birds left
    let numberOfBullets = JSON.parse(localStorage.getItem(ammoCountKey));
    //conditional that handles when the game exits
    if( numberOfBullets<= 0)
    {
        end();
        return;
    }
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
    //making sure a new duck is released everytime it should be
    // Will execute myCallback every 0.5 seconds 
    
    if(ducks.length <2)
    {
        releaseDuck();
    }
    
    //check for collisions
    checkCollisions();
    //if the user doesnt bag the duck it "dies" so another one can be released
    for(let d of ducks)
    {
        if(d.x>1200||d.x<-200)
        {
            d.isAlive = false;
        }
    }


}
