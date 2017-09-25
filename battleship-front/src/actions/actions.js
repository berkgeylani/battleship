import Dispatcher from '../dispatcher/dispatcher';
import {ActionTypes} from './actionTypes';
import {Request} from '../requests/request';
import {numberedBoardToBoard} from '../utils/util';


export class Actions {
    shootableDragStart(target) {
        //stora gidip dragging element i git ve yaz.
        Dispatcher.dispatch({
            type: ActionTypes.DRAG_START,
            shootable: target.dataset.shootable,
            isReversed: target.dataset.isreversed
        });
    }

    shootableOverCell(target) {
        Dispatcher.dispatch({
            type: ActionTypes.SHOOTABLE_OVER_CELL,
            cellId: target.dataset["cellid"]
        });
    }

    shootableLeaveCell(target) {
        Dispatcher.dispatch({
            type: ActionTypes.SHOOTABLE_LEAVE_CELL,
            cellId: target.dataset["cellid"]
        });
    }

    locateFinish(target) {
        Dispatcher.dispatch({
            type: ActionTypes.DRAG_FINISH,
            shootable: target.dataset.shootable
        });
    }

    reverseShootable(target) {
        Dispatcher.dispatch({
            type: ActionTypes.REVERSE_SHOOTABLE,
            shootable: target.dataset.shootable
        });
        // this.view.reverseIsReversedData(target);
    }

    joinGame(map) {
        let resultArray = [];
        for (let key in map) {
            let locArray = map[key].map(function (cellId) {
                let loc = {x: Math.floor(cellId / 10), y: cellId % 10,isHit:false};
                return loc;
            });
            let result = {shootableType: Number(key.charAt(0)), subShootableType: Number(key.charAt(1)),locs:locArray};
            resultArray.push(result);
        }
        new Request().joinGame(JSON.stringify(resultArray)).then(function (game) {
            Dispatcher.dispatch({
                type: ActionTypes.JOIN_GAME,
                game: numberedBoardToBoard(game)
            });
        }).catch(err => console.log(err));
    }

    saveListenersInViews(data){
        Dispatcher.dispatch({
            type:ActionTypes.JOINVIEW_INITIALIZE,
            listeners:data
        });
    }
    getFinishedGameList(){
        const request = new Request();
        request.getFinishedGameList().then(function (response) {
            Dispatcher.dispatch({
                type:ActionTypes.INITIALIZE_GAME_LIST,
                data: response
            });
        });
    }

    //----

    endGame(game) {
        Dispatcher.dispatch({
            type: ActionTypes.END_GAME
        })
    }

    matchResult(game) {
        const request = new Request();
        request.getFinishedGame(game).then(function (response) {
            if ('playerId2' in game) {
                response.playerBoard = response.player2Board;
                response.enemyBoard = response.player1Board;
            } else {
                response.enemyBoard = response.player2Board;
                response.playerBoard = response.player1Board;
            }
            delete response.player1Board;
            delete response.player2Board;
            Dispatcher.dispatch({
                type: ActionTypes.MATCH_RESULT,
                data: response
            })
        });
    }

    initializeBattlefield(map) {
        Dispatcher.dispatch({
            type: ActionTypes.INITIALIZE_BATTLEFIELD,
            listeners: map
        })
    }

    mouseOverEnemy(target) {
        Dispatcher.dispatch({
            type: ActionTypes.MOUSE_OVER_ENEMY,
            cellId: target.dataset["cellid"]
        })
    }

    maybeAtack(target) {
        let cellId = target.dataset["cellid"];
        let loc = {x: Math.floor(cellId / 10), y: cellId % 10};
        Dispatcher.dispatch({
            type: ActionTypes.MAYBE_ATACK,
            loc: loc
        })
    }

    makeMove(data) {
        const request = new Request();
        request.checkStatus(data.game).then(function (response) {
            console.error(response);
            const game = response.game;
            game["move"] = response.moves;
            request.makeMove({game: game, move: data.move}).then(function (moveResponse) {
                Dispatcher.dispatch({
                    type: ActionTypes.ATACK,
                    data: moveResponse,
                    loc: data.move
                });
            });
        });
    }

    pollGameInfo(data) {
        new Request().checkStatus(data).then(function (response) {
            const game = response.game;
            game["move"] = response.moves;
            Dispatcher.dispatch({
                type: ActionTypes.POLL_GAME_INFO,
                data: numberedBoardToBoard(game)
            })
        });
    }

    updateGame() {
        Dispatcher.dispatch({
            type: ActionTypes.UPDATE_BATTLEFIELD_VIEW
        })
    }
}


export {Actions};