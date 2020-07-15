var gameBoard;

var bot;
var human;
var radiobtns=document.getElementsByName("symbol");
const startBtn=document.getElementById("startButton");
radiobtns[0].addEventListener('click',function(){

    human = this.value;
    bot=radiobtns[1].value;
    console.log(bot);
    startBtn.style.visibility="visible";

});

radiobtns[1].addEventListener('click',function(){

    human = this.value;
    bot=radiobtns[0].value;
    console.log(bot);
    startBtn.style.visibility="visible";
});
var cells=document.getElementsByClassName("cell");
const winCombos =[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]] 

function startGame()
{
    gameBoard=Array.from(Array(9).keys());
    for(var i=0;i<cells.length;i++)
    {
        cells[i].value='';
        cells[i].addEventListener('click',clickTurn,false);
        cells[i].style.backgroundColor="pink";
    }

 
    radiobtns[0].disabled=true;
    radiobtns[1].disabled=true;
    alert("Make your move!");
    
}

function clickTurn(cell)
{
    if(typeof gameBoard[cell.target.id]== 'number')
    {
        turn(cell.target.id,human);
        if(!draw()) turn(ai_move(),bot);
    }
    
}

function turn(cell_id,player)
{
    gameBoard[cell_id]=player;
    document.getElementById(cell_id).value=player;
    let winstat= hasWon(gameBoard,player);
    if(winstat){gameOver(winstat)}
}

function hasWon(board,player)
{
    let moves=board.reduce((total,cellVal,currIndex)=>(cellVal==player)?total.concat(currIndex):total,[]);
    let gameWon=null;
    for(let [index,wincom] of winCombos.entries())
    {
        if(wincom.every(win=>moves.indexOf(win)>-1))
        {
            gameWon={index:index,player:player};
            break;
        }
    }
    return gameWon;
}

function gameOver(winstat)
{   
    for(let index of winCombos[winstat.index])
    {
        document.getElementById(index).style.backgroundColor=
         (winstat.player==human)?"green":"red";
    }
    for(var i=0;i<cells.length;i++)
    {
        cells[i].removeEventListener('click',clickTurn,false);
    }

    alert("The winner is "+winstat.player);
}

function emptySpots()
{
    return gameBoard.filter(val => typeof val== 'number');
}

function draw()
{
    if(emptySpots().length==0)
    {
        for(var i=0;i<cells.length;i++)
        {
            cells[i].removeEventListener('click',clickTurn,false);
        }
        alert('The Game Has tied!');
        return true;
    }
    return false;
   
}


function ai_move()
{
    return minmax(gameBoard,bot).index;
}
function minmax(board,player)
{
    var availableSpots = emptySpots();
    if(hasWon(board,player))
    {
        return {score:-10}
    }
    else if (hasWon(board,bot))
    {
        return {score:20}
    }
    else if(availableSpots.length===0)
    {
        return {score:0}
    }

    var moves=[];
    for(var i=0;i<availableSpots.length;i++)
    {
        var move={}
        move.index=board[availableSpots[i]];
        board[availableSpots[i]]=player;
        if (player==bot)
        {
            var res=minmax(board,human);
            move.score=res.score;
        }else{
            var res=minmax(board,bot);
            move.score=res.score;
        }

        board[availableSpots[i]]=move.index;
        moves.push(move);
    }
    var bestMove;
    if(player==bot)
    {
        var b_score=-10000;
        for(var i=0;i<moves.length;i++)
        {
            if(moves[i].score>b_score)
            {
                b_score=moves[i].score;
                bestMove=i;
            }
        }

    }
    else{
        var b_score=10000;
        for(var i=0;i<moves.length;i++)
        {
            if(moves[i].score<b_score)
            {
                b_score=moves[i].score;
                bestMove=i;
            }
        }
    }
    return moves[bestMove];
}