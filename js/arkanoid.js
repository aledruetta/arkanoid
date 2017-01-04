function App() {

    var arkanoid = {
        playground: {
            width: 450,
            height: 500,
            offsetTop: $('#playground').offset().top,
            offsetLeft: $('#playground').offset().left
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
            speed: 5,
            x: 0,
            y: 0,
            isReleased: false,
            directionX: 1,
            directionY: -1
        },
        block: {
            lines: 6,
            blocksPerLine: 9,
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
            'height': arkanoid.playground.height
        });
    }

    function renderShip() {

        $('#ship').css({
            'top': arkanoid.ship.y,
            'left': arkanoid.ship.x
        });
    }

    function renderBall() {
        var ball = arkanoid.ball;
        var ship = arkanoid.ship;

        if (ball.isReleased) {
            $('#ball').css({
                'top': ball.y,
                'left': ball.x
            });
        } else {
            ball.x = parseInt(ship.x + ship.width / 2 - ball.diameter / 2);

            $('#ball').css({
                'top': ball.y,
                'left': ball.x
            });
        }
    }

    function renderBlocks() {

        var block = arkanoid.block,
            playground = arkanoid.playground

        block.width = playground.width / block.blocksPerLine;

        for (var i = 0; i < block.lines; i++) {

            var color = block.colors[i];

            var $row = $('<div class="row"></div>');
            $('#blocks').append($row);

            for (var j = 0; j < block.blocksPerLine; j++) {

                var $newBlock = $('<span class="block"></span>');
                $newBlock.css('backgroundColor', color);
                $('.row').last().append($newBlock);
            }
        }

        $('.block').css({
            'width': (playground.width / block.blocksPerLine) - block.margin * 2,
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
                    if (ship.x - ship.speed >= 0) {
                        ship.x -= ship.speed;
                    } else {
                        ship.x = 0;
                    }
                    return;
                case 39:
                    if (ship.x + ship.speed <= playground.width - ship.width) {
                        ship.x += ship.speed;
                    } else {
                        ship.x = playground.width - ship.width;
                    }
                    return;
            }
        });

    }

    function moveBall() {

        var ball = arkanoid.ball;

        if (ball.isReleased) {
            if (ballHitBottom()) {
                reset();
                return;
            } else if (ballHitRight()) {
                ball.directionX = -1;
            } else if (ballHitLeft()) {
                ball.directionX = 1;
            } else if (ballHitTop()) {
                ball.directionY = 1;
            }

            ball.y += ball.speed * ball.directionY,
                ball.x += ball.speed * ball.directionX

        }
    }

    function ballHitBottom() {
        return arkanoid.ball.y > arkanoid.playground.height;
    }

    function ballHitLeft() {
        return arkanoid.ball.x < 0;
    }

    function ballHitRight() {
        return arkanoid.ball.x > arkanoid.playground.width;
    }

    function ballHitTop() {
        return arkanoid.ball.y < 0;
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
