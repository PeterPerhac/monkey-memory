var renderer = PIXI.autoDetectRenderer();
document.body.appendChild(renderer.view);
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);

PIXI.loader
    .add("assets/images/monkey.png")
    .load(setup);

function setup(){
    var stage = new PIXI.Container();
    var monkey = new PIXI.Sprite(
            PIXI.loader.resources["assets/images/monkey.png"].texture
            );
    monkey.interactive = true;
    monkey.on('mousedown', onDown);
    monkey.on('touchstart', onDown);
    monkey.position.x = (renderer.width / 2) - 200;
    monkey.position.y = (renderer.height / 2) - 100;
    stage.addChild(monkey);
    requestAnimationFrame(animate);

    function animate() {
        renderer.render(stage);
        requestAnimationFrame( animate );
    }

    function onDown (eventData) {
        var coin = new Howl({
src: ['assets/sounds/coin.wav']
});

coin.play();
}
}
window.onresize = function (event){ 
    renderer.resize(window.innerWidth, window.innerHeight);
}

