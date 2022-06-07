var player1Turn = true;
var gameOver = false;
var numGameButtons = 9;
var numRows = 3;
var numColumns= 3;
var numTurns = 0;

console.log(5);

function refresh(){
    var buttons = document.getElementsByTagName('button');

    for(let i = 0; i < numGameButtons; i++){
        buttons[i].innerHTML = "";
    }

    player1Turn = true;
    gameOver = false;
    numTurns = 0;

    document.getElementById("winner").style.visibility = "hidden";
}

function onClick(element){
    if(!gameOver && element.innerHTML == ""){
        numTurns++;
        
        if(player1Turn){
            element.innerText = "X";
        } else{
            element.innerText = "O";
        }

        console.log(element.innerText)

        checkWin();

        if(numTurns >= numColumns * numRows)
            gameOver = true;
        
        player1Turn = !player1Turn;
    }
}

function checkWin(){
    var buttons = document.getElementsByTagName('button');

    if(isHorizontalWin(buttons) || isVerticalWin(buttons) || isDiagonalWin(buttons)){
        let h2 = document.getElementById("winner");
        h2.style.visibility = "visible";
        
        if(player1Turn)
            h2.innerHTML = "Player 1 has Won";
        else
            h2.innerHTML = "Player 2 has Won";
        
        gameOver = true;
    }
}

function isHorizontalWin(buttons){
    for(let i = 0; i < numRows; i++){
        if(buttons[(numRows * i)].innerHTML != ""
        && buttons[(numRows * i)].innerHTML == buttons[(numRows * i) + 1].innerHTML
        && buttons[(numRows * i)].innerHTML == buttons[(numRows * i) + 2].innerHTML){
            return true;
        }
    }
    return false;
}

function isVerticalWin(buttons){
    for(let i = 0; i < numColumns; i++){
        if(buttons[numColumns + i].innerHTML != ""
        && buttons[numColumns + i].innerHTML == buttons[(numColumns * 1) + i].innerHTML
        && buttons[numColumns + i].innerHTML == buttons[(numColumns * 2) + i].innerHTML){
            return true;
        }
    }
    return false;
}

function isDiagonalWin(buttons){
    if(buttons[(numColumns * 0)].innerHTML != ""
    && buttons[(numColumns * 0)].innerHTML == buttons[(numColumns * 1) + 1].innerHTML
    && buttons[(numColumns * 0)].innerHTML == buttons[(numColumns * 2) + 2].innerHTML){
        return true;
    }
    if(buttons[(numColumns * 0) + 2].innerHTML != ""
    && buttons[(numColumns * 0) + 2].innerHTML == buttons[(numColumns * 1) + 1].innerHTML
    && buttons[(numColumns * 0) + 2].innerHTML == buttons[(numColumns * 2)].innerHTML){
        return true;
    }
    return false;
}