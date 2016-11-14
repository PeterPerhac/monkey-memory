var renderer = PIXI.autoDetectRenderer();
document.body.appendChild(renderer.view);

// this works in conjunction with the * css style that sets all padding to 0
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";

renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);

PIXI.loader
    .add("assets/sounds/wooo.wav")
    .add("assets/sounds/tap.wav")
    .load(function () {
        setupPreLevel(0);
    });

var tap = new Howl({
    src: ["assets/sounds/tap.wav"]
});

const screen = {w: renderer.width, h: renderer.height};
const center = {x: (screen.w / 2), y: (screen.h / 2)};
var currentLevel = 0;
var numbersLeft = 0;
var gameStage;
const tileWidth = 70;
const tileHeight = 100;
const PADDING = 10;

function buttonClicked() {
    tap.play();
    if (currentLevel == levels.length - 1) {
        // showResultsPage();
    } else {
        gameStage = startLevel(currentLevel);
        renderer.render(gameStage);
    }
}


function numberClicked(event) {
    tap.play();
    numbersLeft = numbersLeft - 1;
    if (numbersLeft == 0) {
        setupPreLevel(currentLevel + 1);
    } else {
        gameStage.removeChild(event.target);
        if (levels[currentLevel].hidingNumbers) {
            cloakNumbers();
        }
        renderer.render(gameStage);
    }
}

function cloakNumbers() {
    gameStage.children.forEach(function (c) {
        c.removeChildren();
    });
}


function setupPreLevel(lvl) {

    function createButton(level) {
        var btnData = buttons[levels[level].button];
        var btn = new PIXI.Graphics();
        btn.interactive = true;
        btn.lineStyle(10, btnData.color, 1);
        btn.beginFill(btnData.color, 0.3);
        var c = {x: 0, y: 0, r: btnData.radius};
        btn.drawCircle(c.x, c.y, c.r);
        btn.endFill();
        //noinspection JSUnresolvedFunction
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
            fill: "#00ff00"
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

    currentLevel = lvl;
    new Howl({
        src: ['assets/sounds/wooo.wav']
    }).play();
    renderer.render(createLevelStartPage(lvl));
}


function startLevel(lvl) {

    function createLevelScreen(level) {
        function generateNumbers(numbers) {
            var recursionNo = 0;

            function getRandomPosition(ps, tw, th) {
                function validPos(p) {
                    function intersectRect(r1, r2) {
                        return !(
                            r2.left > r1.right ||
                            r2.right < r1.left ||
                            r2.top > r1.bottom ||
                            r2.bottom < r1.top
                        );
                    }

                    var valid = true;
                    ps.forEach(function (e) {
                        var curreRect = {
                            left: e.x - PADDING,
                            right: e.x + tw + PADDING,
                            top: e.y - PADDING,
                            bottom: e.y + th + PADDING
                        };
                        var underTest = {
                            left: p.x - PADDING,
                            right: p.x + tw + PADDING,
                            top: p.y - PADDING,
                            bottom: p.y + th + PADDING
                        };
                        valid = valid && !intersectRect(underTest, curreRect)
                    });
                    return valid;
                }

                recursionNo = recursionNo + 1;
                if (recursionNo > 1000) {
                    alert("Failed to calculate available position for number tiles! Try resizing the window.");
                    return;
                }
                var pos = {
                    x: Math.floor(Math.random() * (screen.w - tw)),
                    y: Math.floor(Math.random() * (screen.h - th))
                };
                return (validPos(pos)) ? pos : getRandomPosition(ps, tw, th);
            }

            var a = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            var rt = [];
            for (var i = 0; i < numbers; i++) {
                var r = Math.floor(Math.random() * a.length);
                var a2 = a.splice(r, 1);
                var randPos = getRandomPosition(rt, tileWidth, tileHeight);
                rt.push({value: a2[0], x: randPos.x, y: randPos.y});
            }
            return rt;
        }

        function createNumberSprite(no, x, y) {
            var num = new PIXI.Graphics();
            num.interactive = true;
            num.lineStyle(5, 0x00FF00, 1);
            var r = {x: x, y: y, w: 70, h: 100};
            num.drawRect(r.x, r.y, r.w, r.h);
            //noinspection JSUnresolvedFunction
            num.hitArea = new PIXI.Rectangle(r.x, r.y, r.w, r.h);

            var buttonLabel = new PIXI.Text("" + no, {fontFamily: "monospace", fontSize: "72px", fill: "#00ff00"});
            buttonLabel.x = r.x + 15;
            buttonLabel.y = r.y + 15;
            num.addChild(buttonLabel);

            num.on('click', numberClicked);
            num.on('tap', numberClicked);
            return num;
        }

        var stage = new PIXI.Container();
        var levelData = levels[level];
        numbersLeft = levelData.numbers;
        generateNumbers(numbersLeft).forEach(function (n) {
            stage.addChild(createNumberSprite(n.value, n.x, n.y));
        });
        return stage;
    }

    return createLevelScreen(lvl);
}

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
        message: "Click numbers in ascending order (low to high)",
        subMessage: "Timer starts as soon as you press the button above."
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
        subMessage: "Numbers will be hidden after first click"
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
