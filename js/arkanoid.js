function App() {

    var arkanoid = {
        playground: {
            width: 450,
            height: 600
        },
        ship: {
            width: 75,
            height: 15,
        },
        block: {
            lines: 6,
            blocksPerLine: 9,
            height: 15
        },
        colors: ['gray', 'yellow', 'red', 'blue', 'green', 'purple']
    };

    function render() {
        renderPlayground();
        renderShip();
        renderBlocks();
    }

    function renderPlayground() {

        var playground = arkanoid.playground;

        $('#playground').css({
            'width': playground.width,
            'height': playground.height
        });
    }

    function renderShip() {

        var playground = arkanoid.playground;
        var ship = arkanoid.ship;

        $('#ship').css({
            'width': ship.width,
            'height': ship.height,
            'top': playground.height - ship.height,
            'left': parseInt((playground.width - ship.width) / 2)
        });
    }

    function renderBlocks() {

        var block = arkanoid.block,
            playground = arkanoid.playground,
            color,
            newBlock;

        block.width = playground.width / block.blocksPerLine;

        for (var i = 0; i < block.lines; i++) {

            color = arkanoid.colors[i];

            for (var j = 0; j < block.blocksPerLine; i++) {

                newBlock = $('<div class="block"></div>');

                newBlock.css({
                    'width':  playground.width / block.blocksPerLine,
                    'height': block.height,
                    'top':  i * block.height,
                    'left': j * block.width,
                    'background-color': color
                });
            }
        }
    }

    this.start = function() {
        render();
    }

}


$(function() {
    var app = new App();
    app.start();
});
