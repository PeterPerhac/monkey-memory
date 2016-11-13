var buttons = [
    // 0 - start the whole thing
    {color: '#beef00', label: 'Start', diameter: 150},
    // 1 - continue in the first part of the game
    {color: '#beef00', label: 'Next', diameter: 100},
    // 2 - start the second part of the game
    {color: '#00beef', label: 'Proceed', diameter: 150},
    // 3 - continue in the second part of the game
    {color: '#00beef', label: 'Next', diameter: 100},
    // 4 - end of game => show me the results
    {color: '#cccc00', label: 'Results', diameter: 200}
]

var levels = [
    {
        button: 0,
        numbers: 3,
        hidingNumbers: false,
        message: "Tap numbers in ascending order",
        subMessage: "Timer starts as soon as you press the button"
    },
    {button: 1, numbers: 4, hidingNumbers: false},
    {button: 1, numbers: 5, hidingNumbers: false},
    {button: 1, numbers: 6, hidingNumbers: false},
    {button: 1, numbers: 7, hidingNumbers: false},
    {button: 1, numbers: 7, hidingNumbers: false},
    {button: 1, numbers: 8, hidingNumbers: false},
    {button: 1, numbers: 8, hidingNumbers: false},
    {button: 1, numbers: 9, hidingNumbers: false},
    {button: 1, numbers: 9, hidingNumbers: false},
    {
        button: 2,
        numbers: 3,
        hidingNumbers: true,
        message: "Take a good look before tapping the first number",
        subMessage: "After pressing the first number, the rest will be \"cloaked\""
    },
    {button: 3, numbers: 4, hidingNumbers: true},
    {button: 3, numbers: 5, hidingNumbers: true},
    {button: 3, numbers: 6, hidingNumbers: true},
    {button: 3, numbers: 7, hidingNumbers: true},
    {button: 3, numbers: 7, hidingNumbers: true},
    {button: 3, numbers: 8, hidingNumbers: true},
    {button: 3, numbers: 8, hidingNumbers: true},
    {button: 3, numbers: 9, hidingNumbers: true},
    {button: 3, numbers: 9, hidingNumbers: true},
    {
        button: 4,
        numbers: 0,
        hidingNumbers: false,
        message: "Well done.",
        subMessage: "Press the button to review your results"
    }
]


/**
 * rendering stuff goes here, graphics
 */

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
    var button = new PIXI.Sprite(
        PIXI.loader.resources["assets/images/monkey.png"].texture
    );
    button.interactive = true;
    button.anchor.x = 0.5;
    button.anchor.y = 0.5;
    button.on('mousedown', onDown);
    button.on('touchstart', onDown);
    button.position.x = (renderer.width / 2);
    button.position.y = (renderer.height / 2);


    var messageStyle = {
        fontFamily: 'Tahoma',
        fontSize: '28px',
        fontWeight: 'bold',
        fill: '#00beef',
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 600
    };

    var subMessageStyle = {
        fontFamily: 'Tahoma',
        fontSize: '22px',
        fontStyle: 'italic',
        fill: '#F7EDCA',
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440
    };

    var message = new PIXI.Text(levels[0].message, messageStyle);
    message.anchor.x = 0.5;
    message.anchor.y = 0.5;
    message.x = (renderer.width / 2);
    message.y = (renderer.height / 2) + buttons[0].diameter

    stage.addChild(button);
    stage.addChild(message)
    requestAnimationFrame(animate);

    MAX_SCALE = 0.25;
    var angle = 0.00;

    function animate() {
        angle = angle + 0.04;
        var sin = Math.sin(angle);
        button.scale.x = 1.00 + MAX_SCALE * sin;
        button.scale.y = 1.00 + MAX_SCALE * sin;
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
