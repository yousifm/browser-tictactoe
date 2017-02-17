/**
 *Returns the value of a certain move using the minimax algorithm
 *'maxdepth' indicates the depth at which the function should stop
 *searching
 */
function minimaxValue(board, move, currentPlayer,
                      maxdepth, depth, alpha, beta) {
    "use strict";
    //Copies the board and makes the move
	var newBoard = makeMove(board, move, currentPlayer),

		state = checkState(newBoard),
		emptyCells = window.getEmptyCells(newBoard),
		opponent = getOpponent(currentPlayer),
		moveValues = [],
		iterator;

    //Default values
    depth = depth || 0;
    alpha = alpha || -Infinity;
    beta = beta || Infinity;

    /**
     *Stops searching and returns 0 if it hits the max depth
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
     *Note: 10 is one more than the maximum depth the function can reach
     *as only 9 moves can be made
     */
	switch (state) {
	case 'win':
		return (10 - depth);
	case 'loss':
		return -(10 - depth);
	case 'tie':
		return 0;
	}


	//Minimizer
    if (opponent === 'X') {
        for (iterator = 0; iterator < emptyCells.length; iterator += 1) {
            beta = Math.min(beta, minimaxValue(
                                    newBoard, emptyCells[iterator],
                                    opponent, maxdepth, depth + 1,
                                    alpha, beta));

            if (alpha >= beta) {
                break;
            }
        }
        return beta;
    }
    //Maximizer
    else if (opponent === 'O') {
        for (iterator = 0; iterator < emptyCells.length; iterator += 1) {
           alpha = Math.max(alpha, minimaxValue(
                                    newBoard, emptyCells[iterator],
                                    opponent, maxdepth, depth + 1,
                                    alpha, beta));
           if (alpha >= beta) {
               break;
           }
       }
       return alpha;
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
