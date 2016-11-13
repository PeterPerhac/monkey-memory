var renderer = PIXI.autoDetectRenderer();
document.body.appendChild(renderer.view);

// this works in conjunction with the * css style that sets all padding to 0
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";

renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);

PIXI.loader
    .add("assets/images/monkey.png")
    .load(function () {
        setup(0)
    });

var coin = new Howl({
    src: ['assets/sounds/coin.wav']
});

var center = {x: (renderer.width / 2), y: (renderer.height / 2)};
var currentLevel = 0;

function buttonClicked() {
    coin.play();
    if (currentLevel == levels.length - 1) {
        // showResultsPage();
    } else {
        currentLevel = currentLevel + 1;
        setup(currentLevel);
        // startThisLevel(currentLevel);
    }
}

function setup(lvl) {

    function createButton(level) {
        var btnData = buttons[levels[level].button];
        var btn = new PIXI.Graphics();
        btn.interactive = true;
        btn.lineStyle(10, btnData.color, 1);
        btn.beginFill(btnData.color, 0.3);
        var c = {x: 0, y: 0, r: btnData.radius};
        btn.drawCircle(c.x, c.y, c.r);
        btn.endFill();
        btn.hitArea = new PIXI.Circle(c.x, c.y, c.r);

        var buttonLabel = new PIXI.Text(btnData.label, {fontFamily: "monospace", fontSize: "24px", fill: "#00ff00"});
        buttonLabel.anchor.x = 0.5;
        buttonLabel.anchor.y = 0.5;

        btn.position.x = center.x;
        btn.position.y = center.y;
        btn.addChild(buttonLabel);
        btn.on('click', buttonClicked);
        btn.on('tap', buttonClicked);
        return btn;
    }
    function createMessage(message, fontSize, yOffset) {
        var messageStyle = {
            fontFamily: "monospace",
            fontSize: "" + fontSize + "px",
            fill: "#00ff00",
            stroke: "#00dd00",
            strokeThickness: 2
        };
        var msg = new PIXI.Text(message, messageStyle);
        msg.anchor.x = 0.5;
        msg.anchor.y = 0.5;
        msg.x = center.x;
        msg.y = center.y + yOffset;
        return msg;
    }

    function createLevelStartPage(level) {
        var stage = new PIXI.Container();
        stage.addChild(createButton(level));
        stage.addChild(createMessage(levels[level].message, 28, 130));
        stage.addChild(createMessage(levels[level].subMessage, 22, 170));
        return stage;
    }

    renderer.render(createLevelStartPage(lvl));
}

// window.onresize = function () {
//     renderer.resize(window.innerWidth, window.innerHeight);
// };


var buttons = [
    // 0 - start the whole thing
    {color: 0x00FF00, label: 'Start', radius: 100},
    // 1 - continue in the first part of the game
    {color: 0x00FFFF, label: 'Next', radius: 75},
    // 2 - start the second part of the game
    {color: 0x00FF00, label: 'Proceed', radius: 100},
    // 3 - continue in the second part of the game
    {color: 0x00FFFF, label: 'Next', radius: 75},
    // 4 - end of game => show me the results
    {color: 0xFF00FF, label: 'Results', radius: 100}
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
    // {button: 1, numbers: 5, hidingNumbers: false},
    // {button: 1, numbers: 6, hidingNumbers: false},
    // {button: 1, numbers: 7, hidingNumbers: false},
    // {button: 1, numbers: 7, hidingNumbers: false},
    // {button: 1, numbers: 8, hidingNumbers: false},
    // {button: 1, numbers: 8, hidingNumbers: false},
    // {button: 1, numbers: 9, hidingNumbers: false},
    // {button: 1, numbers: 9, hidingNumbers: false},
    {
        button: 2,
        numbers: 3,
        hidingNumbers: true,
        message: "Take a good look before tapping the first number",
        subMessage: "After pressing the first number, the rest will be \"cloaked\""
    },
    {button: 3, numbers: 4, hidingNumbers: true},
    // {button: 3, numbers: 5, hidingNumbers: true},
    // {button: 3, numbers: 6, hidingNumbers: true},
    // {button: 3, numbers: 7, hidingNumbers: true},
    // {button: 3, numbers: 7, hidingNumbers: true},
    // {button: 3, numbers: 8, hidingNumbers: true},
    // {button: 3, numbers: 8, hidingNumbers: true},
    // {button: 3, numbers: 9, hidingNumbers: true},
    // {button: 3, numbers: 9, hidingNumbers: true},
    {
        button: 4,
        numbers: 0,
        hidingNumbers: false,
        message: "Well done.",
        subMessage: "Press the button to review your results"
    }
];

