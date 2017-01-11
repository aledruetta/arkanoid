function App() {

    // Instancia todos os objetos do aplicativo
    var playground = new Playground();
    var block = new Block();
    var ship = new Ship();
    var ball = new Ball();
    var touch = new Touch();


    // Construtor do objeto que faz de "campo de jogo"
    function Playground() {

        // Calcula a altura da janela
        var windowHeight = $(window).height();
        var $playground = $('#playground');

        this.gameMargin = 4;
        this.width = $playground.width();
        this.height = (this.width < 450) ? (windowHeight - this.gameMargin) : 500;

        this.render = function() {
            $playground.css({'height': this.height});
        };
    }


    // Construtor do objeto bloco genérico
    function Block() {

        var colors = ['gray', 'yellow', 'red', 'blue', 'green', 'purple'];
        var blocksPerLine = 9;

        this.lines = 6;
        this.height = 20;
        this.width = 100 / blocksPerLine;

        this.render = function() {

            for (var i = 0; i < this.lines; i++) {

                var color = colors[i];

                // Cria a div que vai conter os blocos da linha e adiciona ao DOM
                var $row = $('<div class="row"></div>');
                $('#blocks').append($row);

                for (var j = 0; j < blocksPerLine; j++) {

                    // Cria o elemento span que representa o bloco, gera o id e adiciona ao DOM
                    var $newBlock = $('<span id="b' + i + j + '" class="block"></span>');
                    $newBlock.css('backgroundColor', color);
                    $('.row').last().append($newBlock);
                }
            }

            $('.block').css({'height': this.height - 2});
            $('.block').css('width', this.width + '%').css('width', '-=2px');
        };
    }

    function Ship() {

        this.width = 75;
        this.height = 15;
        this.float = 24;
        this.x = (playground.width - this.width + playground.gameMargin) / 2;
        this.y = playground.height - this.height - this.float;
        this.speed = 20;

        $('#ship').css({
            'width': this.width,
            'height': this.height,
        });

        this.render = function() {

            $('#ship').css({
                'top': this.y,
                'left': this.x
            });
        };

        this.leftMove = function() {

            var shipHitLeft = this.x - this.speed <= 0 + playground.gameMargin / 2;

            if (shipHitLeft) {
                this.x = 0 + playground.gameMargin / 2;
                return;
            }

            this.x -= this.speed;
        };

        this.rightMove = function() {

            var shipHitRight = this.x + this.speed >= playground.width
                    - this.width;

            if (shipHitRight) {
                this.x = playground.width - this.width;
                return;
            }

                this.x += this.speed;
        };
    }

    function Ball() {

        this.diameter = 10;
        this.speedX = 5;
        this.speedY = 5;
        this.x = null;
        this.y = null;
        this.directionX = 1;
        this.directionY = -1;

        this.isRelease = false;

        $('#ball').css({
            'width': this.diameter,
            'height': this.diameter,
        });

        this.render = function() {

            $('#ball').css({
                'top': this.y,
                'left': this.x
            });
        };

        this.hitTop    = function() {return this.y <= 0;};
        this.hitBottom = function() {return this.y >= ship.y + this.diameter;};
        this.hitLeft   = function() {return this.x <= playground.gameMargin;};
        this.hitRight  = function() {return this.x >= playground.width - this.diameter
                - playground.gameMargin;};

        this.hitShip = function() {

            if (this.x >= ship.x && this.x < ship.x + ship.width) {
                if (this.y >= ship.y - ship.height) {
                    return true;
                }
            }
            return false;
        };

        this.collitionBoundaries = function() {

            if (this.hitShip()) {
                var point = Math.abs((ship.width / 2) - ((this.x + this.diameter / 2) - ship.x));
                this.directionY = -1;
                this.speedX = point / 5 + 2;
            } else if (this.hitBottom()) {
                reset();
                return;
            } else if (this.hitRight() || this.hitLeft()) {
                this.directionX *= -1;
            } else if (this.hitTop()) {
                this.directionY = 1;
            }
        };

        this.blockCollition = function() {

            var coor = {x: null, y: null};

            if (this.y <= block.height * block.lines) {

                coor.y = parseInt(this.y / block.height);
                coor.x = parseInt(this.x / ($('#b00').width() + 2));

                var $target = $('#b' + coor.y + coor.x);

                if ($target.css('visibility') !== 'hidden') {
                    this.directionY = 1;
                    $target.css('visibility', 'hidden');
                }
            }
        };

        this.move = function() {

            if (!this.isReleased) {
                this.x = ship.x + ship.width / 2 - this.diameter / 2;
                return;
            }

            this.collitionBoundaries();
            this.blockCollition();

            this.y += this.speedY * this.directionY;
            this.x += this.speedX * this.directionX;
        };

        this.reset = function() {

            this.isReleased = false;

            this.x = ship.x + ship.width / 2 - this.diameter / 2;
            this.y = ship.y - this.diameter;
            this.directionX = Math.round(Math.random()) ? 1 : -1;
            this.directionY = -1;
        };
    }

    function Touch() {

        this.diameter;

        this.touchControls = function() {

            this.diameter = Math.floor((playground.width / 3) * 0.9);
            this.diameter = (this.diameter <= 120) ? this.diameter : 120;

            var $touch_tap = $('.touch-tap');

            $touch_tap.css({
                'visibility': 'visible',
                'width': this.diameter,
                'height': this.diameter,
            });

            var center = Math.floor(playground.width / 2 - this.diameter / 2);

            $('#tap-left').css({
                'left': center - this.diameter,
                'top': playground.height - this.diameter
            });
            $('#tap-center').css({
                'left': center,
                'top': playground.height - this.diameter * 1.5
            });
            $('#tap-right').css({
                'left': center + this.diameter,
                'top': playground.height - this.diameter
            });
        };

        if (!isMobileDevice()) {
            this.touchControls();
        }

        function isMobileDevice() {

            return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)));
        }
    } // End Touch constructor


    function render() {

        ship.render();
        ball.render();

        window.requestAnimationFrame(render);
    }

    function reset() {

        ball.reset();

        $('.block').css('visibility', 'visible');
    }

    function handleKeyInputs() {

        $(document).keydown(function(e) {
            switch (e.keyCode ? e.keyCode : e.wich) {
                case 32:
                    ball.isReleased = true;
                    return;

                case 37:
                    ship.leftMove();
                    return;

                case 39:
                    ship.rightMove();
                    return;
            }
        });
    }

    function handleTouchInputs() {

        $('#tap-left').on('click', function() {
            ship.leftMove();
        });

        $('#tap-center').on('click', function() {
            ball.isReleased = true;
        });

        $('#tap-right').on('click', function() {
            ship.rightMove();
        });
    }

    function gameloop() {
        ball.move();
    }

    this.start = function() {

        playground.render();
        block.render();

        reset();

        this.timer = setInterval(gameloop, 1000 / 30);
        window.requestAnimationFrame(render);

        handleKeyInputs();
        handleTouchInputs();
    }
}


$(function() {
    var app = new App();
    app.start();
});
