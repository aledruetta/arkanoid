function App() {

    var arkanoid = {
        playground: {
            width: 450,
            height: 500,
            padding: 2,
        },
        ship: {
            width: 75,
            height: 15,
            float: 8,
            x: 0,
            y: 0,
            speed: 15
        },
        ball: {
            diameter: 10,
            speedX: 5,
            speedY: 5,
            x: 0,
            y: 0,
            isReleased: false,
            directionX: 1,
            directionY: 1
        },
        block: {
            lines: 6,
            blocksPerLine: 9,
            width: 0,
            height: 20,
            margin: 1,
            // block.colors.length should match block.lines
            colors: ['gray', 'yellow', 'red', 'blue', 'green', 'purple']
        }
    };

    function render() {
        renderShip();
        renderBall();
        window.requestAnimationFrame(render);
    }

    function renderPlayground() {

        $('#playground').css({
            'width': arkanoid.playground.width,
            'height': arkanoid.playground.height,
            'padding': arkanoid.playground.padding
        });
    }

    function renderShip() {

        $('#ship').css({
            'top': arkanoid.ship.y,
            'left': arkanoid.ship.x
        });
    }

    function renderBall() {

        $('#ball').css({
            'top': arkanoid.ball.y,
            'left': arkanoid.ball.x
        });
    }

    function renderBlocks() {

        var block = arkanoid.block,
            playground = arkanoid.playground

        for (var i = 0; i < block.lines; i++) {

            var color = block.colors[i];

            var $row = $('<div class="row"></div>');
            $('#blocks').append($row);

            for (var j = 0; j < block.blocksPerLine; j++) {

                var $newBlock = $('<span id="b' + i + j + '" class="block"></span>');
                $newBlock.css('backgroundColor', color);
                $('.row').last().append($newBlock);
            }
        }

        block.width = playground.width / block.blocksPerLine - block.margin * 2;

        $('.block').css({
            'width': block.width,
            'height': block.height - block.margin * 2,
            'margin': block.margin + 'px'
        });
    }

    function reset() {

        var playground = arkanoid.playground;
        var ship = arkanoid.ship;
        var ball = arkanoid.ball;

        ball.isReleased = false;

        ship.x = parseInt((playground.width - ship.width) / 2);
        ship.y = parseInt(playground.height - ship.height - ship.float);

        $('#ship').css({
            'width': ship.width,
            'height': ship.height
        });

        ball.x = parseInt(ship.x + ship.width / 2 - ball.diameter / 2);
        ball.y = parseInt(ship.y - ball.diameter);
        ball.directionX = Math.round(Math.random()) ? 1 : -1;
        ball.directionY = -1;

        $('#ball').css({
            'width': ball.diameter,
            'height': ball.diameter,
        });

        $('.block').css('visibility', 'visible');
    }

    function handleKeyInputs() {

        var playground = arkanoid.playground;
        var ship = arkanoid.ship;
        var ball = arkanoid.ball;

        $(document).keydown(function(e) {
            switch (e.keyCode ? e.keyCode : e.wich) {
                case 32:
                    ball.isReleased = true;
                    return;

                case 37:
                    var shipHitLeft = ship.x - ship.speed <= 0;

                    if (shipHitLeft) {
                        ship.x = 0;
                    } else {
                        ship.x -= ship.speed;
                    }
                    return;

                case 39:
                    var shipHitRight = ship.x + ship.speed >= playground.width
                            + playground.padding * 2 - ship.width;

                    if (shipHitRight) {
                        ship.x = playground.width + playground.padding * 2
                                - ship.width;
                    } else {
                        ship.x += ship.speed;
                    }
                    return;
            }
        });
    }

    function moveBall() {

        var ship = arkanoid.ship;
        var ball = arkanoid.ball;

        if (!ball.isReleased) {
            ball.x = parseInt(ship.x + ship.width / 2 - ball.diameter / 2);
            return;
        }

        boundaryDetection();
        blockDetection();

        ball.y += ball.speedY * ball.directionY;
        ball.x += ball.speedX * ball.directionX;
    }

    function boundaryDetection() {

        var playground = arkanoid.playground;
        var ball = arkanoid.ball;
        var ship = arkanoid.ship;

        var hitTop = ball.y <= 0;
        var hitBottom = ball.y >= playground.height - ball.diameter;
        var hitLeft = ball.x <= 0;
        var hitRight = ball.x >= playground.width - ball.diameter;

        if (ballHitShip()) {
            var point = Math.abs(parseInt((ship.width / 2) - ((ball.x + ball.diameter / 2) - ship.x)));
            ball.directionY = -1;
            ball.speedX = parseInt(point / 5) + 2;
            console.log(ball.speedX);
        } else if (hitBottom) {
            reset();
            return;
        } else if (hitRight || hitLeft) {
            ball.directionX *= -1;
        } else if (hitTop) {
            ball.directionY = 1;
        }
    }

    function blockDetection() {

        var ball = arkanoid.ball;
        var block = arkanoid.block;
        var coor = {x: null, y: null};

        if (ball.y <= block.height * block.lines) {

            coor.y = parseInt(ball.y / block.height);
            coor.x = parseInt(ball.x / block.width);

            var target = $('#b' + coor.y + coor.x);

            if (target.css('visibility') !== 'hidden') {
                ball.directionY = 1;
                target.css('visibility', 'hidden');
            }
        }
    }

    function ballHitShip() {
        var ball = arkanoid.ball;
        var ship = arkanoid.ship;

        if (ball.x >= ship.x && ball.x < ship.x + ship.width) {
            if (ball.y >= ship.y - ship.height) {
                return true;
            }
        }
        return false;
    }

    function gameloop() {
        moveBall();
    }

    this.start = function() {

        renderPlayground();
        renderBlocks();
        reset();
        arkanoid.timer = setInterval(gameloop, 1000 / 30);
        window.requestAnimationFrame(render);
        handleKeyInputs();
    }
}


$(function() {
    var app = new App();
    app.start();
});
