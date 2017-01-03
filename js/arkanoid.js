function App() {

    var arkanoid = {
        playground: {
            width: 450,
            height: 500,
            offsetTop : $('#playground').offset().top,
            offsetLeft : $('#playground').offset().left
        },
        ship: {
            width: 75,
            height: 15,
            float: 8,
            x: 0,
            y: 0,
            speed: 10
        },
        ball: {
            diameter: 10,
            speed: 5,
            x: 0,
            y: 0,
            isReleased: false
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

        var playground = arkanoid.playground;

        $('#playground').css({
            'width': playground.width,
            'height': playground.height
        });
    }

    function renderShip() {

        var ship = arkanoid.ship;

        $('#ship').css({
            'top': ship.y,
            'left': ship.x
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
            $('#ball').css({
                'top': ball.y,
                'left': parseInt(ship.x + ship.width / 2 - ball.diameter / 2)
            });
        }
    }

    function renderBlocks() {

        var block = arkanoid.block,
            playground = arkanoid.playground,
            color,
            row,
            newBlock;

        block.width = playground.width / block.blocksPerLine;

        for (var i = 0; i < block.lines; i++) {

            color = block.colors[i];

            $row = $('<div class="row"></div>');
            $('#blocks').append($row);

            for (var j = 0; j < block.blocksPerLine; j++) {

                $newBlock = $('<span class="block"></span>');
                $newBlock.css('backgroundColor', color);
                $('.row').last().append($newBlock);
            }
        }

        $('.block').css({
            'width':  (playground.width / block.blocksPerLine) - block.margin * 2,
            'height': block.height - block.margin * 2,
            'margin': block.margin + 'px'
        });
    }

    function reset() {

        var playground = arkanoid.playground;
        var ship = arkanoid.ship;
        var ball = arkanoid.ball;

        renderPlayground();
        renderBlocks();

        ship.x =  parseInt((playground.width - ship.width) / 2);
        ship.y = parseInt(playground.height - ship.height - ship.float);

        $('#ship').css({
            'width': ship.width,
            'height': ship.height
        });

        ball.x = parseInt(ship.x + ship.width / 2 - ball.diameter / 2);
        ball.y = parseInt(ship.y - ball.diameter);

        console.log(ball.x);
        console.log(ball.y);

        $('#ball').css({
            'width': ball.diameter,
            'height': ball.diameter,
        });
    }

    function handleKeyInputs () {

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

    this.start = function() {

        reset();

        window.requestAnimationFrame(render);

        handleKeyInputs();

    }

}


$(function() {
    var app = new App();
    app.start();
});
