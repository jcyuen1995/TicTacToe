var originBoard;
var difficulty ;
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombo = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
]

const cells = document.querySelectorAll('.box');
difficulty = document.getElementById("difficulty");

function startGame(level) {
    var hide = document.querySelector('.endGame');
    if (!hide.classList.contains("invis")) {
        hide.classList.add('invis');
    }
    document.getElementById("start").innerText = "Reset";
    originBoard = Array.from(Array(9).keys());
    for(var i = 0; i < cells.length; i++) {
        cells[i].firstChild.innerText = ' ';
        cells[i].firstChild.classList.remove("show");
        cells[i].style.backgroundColor = "transparent";
        cells[i].addEventListener('click', turnClick, false)
    }

    function turnClick(square) {
        if(typeof originBoard[square.target.id] == 'number') {
            turn(square.target.id, huPlayer);
            let gameWon = checkWin(originBoard,huPlayer);
            if (gameWon) {gameOver(gameWon);}
            else if(checkTie()) {
                declareWinner("Tie Game");
            }
            else {
                setTimeout(() => {
                    turn(bestSpot(),aiPlayer);
                    let gameWon = checkWin(originBoard,aiPlayer);
                    if (gameWon) {gameOver(gameWon);}
                }, 5);
            }
        }
    }

    function turn(squareID, player) {
        originBoard[squareID] = player;
        var placement = document.getElementById(squareID);placement.firstChild.innerText = player;
        placement.firstChild.classList.toggle("show");

    }

    function checkWin(board, player) {
        let plays = board.reduce((a, e, i) => 
            (e === player) ? a.concat(i) : a, []);
        let gameWon = null;
        for (let [index, win] of winCombo.entries()) {
            if (win.every(elem => plays.indexOf(elem) > -1)) {
                gameWon = {index: index, player: player};
                break;
            }
        }
        return gameWon;
    }

    function gameOver(gameWon) {
        for (let index of winCombo[gameWon.index]) {
            document.getElementById(index).style.transition = "all 0.8s";
            document.getElementById(index).style.backgroundColor =
            gameWon.player == huPlayer ? "green" : "red";
        }
        for (var i = 0; i < cells.length; i++) {
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner(gameWon.player == huPlayer ? "You Win" : "You Lose");
    }

    function emptySquares() {
        return originBoard.filter(s => typeof s == 'number');
    }

    function bestSpot() {
        if (level == 'easy') {
            return emptySquares()[0];
        }

        if (level == 'medium'){
            var spotsLeft = originBoard.filter(s => typeof s == 'number');
            var i = Math.floor((Math.random() * (spotsLeft.length)));
            return emptySquares()[i];
        }

        if(level == 'hard'){
            return minimax(originBoard, aiPlayer).index;
        }
    }

    function checkTie() {
        if(emptySquares().length == 0) {
            for(var i = 0 ; i < cells.length; i ++) {
                cells[i].style.backgroundColor = "yellow";
                cells[i].removeEventListener('click', turnClick, false);    
            }
            return true;
        }
        return false;
    }
    
    function declareWinner(player) {
        var winner = document.querySelector('.endGame');
        winner.classList.remove("invis");
        document.querySelector(".endGame").innerText = player;
        var x = document.getElementById("difficulty");
        x.disabled = false;
        document.getElementById("start").innerText = "Replay?";
    }

    function minimax(checkBoard, player) {
        var emptySpots = emptySquares();
        //base case check if next move will either be won by AI or player
        if (checkWin(checkBoard, huPlayer)) {
            return {score: -10};
        } else if (checkWin(checkBoard, aiPlayer)) {
            return {score: 10};
        } else if (emptySpots.length === 0) {
            return {score: 0};
        }
        //loop through all the empty spots and recurse through each emptyspots to see all possible outcomes
        var moves = [];
        for (var i = 0; i < emptySpots.length; i++) {
            var move = {};
            move.index = checkBoard[emptySpots[i]];
            //place the player into the first empty spot 
            checkBoard[emptySpots[i]] = player;
            //recurse and place the human player in the next spot 
            if (player == aiPlayer) {
                var result = minimax(checkBoard, huPlayer);
                move.score = result.score;
            } else {
            //if human played place ai player next
                var result = minimax(checkBoard, aiPlayer);
                move.score = result.score;
            }
            
            // update the moves array with the move index and the score
            checkBoard[emptySpots[i]] = move.index;
    
            moves.push(move);
        }
    
        var bestMove;
        //choose a higher score for the ai player
        if(player === aiPlayer) {
            var bestScore = -10000;
            for(var i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            //else choose a low score when huPlayer is playing
            var bestScore = 10000;
            for(var i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
    
        return moves[bestMove];
    }
}
