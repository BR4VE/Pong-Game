(function () {
    //----------------------------------
    var CSS = {
        arena: {
            width: 900,
            height: 600,
            background: '#62247B',
            position: 'fixed',
            top: '50%',
            left: '50%',
            zIndex: '999',
            transform: 'translate(-50%, -50%)'
        },
        ball: {
            width: 15,
            height: 15,
            position: 'absolute',
            top: 0,
            left: 350,
            borderRadius: 50,
            background: '#C6A62F'
        },
        line: {
            width: 0,
            height: 600,
            borderLeft: '2px dashed #C6A62F',
            position: 'absolute',
            top: 0,
            left: '50%'
        },
        stick: {
            width: 12,
            height: 85,
            position: 'absolute',
            background: '#C6A62F'
        },
        stick1: {
            left: 0,
            top: 150
        },
        stick2: {
            left: 888,
            top: 150
        },
        scoreBoard1: {
            width: 50,
            top: 0,
            left: 400,
            height: 20,
            position: 'absolute',
            background: 'rgb(0,0,0,0.4)',
            textAlign: "center"
        },
        scoreBoard2: {
            width: 50,
            top: 0,
            left: 450,
            height: 20,
            position: "absolute",
            background: "rgb(0,0,0,0.4)",
            textAlign: "center"
        },
        ballTrails: []
    };

    var CONSTS = {
    	gameSpeed: 20,
        score1: 0,
        score2: 0,
        stick1Speed: 0,
        stick2Speed: 0,
        ballTopSpeed: 0,
        ballLeftSpeed: 0,
    };

    function start() {
        setEvents();
        // check local storage if the game continious
        var gameSettingsCONSTS = JSON.parse(localStorage.getItem("gameSettingsCONSTS"));
        var gameSettingsCSS = JSON.parse(localStorage.getItem("gameSettingsCSS"));
        // if they are exist
        if(gameSettingsCSS && gameSettingsCONSTS) {
            CONSTS = gameSettingsCONSTS;
            CSS = gameSettingsCSS;
            draw();
        } else {
            draw();
            roll();
        }
        loop();
    }

    function draw() {
        $('<div/>', {id: 'pong-game'}).css(CSS.arena).appendTo('body');
        $('<div/>', {id: 'pong-line'}).css(CSS.line).appendTo('#pong-game');
        $('<div/>', {id: 'pong-ball'}).css(CSS.ball).appendTo('#pong-game');
        $('<div/>', {id: 'stick-1'}).css($.extend(CSS.stick1, CSS.stick)).appendTo('#pong-game');
        $('<div/>', {id: 'stick-2'}).css($.extend(CSS.stick2, CSS.stick)).appendTo("#pong-game");
        $('<div/>', {id: 'score-board1'}).css(CSS.scoreBoard1).appendTo("#pong-game");
        $("<div/>", {id: 'score-board2'}).css(CSS.scoreBoard2).appendTo("#pong-game");
        $('#score-board1').text(CONSTS.score1);
        $('#score-board2').text(CONSTS.score2);
        // draw to buttons for enabling cpus
        $('<button/>', {id: "leftCpu"}).text("Disable left CPU").appendTo("#pong-game");
        $('<button/>', {id: "rightCpu"}).text("Disable right CPU").appendTo("#pong-game");

        // enable/disable left cpu
        $("#leftCpu").click(function(e) {
            CONSTS.isLeftCpu = CONSTS.isLeftCpu ? false : true;
        });

        // enable/disable right cpu
        $("#rightCpu").click(function(e) {
            CONSTS.isRightCpu = CONSTS.isRightCpu ? false: true;
        });
        
    }

    function setEvents() {
        $(document).on('keydown', function (e) {
            // keydown for "w"
            // if the position of the stick is top do not increase/decrease speed
            if (e.keyCode == 87) {
                CONSTS.stick1Speed = -20;
            }
            // keydown for "s"
            if(e.keyCode == 83) {
                CONSTS.stick1Speed = 20
            }
            // keydown for "up"
            if(e.keyCode == 38) {
                CONSTS.stick2Speed = -20;
            }
            // keydown for "down"
            if(e.keyCode == 40) {
                CONSTS.stick2Speed = 20;
            }
        });

        $(document).on('keyup', function (e) {
            // keyup for "w"
            if (e.keyCode == 87) {
                CONSTS.stick1Speed = 0;
            }
            // keyup for "s"
            if(e.keyCode == 83) {
                CONSTS.stick1Speed = 0;
            }
            // keyup for "up"
            if(e.keyCode == 38) {
                CONSTS.stick2Speed = 0;
            }
            // keydup for "down"
            if(e.keyCode == 40) {
                CONSTS.stick2Speed = 0;
            }
        });
    }

    function loop() {
        window.pongLoop = setInterval(function () {
            // if there is left cpu
            if(CONSTS.isLeftCpu && CONSTS.cpuLeftTarget) {
                // check the cpu is higher or lower
                var distance = CONSTS.cpuLeftTarget - CSS.stick1.top + (CSS.stick.height / 2);
                if(distance >= CSS.stick.height) {
                    CONSTS.stick1Speed = 20;
                }
                else if(distance <= CSS.stick.height / 2) {
                    CONSTS.stick1Speed = -20;
                }
                else {
                    // stop the stick if its ok
                    CONSTS.stick1Speed = 0;
                }
            }
            // set the speeds of sticks
            // if the stick is trying to overpass the borders stop it
            if((CSS.stick1.top > 0 && CONSTS.stick1Speed < 0) || (CSS.stick1.top < 515 && CONSTS.stick1Speed > 0)) {
                CSS.stick1.top += CONSTS.stick1Speed;    
            }
            // if there is right cpu
            if(CONSTS.isRightCpu && CONSTS.cpuRightTarget) {
                // check the cpu is higher or lower
                var distance = CONSTS.cpuRightTarget - CSS.stick2.top + (CSS.stick.height / 2);
                if(distance >= CSS.stick.height) {
                    CONSTS.stick2Speed = 20;
                }
                else if(distance <= CSS.stick.height / 2) {
                    CONSTS.stick2Speed = -20;
                }
                else {
                    // stop the stick if its ok
                    CONSTS.stick2Speed = 0;
                }
            }
            // if the position of stick is bigger than do not in
            if((CSS.stick2.top > 0 && CONSTS.stick2Speed < 0) || (CSS.stick2.top < 515 && CONSTS.stick2Speed > 0)) {
                CSS.stick2.top += CONSTS.stick2Speed;    
            }
            // draw the positions of sticks
            $('#stick-1').css('top', CSS.stick1.top);
            $("#stick-2").css("top", CSS.stick2.top);
            // set the speed of ball
            CSS.ball.top += CONSTS.ballTopSpeed;
            CSS.ball.left += CONSTS.ballLeftSpeed;

            // set the opposite direction when the ball crushes to the top or bottom
            if (CSS.ball.top <= 0 || CSS.ball.top >= CSS.arena.height - CSS.ball.height) {
                CONSTS.ballTopSpeed = CONSTS.ballTopSpeed * -1;
                // warn our cpu that the direction has changed
                cpuRight();
                cpuLeft();

            }
            // draw the the ball with new positions
            $('#pong-ball').css({top: CSS.ball.top,left: CSS.ball.left});

            // settings for the left side
            if (CSS.ball.left < CSS.stick.width) {
                // if the ball is in front of stick (inside) then return the ball with opposite speed
                if(CSS.ball.top > CSS.stick1.top && CSS.ball.top < CSS.stick1.top + CSS.stick.height) {
                    CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1;
                    // warn the cpu
                    cpuRight();
                } 
                // if not...(that means this is a goal!) start the game again and incremenet the scores
                else {
                    CONSTS.score2 += 1;
                    $("#score-board2").text(CONSTS.score2);
                    if(CONSTS.score2 == 5) {
                        // if game is finished stop the interval
                        CONSTS.score1 = 0;
                        CONSTS.score2 = 0;
                        clearInterval(pongLoop);
                    } 
                    roll();
                }
            }
            // settings for the right side
            if (CSS.ball.left > CSS.arena.width - CSS.ball.width - CSS.stick.width) {
                // if the ball is in front of stick (inside) then return the ball with opposite speed
                if(CSS.ball.top > CSS.stick2.top && CSS.ball.top < CSS.stick2.top + CSS.stick.height) {
                    CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * - 1;
                    // warn the cpu
                    cpuLeft();
                }
                // if not...(that means this is a goal!) start the game again and incremenet the scores
                else {
                    // if score is 5 finish interval
                    CONSTS.score1 += 1;
                    $("#score-board1").text(CONSTS.score1);
                    if(CONSTS.score1 == 5) {
                        // if game is finished stop the interval
                        CONSTS.score1 = 0;
                        CONSTS.score2 = 0;
                        clearInterval(pongLoop);
                    }
                    roll();
                }
                
            }
            // save the current cordinates to the local storage after every time
            localStorage.setItem("gameSettingsCONSTS", JSON.stringify(CONSTS));
            localStorage.setItem("gameSettingsCSS", JSON.stringify(CSS));

        }, CONSTS.gameSpeed);
    }

    function roll() {
        // start in the center
        CSS.ball.top = 300 - (CSS.ball.height / 2);
        
        CSS.ball.left = 450 - (CSS.ball.width / 2);

        var side = -1;

        if (Math.random() < 0.5) {
            side = 1;
        }

        CONSTS.ballTopSpeed = Math.random() * -2 - 3;
        CONSTS.ballLeftSpeed = side * (Math.random() * 13 + 3);
        // warn the cpu
        cpuRight();
        cpuLeft();
    }

    function cpuRight() {
        // if the direction of ball is left return
        if(CONSTS.ballLeftSpeed < 0) return;
        // run this everytime the ball changes its cordination
        var distanceToStick = CSS.arena.width - CSS.stick.width - CSS.ball.left;
        var time = distanceToStick / CONSTS.ballLeftSpeed;
        // detect the balls target location
        var targetLocation = CSS.ball.top + (time * CONSTS.ballTopSpeed);
        if(targetLocation < 0 || targetLocation > 600) {
            CONSTS.cpuRightTarget = 0;
            return;
        }
        // set the target
        CONSTS.cpuRightTarget = targetLocation;

    }
    
    function cpuLeft() {
        // if the direction of ball is left return
        if(CONSTS.ballLeftSpeed > 0) return;
        // run this everytime the ball changes its cordination
        var distanceToStick = CSS.ball.left - CSS.stick.width;

        var time = distanceToStick / -CONSTS.ballLeftSpeed;
        // detect the balls target location
        var targetLocation = CSS.ball.top + (time * CONSTS.ballTopSpeed);
        if(targetLocation < 0 || targetLocation > 600) {
            CONSTS.cpuLeftTarget = 0;
            return;
        }
        // set the target
        CONSTS.cpuLeftTarget = targetLocation;
    }

    start();

})();