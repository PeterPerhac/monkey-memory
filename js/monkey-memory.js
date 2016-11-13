var renderer = PIXI.autoDetectRenderer();
document.body.appendChild(renderer.view);

// this works in conjunction with the * css style that sets all padding to 0
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

    var btn = buttons[levels[0].button];
    var circle = new PIXI.Graphics();
    circle.beginFill(btn.color);

    // TODO these two values need looking into
    circle.drawCircle(100, 100, btn.radius);
    circle.endFill();

    var btnStart = new PIXI.Sprite(circle.generateTexture());
    btnStart.interactive = true;
    btnStart.anchor.x = 0.5;
    btnStart.anchor.y = 0.5;
    btnStart.on('click', function () {
        coin.play();
    });
    btnStart.on('tap', function () {
        coin.play();
    });
    btnStart.position.x = (renderer.width / 2);
    btnStart.position.y = (renderer.height / 2);
    stage.addChild(btnStart);

    var buttonLabelStyle = {
        fontFamily: "Tahoma, sans-serif",
        fontSize: "24px",
        fill: "#fff",
        stroke: "#000",
        strokeThickness: 5
    };
    var buttonLabel = new PIXI.Text(btn.label, buttonLabelStyle);
    buttonLabel.anchor.x = 0.5;
    buttonLabel.anchor.y = 0.5;
    btnStart.addChild(buttonLabel);

    var messageStyle = {
        fontFamily: "Tahoma, sans-serif",
        fontSize: "26px",
        fill: "#000080",
        stroke: "#fff",
        strokeThickness: 5
    };
    var message = new PIXI.Text(levels[0].message, messageStyle);
    message.anchor.x = 0.5;
    message.anchor.y = 0.5;
    message.x = (renderer.width / 2);
    message.y = (renderer.height / 2) + buttons[0].radius * 2;

    var subMessageStyle = {
        fontFamily: "Tahoma, sans-serif",
        fontSize: "20px",
        fill: "#cc00ff",
        stroke: "#0ff",
        strokeThickness: 3
    };
    var subMessage = new PIXI.Text(levels[0].subMessage, subMessageStyle);
    subMessage.anchor.x = 0.5;
    subMessage.anchor.y = 0.5;
    subMessage.x = (renderer.width / 2);
    subMessage.y = (renderer.height / 2) + buttons[0].radius * 2 + 50;

    stage.addChild(btnStart);
    stage.addChild(message);
    stage.addChild(subMessage);

    renderer.render(stage);
}

// window.onresize = function () {
//     renderer.resize(window.innerWidth, window.innerHeight);
// };


var buttons = [
    // 0 - start the whole thing
    {color: 0xBEEF00, label: 'Start', radius: 100},
    // 1 - continue in the first part of the game
    {color: 0xBEEF00, label: 'Next', radius: 75},
    // 2 - start the second part of the game
    {color: 0xBEEF00, label: 'Proceed', radius: 100},
    // 3 - continue in the second part of the game
    {color: 0xBEEF00, label: 'Next', radius: 75},
    // 4 - end of game => show me the results
    {color: 0xBEEF00, label: 'Results', radius: 150}
];

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
];

