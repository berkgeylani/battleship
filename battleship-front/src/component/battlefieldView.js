import {Gameboard} from '../templates/joinGameBoardTemplate';
import {BattlefieldTemplate} from "../templates/battlefieldTemplate";
import {Actions} from "../actions/actions";
import {createFireEmoji} from "../utils/util";

class BattlefieldView {

    constructor() {
        this._intervalUpperBound = 100000;
        this._intervalLowerBound = 1000;
        this.actualInterval = this._intervalLowerBound;
        this.actions = new Actions();
        this._eventListeners = {};
    }

    aEL(element, type, handler) {
        const item = {type: type, handler: handler};
        if (this._eventListeners[element.className]) {
            this._eventListeners[element.className].push(item);
        } else {
            let array = [];
            array.push(item);
            this._eventListeners[element.className] = array;
        }
        element.addEventListener(type, handler, false);
    }


    updateEnemyCell(data) {
        const $enemy = document.querySelector('.enemy');
        if (data.oldCell !== -1) {
            $enemy.querySelector(`.gridCell[data-cellid="${data.oldCell}"]`).classList.remove('over');
        }
        $enemy.querySelector(`.gridCell[data-cellid="${data.newCell}"]`).classList.add('over');
    }

    render(props) {
        let playerBoardDiv = new Gameboard().draw({shootables: props.pBoard, size: 10});
        let enemyBoardDiv = new Gameboard().draw({shootables: [], size: 10});
        playerBoardDiv.classList.add('player');
        enemyBoardDiv.classList.add('enemy');
        const battlefieldDiv = new BattlefieldTemplate().draw({playerBoard: playerBoardDiv, enemyBoard: enemyBoardDiv});
        const $game = document.querySelector('.game');
        $game.innerHTML = battlefieldDiv.innerHTML;
        const $enemy = document.querySelector('.enemy');
        this.aEL($enemy, 'mouseover', ({target}) => {
            if (target.classList.contains('gridCell')) this.actions.mouseOverEnemy(target);
        });
        this.aEL($enemy, 'click', ({target}) => {
            if (target.classList.contains('gridCell')) this.actions.maybeAtack(target);
        });
        this.actions.initializeBattlefield(this._eventListeners);
        return this.timeout();
    }

    timeout() {
        this.actions.updateGame();
        //TODO nasıl kapatılmalı?
        const $boards = document.querySelectorAll('.gameboard');
        let disabledTimeout = true;
        if ($boards.length >= 2) {
            for (let i = 0; i < $boards.length; i++) {
                disabledTimeout &= $boards[i].classList.contains('disabled');
            }
        }
        if (!disabledTimeout)
            setTimeout(this.timeout.bind(this), this.actualInterval);
    }

    setPollTime(data) {
        console.log("interval time:", this.actualInterval);
        if (!data.isChanged) {
            if (this.actualInterval < this._intervalUpperBound) {
                this.actualInterval *= 1.05;
            }
        } else {
            this.actualInterval = this._intervalLowerBound;
        }
    }

    addOverClassToCell(props) {
        const cellId = props.loc.x * 10 + props.loc.y;
        const $enemy = document.querySelector('.enemy');
        const $relatedCell = $enemy.querySelector(`[data-cellid="${cellId}"]`);
        if (props.hitResult !== 0) {
            $relatedCell.classList.add('withShootable');
            $relatedCell.appendChild(createFireEmoji());
        }
        $relatedCell.classList.add('hitted');
    }

    notificateUserAboutMove(props) {
        if (props.legal)
            this.actions.makeMove(props);
        else
            console.log('you shall not pass');
    }

    updateBattlefieldView(props) {
        //boşsa update etme diyecez.
        console.log("denemelerr");
        console.error(props);
        if (props.statusCode === 2) {
            const $boards = document.querySelectorAll('.gameboard');
            for (let i = 0; i < $boards.length; i++) {
                $boards[i].classList.add('disabled');
            }
            if ((props.playerId2 || props.playerId1) === props.winnerId) {
                alert("Yeah you know how to play that game.");
            } else {
                alert("Wars have no winner.");
            }
            this.actions.endGame();
        } else {
            const $player = document.querySelector('.player');
            const $enemy = document.querySelector('.enemy');
            const missedMovesOnBoard = {};
            const isPlayer1 = props.hasOwnProperty("playerId1");
            if (props.move) {//TODO need to implement better logic.
                if (isPlayer1) {
                    missedMovesOnBoard.enemyBoard = props.move.map(move => {
                        if (move.turn === true && move.result === 0)
                            return move;
                    });
                    missedMovesOnBoard.playerBoard = props.move.map(move => {
                        if (move.turn === false && move.result === 0)
                            return move;
                    });
                    console.log("1")
                } else {
                    missedMovesOnBoard.enemyBoard = props.move.map(move => {
                        if (move.turn === false && move.result === 0)
                            return move;
                    });
                    missedMovesOnBoard.playerBoard = props.move.map(move => {
                        if (move.turn === true && move.result === 0)
                            return move;
                    });
                    console.log("2")
                }
            }
            console.log("hocam bu nedir",JSON.stringify(missedMovesOnBoard));
            let playerBoardDiv = new Gameboard().draw({
                movesOnBoard: missedMovesOnBoard.playerBoard,
                shootables: props.pBoard,
                size: 10
            });
            $player.innerHTML = playerBoardDiv.innerHTML;
            if (('playerId1' in props && props.turn) || ('playerId2' in props && !props.turn)) {
                $enemy.classList.add('disabled');
            } else {
                $enemy.classList.remove('disabled');
            }
            this.actions.pollGameInfo(props);
        }
    }

    componentWillUnmount(props) {
        for (let elem in props.listeners) {
            const listeners = props.listeners[elem];
            const query = "." + elem.split(' ').join('.');
            const element = document.querySelector(query);
            listeners.forEach(listener => element.removeEventListener(listener.type, listener.handler, false));
        }
        const gameDiv = document.querySelector('.game');
        gameDiv.innerHTML = '';
        this.actions.matchResult(props.game);
    }
}

export default BattlefieldView;