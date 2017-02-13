function makeMove(board, move, currentPlayer) {
	var boardCopy = board.slice();
	boardCopy[move] = currentPlayer;
	return boardCopy;
}

function getEmptyCells(board) {
	var iterator,
		emptyCells = [];
	for (iterator = 0; iterator < board.length; iterator += 1) {
		if (board[iterator] === '' || board[iterator] === ' ') {
			emptyCells.push(iterator);
		}
	}
	return emptyCells;
}

function getWinner(cell1, cell2, cell3) {
	if (cell1 === cell2 && cell2 === cell3) {
		return cell1;
	}
	return null;
}

function checkState(board) {
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

function getOpponent(player) {
	if (player === 'X') {
		return 'O';
	} else if (player === 'O') {
		return 'X';
	}
}

function minimaxValue(board, move, currentPlayer) {
	var newBoard = makeMove(board, move, currentPlayer),
		state = checkState(newBoard),
		emptyCells = getEmptyCells(newBoard),
		opponent = getOpponent(currentPlayer),
		moveValues = [],
		iterator;

	switch (state) {
	case 'win':
		return 1;
	case 'loss':
		return -1;
	case 'tie' :
		return 0;
	}


	for (iterator = 0; iterator < emptyCells.length; iterator += 1) {
		moveValues.push(minimaxValue(newBoard, emptyCells[iterator], opponent));
	}
	//Minimizer
	if (opponent === 'X') {
		return Math.min.apply(null, moveValues);
	}
	//Maximizer
	else if (opponent === 'O') {
		return Math.max.apply(null, moveValues);
	}
}

function minimaxBestMove(board) {
	var emptyCells = getEmptyCells(board),
		iterator,
		moveValues = [];

	for (iterator = 0; iterator < emptyCells.length; iterator += 1) {
		moveValues.push(minimaxValue(board, emptyCells[iterator], 'O'));
	}
	return emptyCells[moveValues.indexOf(Math.max.apply(null, moveValues))];
}
