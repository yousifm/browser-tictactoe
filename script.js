var endState = false,
    board = document.getElementsByClassName('board')[0],
    computerMoveFunction = normal;

/**
 *Returns true if all the elements in the array are identical
 *otherwise returns false
 */
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

/**
 *Returns the number of occurences of a certain value in the array
 */
Array.prototype.count = function (value) {
    "use strict";
    var count = 0,
        i;
    for (i = 0; i < this.length; i += 1) {
        if (this[i] === value) {
            count += 1;
        }
    }
    return count;
};

/**
 *Returns the indices of the empty elements of an array
 */
function getEmptyCells(board) {
    "use strict";
	var iterator,
		emptyCells = [];
	for (iterator = 0; iterator < board.length; iterator += 1) {
		if (board[iterator] === '' || board[iterator] === ' ') {
			emptyCells.push(iterator);
		}
	}
	return emptyCells;
}

/**
 *Returns the text content of the elements with the passed id's as an array
 */
function getCells(id1, id2, id3) {
    "use strict";
    return [document.getElementById(id1).innerHTML,
            document.getElementById(id2).innerHTML,
            document.getElementById(id3).innerHTML];
}

/**
 *Returns the text content of the board table as an array
 */
function getBoardCells() {
    "use strict";
    var iterator,
        cells = [];
    for (iterator = 0; iterator < 9; iterator += 3) {
        cells = cells.concat(getCells(iterator, iterator + 1, iterator + 2));
    }
    return cells;
}

/**
 *Adds empty cells to the table
 */
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

/**
 *Shows the end screen with 'endText'.
 */
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

/**
 *Clears the board, removes the end screen
 */
function clearBoard() {
    "use strict";
    var endArea = document.getElementsByClassName('endgameText')[0];

    endArea.innerHTML = "";
    board.innerHTML = "";
    board.setAttribute('style', 'opacity: 1;');
    endState = false;
    drawBoard();
    return false;
}

/**
 *Checks whether all the array elements are the same and are not empty strings
 */
function checkSame(array) {
    "use strict";
    if (!endState) {
        if (array[0].length > 0 && array.allValuesSame()) {
            return true;
        }
    }
    return false;
}

/**
 *Checks if there are not any empty cells
 */
function checkTie() {
    "use strict";
    if (!getEmptyCells(getBoardCells(board)).length) {
        return true;
    }
    return false;
}

/**
 *Checks if any of the players has won
 *and returns the winner, otherwise returns null
 */
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

/**
 *Handles computer choice using the current difficulty function,
 *adds an O and changes the cell's class
 */
function computerMove() {
    "use strict";
    var emptyCells = getEmptyCells(getBoardCells(board)),
        moveIndex = computerMoveFunction(getBoardCells()),
        cell = document.getElementById(moveIndex);
    if (emptyCells && !endState) {
        cell.innerHTML = 'O';
        cell.removeAttribute('onclick');
        cell.setAttribute('class', 'clicked');
    }
}

/**
 *Normal difficulty, uses minimax with a max depth of 3
 */
function normal(boardCells) {
    "use strict";
    return window.minimaxBestMove(boardCells, 3);
}

/**
 *Returns a random cells's id
 */
function randomMove(boardCells) {
    "use strict";
    var emptyCells = getEmptyCells(getBoardCells());
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

/**
 *Checks for a win or a tie, and displays the end screen if there is
 */
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


/**
 *Adds the 'X' and changes the style of clicked cells
 */
function playerMove(elem) {
    "use strict";
    if (!endState) {
        elem.innerHTML = 'X';
        elem.setAttribute('class', 'clicked');
        elem.removeAttribute('onclick');
        turnPasses();
        computerMove();
        turnPasses();
    }
}


/**
 *Changes difficulty level when a
 *button is clicked and changes button classes
 */
function toggleDifficulty(button) {
    "use strict";
    //Resets the currently toggled button
    document.getElementsByClassName('difficultyButtonToggled')[0].className = 'difficultyButton';

    //Toggles the clicked button
    button.className = 'difficultyButtonToggled';

    switch (button.innerHTML) {
    case 'Easy':
        computerMoveFunction = randomMove;
        break;
    case 'Normal':
        computerMoveFunction = normal;
        break;
    case 'Impossible':
        computerMoveFunction = window.minimaxBestMove;
        break;
    }
}

drawBoard();

