var emptyCells = ['0', '1', '2', '3', '4', '5', '6', '7', '8'],
    endState = false,
    board = document.getElementsByClassName('board')[0];

Array.prototype.allValuesSame = function () {
    "use strict";
    var i;
    for (i = 1; i < this.length; i += 1) {
        if (this[i] !== this[0]) {
            return false;
        }
    }

    return true;
};

function drawBoard() {
    "use strict";
    var row,
        i,
        j,
        cell;

    for (i = 0; i < 3; i += 1) {
        row = board.insertRow(i);
        for (j = 0; j < 3; j += 1) {
            cell = row.insertCell(j);
            cell.setAttribute('onclick', 'playerMove(this)');
            cell.setAttribute('class', 'empty');
            cell.id = (i * 3 + j).toString();
        }
    }
}

function end(endText) {
    "use strict";
    var endArea;

    if (endState) {
        return;
    }

    board.setAttribute('style', 'opacity: 0.1;');
    endState = true;
    endArea = document.getElementsByClassName('endgameText')[0];

    endArea.innerHTML += "<h2>" + endText + "</h2>";
    endArea.innerHTML += '<a href ="#" class="replayButton" onclick="return clearBoard()">Play Again?</a>';
}

function clearBoard() {
    "use strict";
    var endArea = document.getElementsByClassName('endgameText')[0];

    endArea.innerHTML = "";
    board.innerHTML = "";
    board.setAttribute('style', 'opacity: 1;');
    emptyCells = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];
    endState = false;
    drawBoard();
    return false;
}

function checkSame(array) {
    "use strict";
    if (!endState) {
        if (array[0].length > 0 && array.allValuesSame()) {
            return true;
        }
    }
    return false;
}

function checkTie() {
    "use strict";
    if (!emptyCells.length) {
        return true;
    }
    return false;
}

function getCells(id1, id2, id3) {
    "use strict";
    return [document.getElementById(id1).innerHTML,
            document.getElementById(id2).innerHTML,
            document.getElementById(id3).innerHTML];
}

function checkWin() {
    "use strict";
    var number,
        column,
        row,
        diagonal;

    if (endState) {
        return;
    }

    //check rows and columns
    for (number = 0; number < 3; number += 1) {
        row = getCells(number * 3, number * 3 + 1, number * 3 + 2);
        column = getCells(number, number + 3, number + 6);
        if (checkSame(row)) {
            return row[0];
        } else if (checkSame(column)) {
            return column[0];
        }
    }

    //check diagonals
    diagonal = getCells(0, 4, 8);
    if (checkSame(diagonal)) {
        return diagonal[0];
    }
    diagonal = getCells(2, 4, 6);
    if (checkSame(diagonal)) {
        return diagonal[0];
    }
    return null;
}

function getBoardCells() {
    "use strict";
    var iterator,
        cells = [];
    for (iterator = 0; iterator < 9; iterator += 3) {
        cells = cells.concat(getCells(iterator, iterator + 1, iterator + 2));
    }
    return cells;
}

function computerMove() {
    "use strict";
    if (emptyCells.length && !endState) {
        var minimaxIndex = window.minimaxBestMove(getBoardCells()),
            cell = document.getElementById(minimaxIndex);

        emptyCells.splice(emptyCells.indexOf(minimaxIndex), 1);

        cell.innerHTML = 'O';
        cell.removeAttribute('onclick');
        cell.setAttribute('class', 'clicked');
    }
}

function turnPasses() {
    "use strict";
    var winner = checkWin(),
        tie = checkTie();

    if (winner) {
        end(winner + ' wins!');
    } else if (tie) {
        end('Tie');
    }
}

function playerMove(elem) {
    "use strict";
    if (!endState) {
        var id = elem.id;
        emptyCells.splice(emptyCells.indexOf(id), 1);

        elem.innerHTML = 'X';
        elem.setAttribute('class', 'clicked');
        elem.removeAttribute('onclick');
        turnPasses();
        computerMove();
        turnPasses();
    }
}
drawBoard();

