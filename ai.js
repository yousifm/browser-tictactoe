/**
 *Changes the value at index 'move' to 'currentPlayer' and returns
 *a copy of the 'board' array.
 */
function makeMove(board, move, currentPlayer) {
    "use strict";
	var boardCopy = board.slice();
	boardCopy[move] = currentPlayer;
	return boardCopy;
}

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
 *Checks whether the current state is a win, loss or tie
 */
function checkState(board) {
    "use strict";
	var iterator,
		winnerRow,
		winnerColumn,
		winnerDiag1,
		winnerDiag2;


	for (iterator = 0; iterator < 3; iterator += 1) {
		//check rows
		winnerRow = getWinner(board[iterator * 3],
                              board[iterator * 3 + 1],
                              board[iterator * 3 + 2]);

		//check column
		winnerColumn = getWinner(board[iterator],
								 board[iterator + 3],
								 board[iterator + 6]);

		if (winnerRow === 'X' || winnerColumn === 'X') {
			return 'loss';
		} else if (winnerRow === 'O' || winnerColumn === 'O') {
			return 'win';
		}
	}

	//check diagonals
	winnerDiag1 = getWinner(board[0], board[4], board[8]);
	winnerDiag2 = getWinner(board[2], board[4], board[6]);
	if (winnerDiag1 === 'X' || winnerDiag2 === 'X') {
		return 'loss';
	} else if (winnerDiag1 === 'O' || winnerDiag2 === 'O') {
		return 'win';
	}

	//check tie
	if (getEmptyCells(board).length === 0) {
		return 'tie';
	}
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

/**
 *Returns the value of a certain move using the minimax algorithm
 *'maxdepth' indicates the depth at which the function should stop
 *searching
 */
function minimaxValue(board, move, currentPlayer, maxdepth, depth) {
    "use strict";
	var newBoard = makeMove(board, move, currentPlayer),
		state = checkState(newBoard),
		emptyCells = getEmptyCells(newBoard),
		opponent = getOpponent(currentPlayer),
		moveValues = [],
        depth = depth || 0,
		iterator;

    if (depth >= maxdepth) {
        return 0;
    }

	switch (state) {
	case 'win':
		return 1 * (10 - depth);
	case 'loss':
		return -1 * (10 - depth);
	case 'tie':
		return 0;
	}


	for (iterator = 0; iterator < emptyCells.length; iterator += 1) {
		moveValues.push(minimaxValue(newBoard, emptyCells[iterator], opponent, maxdepth, depth + 1));
	}
	//Minimizer
	if (opponent === 'X') {
		return Math.min.apply(null, moveValues);
    //Maximizer
	} else if (opponent === 'O') {
		return Math.max.apply(null, moveValues);
	}
}

/**
 *Returns the best moves based on the score returned by
 *the minimaxValue function
 */
function minimaxBestMove(board, maxDepth) {
    "use strict";
	var emptyCells = getEmptyCells(board),
		moveValues = [],
        bestMoves = [],
        maxDepth = maxDepth || 9,
        maximum,
		iterator;

	for (iterator = 0; iterator < emptyCells.length; iterator += 1) {
		moveValues.push(minimaxValue(board, emptyCells[iterator], 'O', maxDepth));
	}

    maximum = Math.max.apply(null, moveValues);
    for (iterator = 0; iterator < emptyCells.length; iterator += 1) {
        if (moveValues[iterator] === maximum) {
            bestMoves.push(emptyCells[iterator]);
        }
    }
    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}
