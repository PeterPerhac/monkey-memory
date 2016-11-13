var renderer = PIXI.autoDetectRenderer();
document.body.appendChild(renderer.view);
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);

PIXI.loader
    .add("assets/images/monkey.png")
    .load(setup);

var coin = new Howl({
    src: ['assets/sounds/coin.wav']
});

function setup() {
    var stage = new PIXI.Container();
    var monkey = new PIXI.Sprite(
        PIXI.loader.resources["assets/images/monkey.png"].texture
    );
    monkey.interactive = true;
    monkey.anchor.x = 0.5;
    monkey.anchor.y = 0.5;
    monkey.on('mousedown', onDown);
    monkey.on('touchstart', onDown);
    monkey.position.x = (renderer.width / 2);
    monkey.position.y = (renderer.height / 2);

    stage.addChild(monkey);
    requestAnimationFrame(animate);

    MAX_SCALE = 0.25;
    var angle = 0.00;

    function animate() {
        angle = angle + 0.04;
        var sin = Math.sin(angle);
        monkey.scale.x = 1.00 + MAX_SCALE * sin;
        monkey.scale.y = 1.00 + MAX_SCALE * sin;
        renderer.render(stage);
        requestAnimationFrame(animate);
    }

    function onDown() {
        coin.play();
    }
}

window.onresize = function () {
    renderer.resize(window.innerWidth, window.innerHeight);
}

