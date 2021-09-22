/*
  Set up Stockfish engine and get the best moves as response
  @author Divya Mittal
*/
function engineGame() {

    var engine = new Worker("stockfish.js");
    var evaler = new Worker("stockfish.js");
    var evalerUser = new Worker("stockfish.js");

    var engineStatus = {};
    var gmEvalStatus = {};
    var userEvalStatus = {};
    var displayScore = true;
    var time = {
        wtime: 300000,
        btime: 300000,
        winc: 2000,
        binc: 2000
    };
    var playerColor = 'white';
    var clockTimeoutID = null;
    var isEngineRunning = false;
    var evaluation_el = document.getElementById("gm-eval");
    var announced_game_over;


    function uciCmd(cmd, which) {
        console.log("UCI:" + which + cmd);
        (which || engine).postMessage(cmd);
    }
    uciCmd('uci');

    evalerUser.onmessage = function(event) {
        var line;
        if (event && typeof event === "object") {
            line = event.data;
        } else {
            line = event;
        }
        console.log("Evaler User: " + line)
        /// Ignore some output.
        if (line === "uciok" || line === "readyok" || line.substr(0, 11) === "option name") {
            return;
        } else {
            var match = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);
            /// Did the AI move?
            if (match) {
                userEvalStatus.search = 'From:' + match[1] + 'To:' + match[2];
                /// Is it sending feedback?
            } else if (match = line.match(/^info .*\bdepth (\d+) .*\bnps (\d+)/)) {
                userEvalStatus.search = 'Depth: ' + match[1] + ' Nps: ' + match[2];
            }

            /// Is it sending feed back with a score?
            if (match = line.match(/^info .*\bscore (\w+) (-?\d+)/)) {
                var score = parseInt(match[2]) * (game.turn() == 'w' ? 1 : -1);
                console.log(score);
                /// Is it measuring in centipawns?
                if (match[1] == 'cp') {
                    userEvalStatus.score = (score / 100.0).toFixed(2);
                    /// Did it find a mate?
                } else if (match[1] == 'mate') {
                    userEvalStatus.score = 'Mate in ' + Math.abs(score);
                }
                /// Is the score bounded?
                if (match = line.match(/\b(upper|lower)bound\b/)) {
                    userEvalStatus.score = ((match[1] == 'upper') == (game.turn() == 'w') ? '<= ' : '>= ') + userEvalStatus.score;
                }

            }

        }
        if (userEvalStatus.search) {
            var status;
            status = '<br>' + userEvalStatus.search;
            if (userEvalStatus.score) {
                status += (userEvalStatus.score.substr(0, 4) === "Mate" ? " " : ' Score: ') + userEvalStatus.score;
            }
        }
        $('#user-eval').html(status);
    };


    evaler.onmessage = function(event) {

        var line;
        if (event && typeof event === "object") {
            line = event.data;
        } else {
            line = event;
        }
        console.log("Evaler: " + line)
        /// Ignore some output.
        if (line === "uciok" || line === "readyok" || line.substr(0, 11) === "option name") {
            return;
        } else {
            var match = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);
            /// Did the AI move?
            if (match) {
                console.log(match);
                gmEvalStatus.search = 'From:' + match[1] + 'To:' + match[2];
                /// Is it sending feedback?
            } else if (match = line.match(/^info .*\bdepth (\d+) .*\bnps (\d+)/)) {
                gmEvalStatus.search = 'Depth: ' + match[1] + ' Nps: ' + match[2];
            }

            /// Is it sending feed back with a score?
            if (match = line.match(/^info .*\bscore (\w+) (-?\d+)/)) {
                var score = parseInt(match[2]) * (game.turn() == 'w' ? 1 : -1);
                console.log(score);
                /// Is it measuring in centipawns?
                if (match[1] == 'cp') {
                    gmEvalStatus.score = (score / 100.0).toFixed(2);
                    /// Did it find a mate?
                } else if (match[1] == 'mate') {
                    gmEvalStatus.score = 'Mate in ' + Math.abs(score);
                }
                /// Is the score bounded?
                if (match = line.match(/\b(upper|lower)bound\b/)) {
                    gmEvalStatus.score = ((match[1] == 'upper') == (game.turn() == 'w') ? '<= ' : '>= ') + gmEvalStatus.score;
                }

            }

        }
        if (gmEvalStatus.search) {
            var status;
            status = '<br>' + gmEvalStatus.search;
            if (gmEvalStatus.score) {
                status += (gmEvalStatus.score.substr(0, 4) === "Mate" ? " " : ' Score: ') + gmEvalStatus.score;
            }
        }
        $('#gm-eval').html(status);
    };

    function displayStatus() {
        var status = 'Engine: ';
        if (!engineStatus.engineLoaded) {
            status += 'loading...';
        } else if (!engineStatus.engineReady) {
            status += 'loaded.';
        } else {
            status += 'ready.';
        }

        if (engineStatus.search) {
            status += '<br>' + engineStatus.search;
            if (engineStatus.score && displayScore) {
                status += (engineStatus.score.substr(0, 4) === "Mate" ? " " : ' Score: ') + engineStatus.score;
            }
        }
        $('#engineStatus').html(status);


    }


    engine.onmessage = function(event) {
        var line;

        if (event && typeof event === "object") {
            line = event.data;
        } else {
            line = event;
        }
        //console.log("Reply: " + line)
        if (line == 'uciok') {
            engineStatus.engineLoaded = true;
        } else if (line == 'readyok') {
            engineStatus.engineReady = true;
        } else {
            var match = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);
            /// Did the AI move?
            if (match) {
                isEngineRunning = false;
                game.move({
                    from: match[1],
                    to: match[2],
                    promotion: match[3]
                });

                engineStatus.search = 'From:' + match[1] + 'To:' + match[2];
                //prepareMove();
                //uciCmd("eval", evaler)
                //evaluation_el.textContent = "";
                //uciCmd("eval");
                /// Is it sending feedback?
            } else if (match = line.match(/^info .*\bdepth (\d+) .*\bnps (\d+)/)) {
                //console.log(match);
                // if(match[1]==20){
                //  var move= line.match(/^info .*\bpv ([a-h][1-8])([a-//h][1-8])([qrbn])?/);
                //
                //                console.log(move);
                //            }
                engineStatus.search = 'Depth: ' + match[1] + ' Nps: ' + match[2];
            }

            /// Is it sending feed back with a score?
            if (match = line.match(/^info .*\bscore (\w+) (-?\d+)/)) {
                var score = parseInt(match[2]) * (game.turn() == 'w' ? 1 : -1);
                /// Is it measuring in centipawns?
                if (match[1] == 'cp') {
                    engineStatus.score = (score / 100.0).toFixed(2);
                    /// Did it find a mate?
                } else if (match[1] == 'mate') {
                    engineStatus.score = 'Mate in ' + Math.abs(score);
                }

                /// Is the score bounded?
                if (match = line.match(/\b(upper|lower)bound\b/)) {
                    engineStatus.score = ((match[1] == 'upper') == (game.turn() == 'w') ? '<= ' : '>= ') + engineStatus.score
                }
            }
        }
        displayStatus();
    };

    function displayStatus() {
        var status = 'Engine: ';
        if (!engineStatus.engineLoaded) {
            status += 'loading...';
        } else if (!engineStatus.engineReady) {
            status += 'loaded.';
        } else {
            status += 'ready.';
        }

        if (engineStatus.search) {
            status += '<br>' + engineStatus.search;
            if (engineStatus.score && displayScore) {
                status += (engineStatus.score.substr(0, 4) === "Mate" ? " " : ' Score: ') + engineStatus.score;
            }
        }
        $('#engineStatus').html(status);
    }


    return {
        reset: function() {
            game.reset();
            uciCmd('setoption name Contempt value 0');
            //uciCmd('setoption name Skill Level value 20');
            this.setSkillLevel(0);
            uciCmd('setoption name King Safety value 0'); /// Agressive 100 (it's now symetric)
        },
        loadPgn: function(pgn) {
            game.load_pgn(pgn);
        },
        setPlayerColor: function(color) {
            playerColor = color;
            board.orientation(playerColor);
        },
        setSkillLevel: function(skill) {
            var max_err,
                err_prob,
                difficulty_slider;

            if (skill < 0) {
                skill = 0;
            }
            if (skill > 20) {
                skill = 20;
            }

            time.level = skill;

            /// Change thinking depth allowance.
            if (skill < 5) {
                time.depth = "1";
            } else if (skill < 10) {
                time.depth = "2";
            } else if (skill < 15) {
                time.depth = "3";
            } else {
                /// Let the engine decide.
                time.depth = "";
            }

            uciCmd('setoption name Skill Level value ' + skill);

            ///NOTE: Stockfish level 20 does not make errors (intentially), so these numbers have no effect on level 20.
            /// Level 0 starts at 1
            err_prob = Math.round((skill * 6.35) + 1);
            /// Level 0 starts at 10
            max_err = Math.round((skill * -0.5) + 10);

            uciCmd('setoption name Skill Level Maximum Error value ' + max_err);
            uciCmd('setoption name Skill Level Probability value ' + err_prob);
        },
        setTime: function(baseTime, inc) {
            time = {
                wtime: baseTime * 1000,
                btime: baseTime * 1000,
                winc: inc * 1000,
                binc: inc * 1000
            };
        },
        setDepth: function(depth) {
            time = {
                depth: depth
            };
        },
        setNodes: function(nodes) {
            time = {
                nodes: nodes
            };
        },
        setContempt: function(contempt) {
            uciCmd('setoption name Contempt value ' + contempt);
        },
        setAggressiveness: function(value) {
            uciCmd('setoption name Aggressiveness value ' + value);
        },
        setDisplayScore: function(flag) {
            displayScore = flag;
            displayStatus();
        },
        start: function() {
            uciCmd('ucinewgame');
            uciCmd('isready');
            engineStatus.engineReady = false;
            engineStatus.search = null;
            uciCmd('setoption name Skill Level value 15');
            displayStatus();
            //  prepareMove();
            announced_game_over = false;
        },
        findMove: function(moves) {
            uciCmd('position startpos moves' + moves);
            uciCmd("go depth 20 seldepth 30");
        },

        evaluateMove: function(moves, gmMove) {
            console.log(gmMove);
            uciCmd('position startpos moves' + moves, evaler);
            evaluation_el.textContent = "";
            uciCmd("go depth 20 seldepth30 searchmoves" + gmMove, evaler);
            // uciCmd("info pv"+moves ,evaler);   
            //uciCmd("eval", evaler);
        },
        evaluateUserMove: function(moves, userMove) {
            console.log(userMove);
            uciCmd('position startpos moves' + moves, evalerUser);
            $('#user-eval').html("");
            //   uciCmd("go depth 20 seldepth30 searchmoves"+ //userMove,evalerUser); 
            uciCmd("info pv " + userMove, evalerUser);
            uciCmd("eval", evaler);
        },

        undo: function() {
            if (isEngineRunning)
                return false;
            game.undo();
            game.undo();
            engineStatus.search = null;
            displayStatus();
            prepareMove();
            return true;
        }
    };
}