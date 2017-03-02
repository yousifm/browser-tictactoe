/*global window: false */
/*jslint browser: true */

var endState = false,
    board = document.getElementsByClassName('board')[0],
    computerMoveFunction = window.normal;


//--------------------------------------------------//
//--------------Array Manipulation-----------------//
//------------------------------------------------//

/**
 *Returns true if all the elements in the array are identical
 *otherwise returns false
 */
function allValuesSame(array) {
    "use strict";
    var i;
    for (i = 1; i < array.length; i += 1) {
        if (array[i] !== array[0]) {
            return false;
        }
    }

    return true;
}

/**
 *Returns the indices of the empty elements of an array
 */
function getEmptyCells(array) {
    "use strict";
	var iterator,
		emptyCells = [];
	for (iterator = 0; iterator < array.length; iterator += 1) {
		if (array[iterator] === '' || array[iterator] === ' ') {
			emptyCells.push(iterator);
		}
	}
	return emptyCells;
}

/**
 *Checks whether all the array elements are the same and are not empty strings
 */
function checkSame(array) {
    "use strict";
    if (!endState) {
        if (array[0].length > 0 && allValuesSame(array)) {
            return true;
        }
    }
    return false;
}

/**
 *Changes the value at index 'move' to 'currentPlayer' and returns
 *the 'board' array.
 */
function makeMove(board, move, currentPlayer) {
    "use strict";
	board[move] = currentPlayer;
	return board;
}

/**
 *empties the move index
 */
function undoMove(board, move) {
    board[move] = ' ';
}


//----------------------------------------------------------//
//-------------------Helper functions----------------------//
//--------------------------------------------------------//

/**
 *Returns the value of the cells if all of the values are identical
 *otherwise returns null
 */
function getWinner(cell1, cell2, cell3) {
    "use strict";
	if (cell1 === cell2 && cell2 === cell3) {
		return cell1;
	}
	return null;
}

/**
 *Returns the opponent of a certain player
 */
function getOpponent(player) {
    "use strict";
	if (player === 'X') {
		return 'O';
	} else if (player === 'O') {
		return 'X';
	}
}

//--------------------------------------------------//
//--------------HTML Board altering----------------//
//------------------------------------------------//

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

function drawToken(cell, token) {
    "use strict";
    cell.innerHTML = token;
    cell.removeAttribute('onclick');
    cell.setAttribute('class', 'clicked');
}

//--------------------------------------------------//
//--------------HTML Board fetching----------------//
//------------------------------------------------//

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


//--------------------------------------------------//
//--------------End Screen Display-----------------//
//------------------------------------------------//

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

//---------------------------------------------//
//--------------State Checking----------------//
//-------------------------------------------//
function winLoss() {
    "use strict";
    var i;
    for (i = 0; i < arguments.length; i += 1) {
        if (arguments[i] === 'X') {
            return 'loss';
        } else if (arguments[i] === 'O') {
            return 'win';
        }
    }
    return null;
}

/**
 *Checks whether the current state is a win, loss or tie
 */
function checkState(board) {
    "use strict";
	var iterator,
		winnerRow,
		winnerColumn,
		winnerDiag1,
		winnerDiag2,
        winOrLoss;

    /**
     * board:
     * -------
     *|0  1  2|
     *|3  4  5|
     *|6  7  8|
     * -------
     */
	for (iterator = 0; iterator < 3; iterator += 1) {
		/**
         *Each row starts with a multiple of 3 (starting from 0)
         */
		winnerRow = getWinner(board[iterator * 3],
                              board[iterator * 3 + 1],
                              board[iterator * 3 + 2]);

		/**
         *The difference between each element and the next one in
         *the column is 3
         */
		winnerColumn = getWinner(board[iterator],
								 board[iterator + 3],
								 board[iterator + 6]);

		winOrLoss = winLoss(winnerRow, winnerColumn);
        if (winOrLoss) {
            return winOrLoss;
        }
	}

	//check diagonals
	winnerDiag1 = getWinner(board[0], board[4], board[8]);
	winnerDiag2 = getWinner(board[2], board[4], board[6]);
	winOrLoss = winLoss(winnerDiag1, winnerDiag2);
    if (winOrLoss) {
        return winOrLoss;
    }

	//check tie
	if (window.getEmptyCells(board).length === 0) {
		return 'tie';
	}
}

/**
 *Checks for a win or a tie, and displays the end screen if there is
 */
function turnPasses() {
    "use strict";
    var state = checkState(getBoardCells(board));
    if (state === 'win') {
        end('O wins!');
    } else if (state === 'loss') {
        end('X wins!');
    } else if (state === 'tie') {
        end('Tie');
    }
}

//----------------------------------------------------------------//
//--------------Player and Computer move handling----------------//
//--------------------------------------------------------------//

/**
 *Handles computer choice using the current difficulty function,
 *adds an O and changes the cell's class
 */
function computerMove() {
    "use strict";
    var moveIndex = computerMoveFunction(getBoardCells()),
        cell = document.getElementById(moveIndex);
    if (!endState) {
        drawToken(cell, 'O');
    }
}

/**
 *Adds the 'X' and changes the style of clicked cells
 */
function playerMove(elem) {
    "use strict";
    if (!endState) {
        drawToken(elem, 'X');
        turnPasses();

        setTimeout(function () {
		computerMove();
        	turnPasses();
	}, 300);
    }
}

//----------------------------------------------------------//
//--------------Difficulty level management----------------//
//--------------------------------------------------------//

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

