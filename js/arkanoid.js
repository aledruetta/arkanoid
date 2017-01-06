function App() {

    var arkanoid = {
        playground: {
            height: 500,
            padding: 2,
        },
        ship: {
            width: 75,
            height: 15,
            float: 24,
            x: 0,
            y: 0,
            speed: 20
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
        },
        touch: {
            diameter: 0,
            margin: 5
        }
    };

    function render() {
        renderShip();
        renderBall();
        window.requestAnimationFrame(render);
    }

    function renderPlayground() {

        var $playground = $('#playground');

        if ($playground.width() < 450) {
            arkanoid.playground.height = $(window).height() - arkanoid.playground.padding * 2;
        }

        $('#playground').css({
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

        arkanoid.playground.width = Math.floor(parseInt($('#playground').css('width')));

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
        var touchDiv = arkanoid.touch;

        ship.x = parseInt((playground.width - ship.width) / 2);
        ship.y = parseInt(playground.height - ship.height - ship.float);

        $('#ship').css({
            'width': ship.width,
            'height': ship.height
        });

        ball.isReleased = false;

        ball.x = parseInt(ship.x + ship.width / 2 - ball.diameter / 2);
        ball.y = parseInt(ship.y - ball.diameter);
        ball.directionX = Math.round(Math.random()) ? 1 : -1;
        ball.directionY = -1;

        $('#ball').css({
            'width': ball.diameter,
            'height': ball.diameter,
        });

        $('.block').css('visibility', 'visible');

        if (isMobileDevice()) {

            touchDiv.diameter = Math.floor((playground.width - touchDiv.margin * 6) / 3);
            touchDiv.diameter = (touchDiv.diameter <= 90) ? touchDiv.diameter : 90;

            var $touch_tap = $('.touch-tap');

            $touch_tap.css({
                'visibility': 'visible',
                'width': touchDiv.diameter,
                'height': touchDiv.diameter,
                'margin': touchDiv.margin
            });

            var center = Math.floor(playground.width / 2 - touchDiv.diameter / 2);

            $('#tap-left').css({
                'left': center - touchDiv.diameter,
                'top': playground.height - touchDiv.diameter
            });
            $('#tap-center').css({
                'left': center,
                'top': playground.height - touchDiv.diameter * 1.5
            });
            $('#tap-right').css({
                'left': center + touchDiv.diameter,
                'top': playground.height - touchDiv.diameter
            });
        }
    }

    function isMobileDevice() {

        return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)));
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
                    leftShipMove();
                    return;

                case 39:
                    rightShipMove();
                    return;
            }
        });
    }

    function handleTouchInputs() {

        $('#tap-left').on('click', function() {
            leftShipMove();
        });

        $('#tap-center').on('click', function() {
            arkanoid.ball.isReleased = true;
        });

        $('#tap-right').on('click', function() {
            rightShipMove();
        });
    }

    function leftShipMove() {

        var ship = arkanoid.ship;
        var shipHitLeft = ship.x - ship.speed <= 0;

        if (shipHitLeft) {
            ship.x = 0;
            return;
        }

        ship.x -= ship.speed;
    }

    function rightShipMove() {

        var ship = arkanoid.ship;
        var playground = arkanoid.playground;
        var shipHitRight = ship.x + ship.speed >= playground.width
                + playground.padding * 2 - ship.width;

        if (shipHitRight) {
            ship.x = playground.width + playground.padding * 2
                    - ship.width;
            return;
        }

            ship.x += ship.speed;
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
        var hitBottom = ball.y >= ship.y + ball.diameter;
        var hitLeft = ball.x <= 0;
        var hitRight = ball.x >= playground.width - ball.diameter;

        if (ballHitShip()) {
            var point = Math.abs(parseInt((ship.width / 2) - ((ball.x + ball.diameter / 2) - ship.x)));
            ball.directionY = -1;
            ball.speedX = parseInt(point / 5) + 2;
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
        handleTouchInputs();
    }
}


$(function() {
    var app = new App();
    app.start();
});
