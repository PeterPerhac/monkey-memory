var renderer = PIXI.autoDetectRenderer();
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.view);

const SOUND_TAP = new Howl({
    src: ["assets/sounds/tap.wav"]
});
const SOUND_LEVEL_DONE = new Howl({
    src: ['assets/sounds/level-done.wav']
});

const screen = {w: renderer.width, h: renderer.height};
const center = {x: (screen.w / 2), y: (screen.h / 2)};
const TILE_WIDTH = 120;
const TILE_HEIGHT = 150;
const NUMBER_FONT_SIZE = 125;
const NUMBER_X_OFFSET = 20;
const NUMBER_Y_OFFSET = 15;
const PADDING = 10;

var currentLevel = 0;
var numbersLeft = 0;
var gameStage;
var gameEvents = [];

function addGameEvent(source, value) {
    gameEvents.push({level: currentLevel + 1, timestamp: new Date().getTime(), source: source, value: value});
}

function buttonClicked() {
    SOUND_TAP.play();
    if (currentLevel == levels.length - 1) {
        showResultsPage(gameEvents);
    } else {
        gameStage = startLevel(currentLevel);
        renderer.render(gameStage);
        //this goes LAST, so time taken to create and render the stage is not added to user's reaction time
        addGameEvent("button", 0);
    }
}


function numberClicked(event) {
    function cloakNumbers() {
        gameStage.children.forEach(function (c) {
            c.removeChildren();
        });
    }

    addGameEvent("number", event.target['numberValue']);
    numbersLeft = numbersLeft - 1;
    if (numbersLeft == 0) {
        SOUND_LEVEL_DONE.play();
        setupPreLevel(currentLevel + 1);
    } else {
        SOUND_TAP.play();
        gameStage.removeChild(event.target);
        if (levels[currentLevel].hidingNumbers) {
            cloakNumbers();
        }
        renderer.render(gameStage);
    }
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
        btn.interactive = true;
        // Shows hand cursor
        btn.buttonMode = true;
        // Pointers normalize touch and mouse
        btn.on('pointerdown', buttonClicked);
        return btn;
    }

    function createMessage(message, fontSize, yOffset) {
        var messageStyle = {fontFamily: "monospace", fontSize: "" + fontSize + "px", fill: "#00ff00"};
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
        stage.addChild(createMessage(levels[level].message, 28, 150));
        stage.addChild(createMessage(levels[level].subMessage, 22, 190));
        return stage;
    }

    currentLevel = lvl;
    renderer.render(createLevelStartPage(lvl));
}

// I am really enjoying this waterfall here, do not judge!
function startLevel(lvl) {
    function createLevelScreen(level) {
        function generateNumbers(numbers) {
            function getRandomPosition(ps, tw, th, rn) {
                function validPos(p) {
                    function intersectRect(r1, r2) {
                        return !( r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top );
                    }

                    var valid = true;
                    ps.forEach(function (e) {
                        var currentRect = {
                            left: e.x - PADDING, right: e.x + tw + PADDING,
                            top: e.y - PADDING, bottom: e.y + th + PADDING
                        };
                        var underTest = {
                            left: p.x - PADDING, right: p.x + tw + PADDING,
                            top: p.y - PADDING, bottom: p.y + th + PADDING
                        };
                        valid = valid && !intersectRect(underTest, currentRect)
                    });
                    return valid;
                }

                if (rn > 1000) {
                    alert("Failed to calculate available position for number tiles! Try resizing the window.");
                    return;
                }
                var pos = {
                    x: Math.floor(Math.random() * (screen.w - tw)),
                    y: Math.floor(Math.random() * (screen.h - th))
                };
                return (validPos(pos)) ? pos : getRandomPosition(ps, tw, th, rn + 1);
            }

            var a = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            var retArrd = []; //a retarrd, get it?
            for (var i = 0; i < numbers; i++) {
                var r = Math.floor(Math.random() * a.length);
                var picked = a.splice(r, 1);
                var randPos = getRandomPosition(retArrd, TILE_WIDTH, TILE_HEIGHT, 0);
                retArrd.push({value: picked[0], x: randPos.x, y: randPos.y});
            }
            return retArrd;
        }

        function createNumberSprite(no, x, y) {
            var numberSprite = new PIXI.Graphics();
            numberSprite.interactive = true;
            numberSprite.lineStyle(5, 0x00FF00, 1);
            var r = {x: x, y: y, w: TILE_WIDTH, h: TILE_HEIGHT};
            numberSprite.drawRect(r.x, r.y, r.w, r.h);
            //noinspection JSUnresolvedFunction
            numberSprite.hitArea = new PIXI.Rectangle(r.x, r.y, r.w, r.h);

            var buttonLabel = new PIXI.Text("" + no,
                {fontFamily: "monospace", fontSize: "" + NUMBER_FONT_SIZE + "px", fill: "#00ff00"});
            buttonLabel.x = r.x + NUMBER_X_OFFSET;
            buttonLabel.y = r.y + NUMBER_Y_OFFSET;
            numberSprite.addChild(buttonLabel);
            numberSprite.interactive = true;
            // Shows hand cursor
            numberSprite.buttonMode = true;
            // Pointers normalize touch and mouse
            numberSprite.on('pointerdown', numberClicked);
            numberSprite['numberValue'] = no;
            return numberSprite;
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

function showResultsPage(events) {
    if (!events) {
        alert("No game events to analyse.");
        return;
    }
    document.body.removeChild(renderer.view);
    document.getElementById("results-table-div").style.display = 'block';
    const gameStatistics = gameStats(events);
    const score = calculateScore(gameStatistics);
    document.getElementById("score").innerHTML = "" + ((score.correct / score.total) * 100).toFixed(1) + "% (" + score.correct + " of " + score.total + " correct)";
    var jp = document.getElementById('json-placeholder');
    const exportObject = {
        summary: gameStats(gameEvents),
        gameEvents: gameEvents
    };
    jp.innerHTML = JSON.stringify(exportObject, null, 2);
    var templateScript = document.getElementById("result-row-template").innerHTML;
    var template = Handlebars.compile(templateScript);
    document.getElementById("result-rows-holder").innerHTML = template({stats: gameStatistics});

    function calculateScore(stats) {
        var s = {total: stats.length, correct: 0};
        stats.forEach(function (e) {
            if (e.ordered) {
                s.correct = s.correct + 1;
            }
        });
        return s;
    }
}

function gameStats(events) {
    var stats = [];
    highland(events).group('level').toArray(function (groupedDataByLevels) {
        for (var lvl in groupedDataByLevels[0]) {
            if (groupedDataByLevels[0].hasOwnProperty(lvl)) {
                var ls = {level: lvl, ordered: true, clickedOrder: []};
                var levelData = groupedDataByLevels[0][lvl]; //ret: array of events for each level
                var prevValue = 0;
                levelData.forEach(function (event) {
                    const num = event.value;
                    if (num == 0) return;
                    ls.ordered = ls.ordered && (num > prevValue);
                    prevValue = num;
                    ls.clickedOrder.push(num);
                });
                const firstClick = levelData[0].timestamp;
                ls.firstClickTime = levelData[1].timestamp - firstClick;
                ls.totalTimeForLevel = levelData[levelData.length - 1].timestamp - firstClick;
                ls.averageClickTime = (ls.totalTimeForLevel / (levelData.length - 1)).toFixed(1);
                stats.push(ls);
            }
        }
    });
    return stats;
}

function showJsonInPre() {
    var range = document.createRange();
    var selection = window.getSelection();
    selection.removeAllRanges();

    const jp = document.getElementById('json-placeholder');
    jp.style.display = 'block';
    range.selectNodeContents(jp);
    selection.addRange(range);
}

var buttons = [
    // 0 - start the whole thing
    {color: 0x00FF00, label: 'Start', radius: 100},
    // 1 - continue in the first part of the game
    {color: 0x00FFFF, label: 'Next', radius: 75},
    // 2 - start the second part of the game
    {color: 0xFFFF00, label: 'Proceed', radius: 100},
    // 3 - continue in the second part of the game
    {color: 0x00FFFF, label: 'Next', radius: 75},
    // 4 - end of game => show me the results
    {color: 0xFF00FF, label: 'Results', radius: 100}
];

setupPreLevel(0);
SOUND_TAP.once('end', function () {
    SOUND_LEVEL_DONE.play();
}).play();
