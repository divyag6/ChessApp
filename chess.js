/*
  author: Divya Mittal
*/


$(document).ready(function(e) {

    $('[data-launch-view]').click(function(e) {
        e.preventDefault();
        var viewName = this.getAttribute("data-launch-view");
        showView(viewName);

    });
    if ("ontouchstart" in document.documentElement)
        $('#practice-board').on('touchstart', '.square-55d63', clickOnSquare);
    else
        $('#practice-board').on("click", ".square-55d63", clickOnSquare);
    console.log("loading options");
    var opening = [];
    readOpeningData();
    readUserData();
});

function showView(viewName) {
    $('.view').hide();
    $('#' + viewName).show();
    console.log(viewName);
    if (viewName == 'practice-opening') {
        id = document.getElementsByClassName("board")[0].id;
        board1 = Chessboard(id);
        firstClick = true;
        //console.log($(".board").find(".piece-417db"));
        $('.board').on('scroll touchmove touchend touchstart contextmenu', function(e) {
            e.preventDefault();
        });
        $(window).resize(board1.resize);
    }
    if (viewName == 'record-opening') {
        id = document.getElementsByClassName("board")[1].id;
        recordOpening();
    }
    if (viewName == 'record-game') {
        id = document.getElementsByClassName("board")[2].id;
        recordGame();
    }

    if (viewName == 'end-puzzles') {
        id = document.getElementsByClassName("board")[3].id;
        setPuzzle();
    }

    if (viewName == 'openings-link') {
        displayLinks();
    }
    if (viewName == 'game-analysis') {
        id = document.getElementsByClassName("board")[4].id;
    }

}


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is //optional

var firebaseConfig = {
    apiKey: "AIzaSyDOQ7yNLkkMMCqancgAceOid88tcp9HadQ",
    authDomain: "chess-openings-c6292.firebaseapp.com",
    projectId: "chess-openings-c6292",
    storageBucket: "chess-openings-c6292.appspot.com",
    databaseURL: "https://chess-openings-c6292-default-rtdb.asia-southeast1.firebasedatabase.app/",
    messagingSenderId: "828840101170",
    appId: "1:828840101170:web:0dc642a9498f61a7ae432b",
    measurementId: "G-NHGE0DMEMJ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var db = firebase.database();

// initialize chess board

var firstClick = true;
var engine;
var id = 0;
var i = 0;
var user;
var message = document.getElementById("p01");
message.innerHTML = "";
var board1;
var wrong;
var blk;
var white;
var statusId;
var position;
var mode;
var game;
var fens = {};
var posObj = {};
var opening;
var openingErrors = 0;
var strtTime;
var endTime;
var moves = {};
var userId;
var id;
var m = 30;
var s = 0;
var timeWhite;
var timeBlk;
var tWhite;
var tBlk;
var timer_is_on_b = 0;
var timer_is_on_w = 0;
var whiteSquareGrey = "#a9a9a9";
var blackSquareGrey = "#696969";
var ptr = 0;
var chess;
var moves;
var count = 0;
var t;
var fens = [
    ['8/5k2/4p3/2K5/8/8/8/8 w - - 0 1', 'Draw', 'Black wins'],
    ['8/pk5K/8/8/8/8/8/8 w - - 0 1', 'Black wins', 'Black wins'],
    ['3k4/6p1/2K5/8/8/8/8/8 w - - 0 1', 'Draw', 'Black wins'],
    ['8/8/8/5kP1/8/3K4/8/8 w - - 0 1', 'Draw', 'Draw'],
    ['8/8/6kp/8/5K2/8/8/8 w - - 0 1', 'Draw', 'Draw'],
    ['8/8/4k3/7p/3K4/8/8/8 w - - 0 1', 'Draw', 'Draw'],
    ['8/8/4k1P1/8/8/2K5/8/8 w - - 0 1', 'Draw', 'Draw'],
    ['8/8/4k3/2K2P2/8/8/8/8 w - - 0 1', 'Draw', 'Draw'],
    ['8/3p4/2k2K2/8/8/8/8/8 w - - 0 1', 'Black wins', 'Black wins'],
    ['8/6k1/4p3/7K/8/8/8/8 w - - 0 1', 'Draw', 'Black wins'],
    ['1k6/3p3K/8/8/8/8/8/8 w - - 0 1', 'Black wins', 'Black wins'],
    ['8/3k4/7p/2K5/8/8/8/8 w - - 0 1', 'Draw', '	Draw'],
    ['8/4k2p/8/2K5/8/8/8/8 w - - 0 1', 'Draw', '	Draw'],
    ['8/5k2/7p/8/8/1K6/8/8 w - - 0 1', 'Draw', '	Black wins'],
    ['8/5k2/8/4p3/8/1K6/8/8 w - - 0 1', 'Draw', 'Black wins'],
    ['8/8/8/2k1p3/8/1K6/8/8 w - - 0 1', 'Draw', 'Black wins'],
    ['8/8/1k6/3p1K2/8/8/8/8 w - - 0 1', 'Black wins', 'Black wins'],
    ['8/8/8/1k1p1K2/8/8/8/8 w - - 0 1', 'Black wins', 'Black wins'],
    ['8/5k1p/8/5K2/8/8/8/8 w - - 0 1', 'Draw', 'Draw'],
    ['8/8/5kp1/8/4K3/8/8/8 w - - 0 1', 'Draw', 'Black wins'],
    ['8/8/6pk/8/4K3/8/8/8 w - - 0 1', 'Black wins', 'Black wins'],
    ['8/8/5p1k/8/4K3/8/8/8 w - - 0 1', 'Draw', 'Black wins'],
    ['8/8/1p2k3/8/5K2/8/8/8 w - - 0 1', 'Draw', 'Black wins'],
    ['8/8/4k3/8/2K2p2/8/8/8 w - - 0 1', 'Draw', 'Black wins'],
    ['8/2k5/8/6K1/3p4/8/8/8 w - - 0 1', 'Draw', 'Black wins']
];
var answers = [];
var config = {
    //draggable: true,
    moveSpeed: 500,
    snapbackSpeed: 100,
    snapSpeed: 500,
    position: 'start',
    onDragStart: onDragStart,
    //onDrop: onDrop,
    //onMouseoutSquare: onMouseoutSquare,
    //onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd,
    dropOffBoard: 'snapback' // this is the default
}


function init() {
    engine = engineGame();
    engine.setSkillLevel
    engine.start();
}

function get_moves(game) {
    var moves = '';
    var history = game.history({
        verbose: true
    });

    for (var j = 0; j < history.length; ++j) {
        var move = history[j];
        moves += ' ' + move.from + move.to + (move.promotion ? move.promotion : '');
    }

    return moves;
}

function writeOpeningData(game, name, t = "") {
    console.log(mode);
    if (mode == 2)
        //db.ref('games/'+ name).set(game);
        db.ref('games/' + name).push({
            pgn: game,
            black: blk,
            white: white,
            result: "0-1",
            tournament: t
        });

    else {
        var id = name.split(".");
        console.log(id[0]);
        db.ref('openings/' + id[0]).set(game);
        readOpeningData();
        //  var opId= name;
    }
}

function writeUserData(name) {
    var userRef;
    userRef = db.ref('users/').push({
        name: name,
        errors: {}
    });
    var userId = userRef.key;

}

function readUserData() {

    const dbRef = firebase.database().ref();
    dbRef.child("users").get().then((snapshot) => {
        if (snapshot.exists()) {

            user = snapshot.val();
            console.log("User exists" + Object.keys(user));

            userId = Object.keys(user);
            console.log(user);
        } else {
            console.log("No user");
            writeUserData("Aarav");

        }
    }).catch((error) => {
        console.error(error);
    });
}

function pgnToPosition(pgn, key) {
    moves[key] = pgn;
    fens[key] = {};
    var newGame = new Chess();
    //console.log(moves);
    for (var j = 0; j < moves[key].length; j++) {
        newGame.move(moves[key][j]);
        //console.log( moves[key][j]);
        fens[key][j] = newGame.fen();
        //console.log('fens' + fens[key][j]);
        //posObj[key].push(Chessboard.fenToObj(fens[key][j]));

    }

    //var board = Chessboard('board1',fens[0]);
}


function readOpeningData() {

    const dbRef = firebase.database().ref();
    dbRef.child("openings").get().then((snapshot) => {
        if (snapshot.exists()) {
            console.log("reading");
            var val = snapshot.val();
            var exists;
            //console.log(val);
            console.log(Object.keys(val));
            for (var j = 0; j < Object.keys(val).length; j++) {
                exists = false;


                $('#openings option').each(function() {
                    if (this.value == Object.keys(val)[j])
                        exists = true;
                });
                if (!exists) {
                    $('#openings').append('<option value = "' + Object.keys(val)[j] + '">' + Object.keys(val)[j] + '</option>');
                    //console.log(Object.keys(val)[j]);
                    var key = Object.keys(val)[j];
                    // console.log(val[key]);
                    pgnToPosition(val[key], key);
                }
            }
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}


function loadFile() {
    var pgn;
    var file = document.getElementById("pgn-file").files[0]
    console.log(file);
    read = new FileReader();
    read.readAsBinaryString(file);
    read.onloadend = function() {
        pgn = read.result;
        var game = new Chess();
        console.log(file["name"]);
        var boolean = game.load_pgn(pgn);
        console.log(boolean);
        console.log(game.history());
        writeOpeningData(game.history(), file["name"]);
    }

}

function loadGameAnalysis() {
    var pgn;
    var success;
    var file = document.getElementById("game-file").files[0]
    init();
    $('#game-analysis-pane').show();
    console.log(file);
    game = new Chess();
    read = new FileReader();
    read.readAsBinaryString(file);
    read.onloadend = function() {
        pgn = read.result;
        var boolean = game.load_pgn(pgn);
        //console.log(boolean);
        console.log(game.history());
        success = writeGame(game.history(), file["name"]);

        board1 = ChessBoard(id, 'start');
        $(window).resize(board1.resize);
        //console.log(game.fen());
        //console.log(game.pgn()); 
        chess = new Chess();
        userGame = new Chess();
        // gmGame= new Chess();
        moves = game.history({
            verbose: true
        });
        userGame.move(moves[0]);
        // gmGame.mov(moves[0]);
        chess.move(moves[0]);
        board1.position(chess.fen());
        $('#game-pgn').html(chess.pgn());
    }

}

function onNext() {
    if (count < moves.length) {
        count++;
        //console.log("next"+count);
        chess.move(moves[count]);
        userGame.move(moves[count]);
        board1.position(chess.fen());
        $('#game-pgn').html(chess.pgn());
    } else
        location.reload(true);
}

function onPrev() {

    if (count > 0) {
        count--;
        chess.undo();
        userGame.undo();
        board1.position(chess.fen());
        $('#game-pgn').html(chess.pgn());

    }
}


function onPlay() {
    var gmMove = '';
    console.log(count);
    console.log(moves.length);

    if (count + 1 == moves.length) {
        alert("Game Over");
        location.reload(true);
        return;
    }
    console.log(engine);
    engine.findMove(get_moves(chess));
    var move;
    var userMove;
    do {
        userMove = prompt("What is your next move " + user[userId]["name"] + " ?", "e4");
        move = userGame.move(userMove);
        console.log(userMove);
        console.log(userGame.history());
        console.log(move);
    } while (move == null);
    var uMove = move.from + move.to + (move.promotion ? move.promotion : '');
    userGame.undo();
    engine.evaluateUserMove(get_moves(userGame), uMove);
    userGame.move(userMove);
    gmMove += ' ' + moves[count + 1].from + moves[count + 1].to + (moves[count + 1].promotion ? moves[count + 1].promotion : '');

    engine.evaluateMove(get_moves(chess), gmMove);
    onNext();
    /*if(userMove== gmMove)
      alert("You thought just like  a Grand master");
    else
      alert("Your move didn't the grand master's!");*/

}


function writeGame(game, name) {
    var id = name.split(".");
    console.log(id[0]);
    db.ref('analysis/' + id[0]).set(game);
    return true;
}

function startGame() {
    var selected_option = $('#openings option:selected');
    if (selected_option.val() !== "0") {
        $('#start').show();
        $('#reset1').hide();
        opening = selected_option.val();
    }

}


function recordOpening() {
    i = 0;
    mode = 1;
    //$('#load-file').hide();
    //$('#openings').hide();
    //$('#openings-label').hide();
    //$('#reset').hide();
    //$('#start').hide();
    //$('#save').show();
    //$('#reset1').show();
    //$('#undo').show();
    //$('#flip').hide(); 
    //$('#make-moves-label').show();
    //$('#game-details').hide();

    board1 = ChessBoard(id, config);
    $(window).resize(board1.resize)
    game = new Chess();

    updateStatus();


}

function recordGame() {
    mode = 2;
    timeWhite = 100;
    timeBlk = 100;
    i = 0;
    //$('#load-file').hide();
    // $('#openings').hide();
    // $('#openings-label').hide();
    // $('#reset').hide();
    // $('#start').hide();
    $('#save2').show();
    $('#reset2').show();
    $('#undo2').show();
    $('#flip2').show();
    // $('#game-details-1').show();
    // $('#game-details-2').show();

    $('#player1').show();
    $('#player2').show();

    $('#timer-1-b').show();
    $('#timer-2-w').show();
    $('#timer-1-w').hide();
    $('#timer-2-b').hide();
    document.getElementById("timer-2-w").innerHTML = m + "m" + s + "s";
    document.getElementById("timer-1-b").innerHTML = m + "m" + s + "s";
    document.getElementById("timer-2-b").innerHTML = m + "m" + s + "s";
    document.getElementById("timer-1-w").innerHTML = m + "m" + s + "s";



    board1 = ChessBoard(id, config);
    $(window).resize(board1.resize)
    game = new Chess();
    updateStatus();
    if (blk == undefined || blk == "")
        blk = prompt("Name of the black player: ", "Aarav");
    if (white == undefined || white == "")
        white = prompt("Name of the white player: ", "Nikhil");
    var player1 = document.getElementById("player1");
    player1.innerHTML = blk;
    var player2 = document.getElementById("player2");
    player2.innerHTML = white;
    startTimerWhite();


}

function onDrop(source, target, piece, newPos, oldPos, orientation) {


    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    })

    // illegal move
    if (move === null) return 'snapback'


    console.log('Source: ' + source)
    console.log('Target: ' + target)
    console.log('Piece: ' + piece)
    console.log('New position: ' + Chessboard.objToFen(newPos))
    console.log('Old position: ' + Chessboard.objToFen(oldPos))
    console.log('Orientation: ' + orientation)
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')

    if (mode == 1) {

        console.log("move" + game.pgn());
        console.log("history" + game.history());
        game.pgn();
    }
    if (mode == 0) {
        removeGreySquares();
        var res = fens[opening][i];
        var fen = game.fen();
        //console.log(fen);
        //console.log(res);
        if (res === fen) {
            $('#hint').hide();
            message.innerHTML = "Correct Move " + moves[opening][i];
            wrong = false;
            i++;
            console.log('correct move! Move no: ' + i);
            updateStatus();
            onSnapEnd();
        } else {
            $('#hint').show();
            message.innerHTML = "Wrong move: " + piece + target;
            alert("Wrong Move! " + source + " to " + target);
            //writeErrorToFile(i,source,target,piece);
            openingErrors += 1;
            //storeError(i,source,target,piece);
            game.undo();
            updateStatus();
            return 'snapback';
        }
    }
}


function clickOnSquare(evt) {

    //moves={};
    // do not pick up pieces if the game is over
    if (game.game_over()) return false
    // or if it's not that side's turn

    if (firstClick) {
        console.log(firstClick);
        source = $(this).data("square");
        piece = evt.target.getAttribute("data-piece");
        greySquare(source);
        console.log("You clicked on square: " + source + piece);
        // get list of possible moves for this square
        if (piece !== null) {
            if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
                (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
                return false
            }
            movesOptions = game.moves({
                square: source,
                verbose: true
            })
            if (movesOptions.length !== 0) {
                firstClick = false;
                console.log(movesOptions);
                return;
            }
            // exit if there are no moves available for this square
            else {
                removeGreySquares();
                return;
            }

        } else {
            removeGreySquares();
            return;
        }
    }
    if (!firstClick) {
        console.log(firstClick);

        target = $(this).data("square");
        console.log("Target square:" + target);
        firstClick = true;
        //greySquare(source);
        onDrop(source, target, piece);

    }

}


function exit() {

    alert("Congratulations!!");
    stopOpeningTimer();
    endTime = $('#timer').text();
    storeError();
    reset();
    $('.view').hide();
    $('#openings-link').show();

}

function writeErrorToFile(move, source, target, piece) {
    const d = new Date();
    var fileName = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
    var path = "/errors/" + fileName + ".txt";
    console.log(path);
    var txtFile = new File(["Aarav Mittal"], "test.txt");
    console.log(txtFile);
    saveAs(txtFile);
}


function storeError() {

    //var userRef ;
    //move=move+1;
    console.log(opening);
    const d = new Date();
    var id = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
    if (user[userId]["errors"][id] !== undefined && user[userId]["errors"][id][opening] !== undefined) {
        console.log(user[userId]["errors"][id][opening]["count"]);
        db.ref('users/' + userId + '/errors/' + id + '/' + opening).set({
            count: openingErrors,
            start_time: strtTime,
            end_time: endTime
        });
    } else {
        db.ref('users/' + userId + '/errors/' + id + '/' + opening).set({
            count: openingErrors,
            start_time: strtTime,
            end_time: endTime
        });
    }
}

function loadGame() {
    if (game !== undefined)
        reset();
    console.log("Loading Game!" + opening);
    mode = 0;
    openingErrors = 0;
    $('#reset1').show();
    $('#start').hide();
    i = 0;
    board1 = ChessBoard(id, config);
    $(window).resize(board1.resize)

    game = new Chess();
    updateStatus();
    startOpeningTimer();
    strtTime = $('#timer').text();
    console.log(strtTime);

}

function reset() {
    console.log("Reset board!");
    i = 0;
    board1 = board1.start();
    game.clear();

    var txtarea = document.getElementsByClassName("pgn-display")[mode];
    console.log(txtarea);
    txtarea.innerHTML = game.history();

    if (mode == 2)
        recordGame();
    if (mode == 1)
        recordOpening();
    if (mode == 0) {
        statusId.innerHTML = "";
        //board1=board1.clear(); 

    }
    // board1 = ChessBoard(id, config);
    // game= new Chess();
    message.innerHTML = ""
    //$('#hint').hide();
    //$('#reset').hide();
    //$('#start').show();
}

function saveOpening() {
    var fileName = prompt("Please enter the file name", "Dutch");
    if (fileName != null) {
        writeOpeningData(game.history(), fileName);
        board1 = board1.start();
        game.clear();
        var txtarea = document.getElementsByClassName("pgn-display")[mode];
        console.log(txtarea);
        txtarea.innerHTML = game.history();
        recordOpening();
    }
}

function saveGame() {
    var tournament = prompt("Name of the tournament ", "Home");

    var fileName = prompt("Please enter the game name", "Dutch");
    if (fileName != null) {
        writeOpeningData(game.pgn(), fileName, tournament);
        blk = "";
        white = "";
        $('#player1').hide();
        $('#player2').hide();
        statusId.innerHTML = "";
        $('#timer-1-b').hide();
        $('#timer-2-w').hide();
        $('#timer-1-w').hide();
        $('#timer-2-b').hide();

        $('#save2').hide();
        $('#reset2').hide();
        $('#undo2').hide();
        $('#flip2').hide();

        var txtarea = document.getElementsByClassName("pgn-display")[mode];
        console.log(txtarea);
        txtarea.innerHTML = "";
        board1 = board1.clear();
        //recordGa();

        // $('#save').hide();
    }
}


function undo() {
    game.undo();
    board1.position(game.fen());
    if (game.turn() === 'w')
        stopTimerBlack();
    else
        stopTimerWhite();

}

function flip() {
    board1.flip();
    var player1 = document.getElementById("player1");
    var player2 = document.getElementById("player2");

    if (player1.innerHTML == blk) {
        console.log("p1:" + player1.innerHTML);
        console.log("p2:" + player2.innerHTML);

        player1.innerHTML = white;
        player2.innerHTML = blk;
        $('#timer-1-w').show();
        $('#timer-1-b').hide();
        $('#timer-2-w').hide();
        $('#timer-2-b').show();

    } else {

        console.log("p1:" + player1.innerHTML);
        console.log("p2:" + player2.innerHTML);

        player1.innerHTML = blk;
        player2.innerHTML = white;
        $('#timer-1-w').hide();
        $('#timer-1-b').show();
        $('#timer-2-w').show();
        $('#timer-2-b').hide();



    }
}

function hint() {
    $('#hint').hide();
    console.log("Hint!");
    console.log(moves[opening][i]);
    message.innerHTML = "Hint: Next move is " + moves[opening][i];

}


function onDragStart(source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (game.game_over()) return false

    // only pick up pieces for the side to move
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false
    }
}

function updateStatus() {
    var status = ''

    var moveColor = 'White'
    if (game.turn() === 'b') {
        stopTimerWhite();
        startTimerBlack();
        moveColor = 'Black'
    } else {
        startTimerWhite();
        stopTimerBlack();
    }

    // checkmate?
    if (game.in_checkmate()) {
        status = 'Game over, ' + moveColor + ' is in checkmate.'
    }

    // draw?
    else if (game.in_draw()) {
        status = 'Game over, drawn position'
    }

    // game still on
    else {
        status = moveColor + ' to move'

        // check?
        if (game.in_check()) {
            status += ', ' + moveColor + ' is in check'
        }
    }
    if (mode == 0) {
        statusId = document.getElementsByClassName("status")[0];
        statusId.innerHTML = status;
    }
    if (mode == 2) {
        statusId = document.getElementsByClassName("status")[1];
        statusId.innerHTML = status;
    } else
        console.log(status);

    //$fen.html(game.fen())
    //$pgn.html(game.pgn())
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
    console.log("snapback");
    board1.position(game.fen())
    var txtarea = document.getElementsByClassName("pgn-display")[mode];
    console.log(txtarea);
    txtarea.innerHTML = game.pgn();
    if (mode == 0) {
        if (i == moves[opening].length)
            exit();
    }
}

function onMouseoverSquare(square, piece) {
    // get list of possible moves for this square
    var moves = game.moves({
        square: square,
        verbose: true
    })

    // exit if there are no moves available for this square
    if (moves.length === 0) return

    // highlight the square they moused over
    greySquare(square)

    // highlight the possible squares for this piece
    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to)
    }
}

function onMouseoutSquare(square, piece) {
    removeGreySquares()
}

function removeGreySquares() {
    $('#practice-board .square-55d63').css('background', '')
}

function greySquare(square) {
    var $square = $('#practice-board .square-' + square);
    //$('#practice-board').find('.square-e2').addClass('highlight-white')
    console.log($square);
    var background = whiteSquareGrey;
    if ($square.hasClass('black-3c85d')) {
        background = blackSquareGrey;
    }
    console.log(background);
    $square.css("background", background);
}

function openingTimer() {
    console.log("Timer");
    var now = new Date();
    var hrs = now.getHours();
    hrs = checkTime(hrs);
    var mins = now.getMinutes();
    mins = checkTime(mins);
    var sec = now.getSeconds();
    sec = checkTime(sec);
    var time = hrs + ":" + mins + ":" + sec;
    $('#timer').html(time);
    t = setTimeout(openingTimer, 1000);
    //return time;
}

function startOpeningTimer() {
    openingTimer();
}

function stopOpeningTimer() {
    console.log("Stop Opening Timer");
    clearTimeout(t);
}

function timerWhite() {
    //console.log(timeWhite);
    timeWhite = timeWhite - 1;
    var minutes = Math.floor(timeWhite / 60);
    minutes = checkTime(minutes);
    var seconds = Math.floor(timeWhite % 60);
    seconds = checkTime(seconds);
    if (minutes !== "00" || seconds !== "00") {
        $('#timer-2-w').html(minutes + "m" + seconds + "s");
        $('#timer-1-w').html(minutes + "m" + seconds + "s");
        tWhite = setTimeout(timerWhite, 1000);
    } else {
        //$('#timer-2-w').html(00+"m"+00+"s");
        //$('#timer-1-w').html(00+"m"+00+"s");
        stopTimerWhite();
    }
}

function timerBlk() {
    //console.log(timeBlk);
    timeBlk = timeBlk - 1;
    var minutes = Math.floor(timeBlk / 60);
    minutes = checkTime(minutes);
    var seconds = Math.floor(timeBlk % 60);
    seconds = checkTime(seconds);
    if (seconds !== "00" || minutes !== "00") {
        $('#timer-1-b').html(minutes + "m" + seconds + "s");
        $('#timer-2-b').html(minutes + "m" + seconds + "s");
        tBlk = setTimeout(timerBlk, 1000);
    } else {
        // $('#timer-1-b').html(00+"m"+00+"s");
        // $('#timer-2-b').html(00+"m"+00+"s");
        stopTimerBlack();
    }
}



function checkTime(time) {
    if (time < 10) {
        time = "0" + time
    };
    // add zero in front of numbers < 10
    return time;
}

function startTimerWhite() {
    if (!timer_is_on_w) {
        timer_is_on_w = 1;
        timerWhite();
    }
}

function stopTimerWhite() {
    console.log("Stop Timer White");
    clearTimeout(tWhite);
    timer_is_on_w = 0;
}

function startTimerBlack() {
    if (!timer_is_on_b) {
        timer_is_on_b = 1;
        timerBlk();
    }
}

function stopTimerBlack() {
    console.log("Stop Timer Black");
    clearTimeout(tBlk);
    timer_is_on_b = 0;
}

function setPuzzle() {
    var config = {
        position: fens[ptr][0],
        draggable: true,
        moveSpeed: 'slow',
        snapbackSpeed: 100,
        snapSpeed: 500,
        onDragStart: onDragStart,
        onDrop: onDrop,
        onMouseoutSquare: onMouseoutSquare,
        onMouseoverSquare: onMouseoverSquare,
        onSnapEnd: onSnapEnd,
        dropOffBoard: 'snapback'
    };
    board1 = Chessboard(id, config);
    $(window).resize(board1.resize);
    console.log(board1.fen());

    if (ptr < fens.length) {
        var radiosB = document.getElementsByName('answersB');
        $('input[type="radio"]').prop('checked', false);
        $('#puzzle-num').html(ptr + 1);
        game = new Chess(fens[ptr][0]);
        console.log(game.validate_fen(fens[ptr][0]));
        console.log(game.moves());
        updateStatus();
        //ptr++;
    }

}


function checkAnswer() {
    var correctW, correctB;
    var radiosW = document.getElementsByName('answersW');

    for (var j = 0, length = radiosW.length; j < length; j++) {
        if (radiosW[j].checked) {
            answerW = radiosW[j].value;
            if (fens[ptr][1] == answerW)
                correctW = 'C';
            else
                correctW = "W";
            break;
        }
    }

    var radiosB = document.getElementsByName('answersB');

    for (var j = 0, length = radiosB.length; j < length; j++) {
        if (radiosB[j].checked) {
            //alert(radiosB[j].value);
            answerB = radiosB[j].value;
            if (fens[ptr][2] == answerB)
                correctB = 'C';
            else
                correctB = "W";

            break;
        }
    }
    answers.push([(ptr + 1) + "." + answerW + "-" + correctW, answerB + "-" + correctB + "\n"]);
    //$('#result').html(answers);

    console.log(answers);
    ptr++;
    if (ptr < fens.length)
        setPuzzle();
    else
        $('#result').html(answers);
}


function practiceOpening(fileName, name) {
    var pgn;
    opening = name;
    console.log(opening);
    console.log("Practice Opening");
    console.log(fileName);
    fetch(fileName)
        .then(response => {
            //console.log(response["status"]);
            if (response["status"] !== 200) {
                alert("File does not exists!");
                return;
            }
            response.text().then(pgn => {
                //console.log(pgn);
                var game = new Chess();
                var boolean = game.load_pgn(pgn);
                console.log(game.history());
                //opening=0;
                pgnToPosition(game.history(), opening);
                showView('practice-opening');
                $('#openings-label').hide();
                $('#openings').hide();
                loadGame();
            });
        });
}

function displayLinks() {
    $.getJSON("/openings/openings.json", function(data) {
        var table = $('#openings-table');
        var tableRow = "";
        $.each(data, function(index, value) {
            tableRow = "<tr>";
            $.each(value, function(key, val) {
                tableRow += "<td>" + val["name"] + "</td>";
                tableRow += "<td> <a target=\"_blank\" href=\"" + val["link"] + "\">Link </a> </td>";
                tableRow += "<td> <audio controls> <source src=\"" + val["audio"] + "\"> </audio> </td>";
                tableRow += "<td> <button onclick=\"practiceOpening(\'" + val["pgn"] + "\',\'" + val["name"] + "\')\">Practice</button></td>";
                tableRow += "</tr>";
            });
            console.log(tableRow);
            table.append(tableRow);
        });
    }).fail(function() {
        console.log("An error has occurred.");
    });
}