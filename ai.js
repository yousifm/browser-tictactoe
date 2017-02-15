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

    /**
     * board:
     * -------
     *|0  1  2|
     *|3  4  5|
     *|6  7  8|
     * -------
     */
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
	if (window.getEmptyCells(board).length === 0) {
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
    //Copies the board and makes the move
	var newBoard = makeMove(board, move, currentPlayer),
		state = checkState(newBoard),
		emptyCells = window.getEmptyCells(newBoard),
		opponent = getOpponent(currentPlayer),
		moveValues = [],
		iterator;

    depth = depth || 0;

    /**
     *Stops searching a returns 0 if it hits the max depth
     */
    if (depth >= maxdepth) {
        return 0;
    }

    /**
     *Returns the value of the move if it results in a win, a loss or a tie,
     *uses 10 - currentDepth for the score to make ealier wins for O worth more
     *than later wins and make later losses better than earlier losses.
     *So that if computer is going to win no matter what move it makes it tries
     *to end the game earlier and if its going to lose anyways it tries to
     *prolong the game
     */
	switch (state) {
	case 'win':
		return (10 - depth);
	case 'loss':
		return -(10 - depth);
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
	var emptyCells = window.getEmptyCells(board),
		moveValues = [],
        bestMoves = [],
        maximum,
		iterator;

    maxDepth = maxDepth || 9;
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
