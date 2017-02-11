var emptyCells = ['00', '01', '02', '10', '11', '12', '20', '21', '22'],
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
        }
    }
}

function end(winner) {
    "use strict";
    var endText,
        endArea;

    if (endState) {
        return;
    }

    if (winner === 'Tie') {
        endText = 'Tie';
    } else {
        endText = winner + ' wins!';
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
    emptyCells = ['00', '01', '02', '10', '11', '12', '20', '21', '22'];
    endState = false;
    drawBoard();
    return false;
}

function checkSame(array) {
    "use strict";
    if (!endState) {
        if (array[0].length > 0 && array.allValuesSame()) {
            end(array[0]);
        }
    }
}

function checkTie() {
    "use strict";
    if (!emptyCells.length) {
        end('Tie');
    }
}

function checkWin() {
    "use strict";
    var rows = board.rows,
        rowNumber,
        rowContents,
        cells,
        cellNumber,
        columnContents,
        diagonalContents;

    if (endState) {
        return;
    }

    //check rows
    for (rowNumber = 0; rowNumber < 3; rowNumber += 1) {
        cells = rows[rowNumber].cells;
        rowContents = [cells[0].innerHTML, cells[1].innerHTML, cells[2].innerHTML];
        checkSame(rowContents);
    }

        //check columns
    for (cellNumber = 0; cellNumber < 3; cellNumber += 1) {
        columnContents = [rows[0].cells[cellNumber].innerHTML,
                              rows[1].cells[cellNumber].innerHTML,
                              rows[2].cells[cellNumber].innerHTML];

        checkSame(columnContents);
    }

    //check diagonals
    diagonalContents = [rows[0].cells[0].innerHTML,
                            rows[1].cells[1].innerHTML,
                            rows[2].cells[2].innerHTML];
    checkSame(diagonalContents);
    diagonalContents = [rows[0].cells[2].innerHTML,
                       rows[1].cells[1].innerHTML,
                       rows[2].cells[0].innerHTML];
    checkSame(diagonalContents);
}

function computerMove() {
    "use strict";
    if (endState) {
        return;
    }
    if (emptyCells.length) {
        var randomIndex = Math.floor(Math.random() * emptyCells.length),
            cellString = emptyCells[randomIndex],

            rowNumber = parseInt(cellString[0], 10),
            cellNumber = parseInt(cellString[1], 10),

            row = board.getElementsByTagName('tr')[rowNumber],
            cell = row.getElementsByTagName('td')[cellNumber];

        emptyCells.splice(randomIndex, 1);

        cell.innerHTML = 'O';
        cell.setAttribute('style', 'color:#3e3e3e');
        cell.removeAttribute('onclick');
        cell.setAttribute('class', 'clicked');
    }
}

function getId(elem) {
    "use strict";
    var row = elem.parentNode.rowIndex,
        cell = elem.cellIndex;
    return row.toString() + cell;
}

function playerMove(elem) {
    "use strict";
    if (!endState) {
        var id = getId(elem);
        emptyCells.splice(emptyCells.indexOf(id), 1);

        elem.innerHTML = 'X';
        elem.setAttribute('class', 'clicked');
        elem.setAttribute('style', 'color:#3e3e3e');
        elem.removeAttribute('onclick');
        checkWin();
        computerMove();
        checkWin();
        checkTie();
    }
}

drawBoard();

