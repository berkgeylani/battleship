import {ShootableBoardTemplate} from "../templates/shootableBoardTemplate";
import {Gameboard} from "../templates/joinGameBoardTemplate";
import {InitialGameTemplate} from "../templates/initialGameTemplate";
import {FinishedGameListTemplate} from "../templates/finishedGameListTemplate";
import {ShipTypes, ShootableTypes} from "./shootableTypes";
import {Actions} from "../actions/actions";

class JoinGameView {

    constructor() {
        this._eventListeners = {};
    }

    getInitialShootables() {
        return [
            {shootableType: ShootableTypes.Ship, subshootableType: ShipTypes.Minelayer},
            {shootableType: ShootableTypes.Ship, subshootableType: ShipTypes.Frigate},
            {shootableType: ShootableTypes.Ship, subshootableType: ShipTypes.Submarine},
            {shootableType: ShootableTypes.Ship, subshootableType: ShipTypes.Cruiser},
            {shootableType: ShootableTypes.Ship, subshootableType: ShipTypes.AircraftCarrier}
        ];
    }

    shootableBoard(props) {
        let relatedShootable = document.querySelector(`[data-shootable="${props.shootable}"]`);
        if (props.hasOwnProperty('isReversed'))
            relatedShootable.dataset.isreversed = props.isReversed;
        else
            relatedShootable.style.opacity = '0.4';
    }

    findCells(cellIdArray) {
        let query = cellIdArray.map(item => `[data-cellid="${item}"]`).join(', ');
        return query ? document.querySelectorAll(query) : [];
    }

    updateLeaveCell(element) {
        if (element.classList.contains('nonLegal')) element.classList.remove('nonLegal');
        if (!element.dataset.located) element.classList.remove('over');
    }

    updateGameBoard(props) {
        this.findCells(props.leavedCellIds || []).forEach(element => {
            this.updateLeaveCell(element);
        });
        this.findCells(props.enteredCellIds || []).forEach(element => {
            element.classList.add('over');
            if (element.dataset.located) element.classList.add('nonLegal');
        });
        const willLocated = this.findCells(props.locateShootable || []);
        if (props.shootable)
            this.updateLocatedCell(willLocated, props);
    }

    updateLocatedCell(willLocated, props) {
        const $shootable = document.querySelector(`[data-shootable="${props.shootable}"]`);
        let isLocationIllegal = this.checkLocateLegality(willLocated, props.locateShootable, $shootable.dataset['isreversed']);
        if (isLocationIllegal) {
            willLocated.forEach(function (element) {
                $shootable.style.opacity = 1;
                this.updateLeaveCell(element);
            }, this);
        } else {
            willLocated.forEach(function (element) {
                element.dataset["located"] = props.shootable;
                $shootable.setAttribute('draggable', false);
            });
        }
    }

    visualizeFinishedGames(props){
        const $finishedList = document.querySelector('.finishedList');
        if(props)
            $finishedList.innerHTML =new FinishedGameListTemplate().draw(props).innerHTML;
    }

    checkLocateLegality(willLocated, cellIds, isReversed) {
        let isLocationIllegal = false;
        for (let i = 0; i < willLocated.length; i++) {
            isLocationIllegal |= willLocated[i].classList.contains('nonLegal');
        }
        return isLocationIllegal || !this.checkRowOrColumnLegality(cellIds, isReversed);
    }

    //false illegal
    checkRowOrColumnLegality(willLocatedCellIds, isReversed) {
        if (isReversed==="true") {
            return !willLocatedCellIds.some(x => x > 100 || x < 0);
        } else {
            const tensDigit = willLocatedCellIds.map(x => Math.floor(x / 10));
            return tensDigit.every(x => tensDigit[0] === x)
        }
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

    render() {
        let action = new Actions();
        let gameBoardDiv = new Gameboard().draw({shootables: [], size: 10});
        let shootableBoardDiv = new ShootableBoardTemplate().draw(this.getInitialShootables());
        let $game = document.querySelector('.game');
        $game.innerHTML = new InitialGameTemplate().draw({
            gBoardTemplate: gameBoardDiv,
            sBoardTemplate: shootableBoardDiv
        }).innerHTML;
        let $gameBoard = $game.querySelector('.gameboard');
        let $shootableBoard = $game.querySelector('.shootableBoard');
        this.aEL($gameBoard, 'dragenter', ({target}) => action.shootableOverCell(target));
        this.aEL($gameBoard, 'dragleave', ({target}) => action.shootableLeaveCell(target));
        this.aEL($shootableBoard, 'dragstart', ({target}) => {
            if (target.classList.contains('shootable-item')) {
                action.shootableDragStart(target)
            }
        });
        this.aEL($shootableBoard, 'dragend', ({target}) => action.locateFinish(target));
        this.aEL($shootableBoard, 'dblclick', ({target}) => {
            let realTarget = target;
            if (realTarget.tagName === 'IMG')
                realTarget = realTarget.parentNode;
            action.reverseShootable(realTarget);
        });
        this.aEL(document.querySelector('.join-game > button'), 'click', function () {
            const elemsHasDataLocated = document.querySelectorAll("[data-located]");
            let map = new Map();
            for (let i = 0; i < elemsHasDataLocated.length; i++) {
                let elem = elemsHasDataLocated[i];
                if (elem.dataset.located in map) {
                    map[elem.dataset.located].push(elem.dataset.cellid);
                } else {
                    let array = [];
                    array.push(elem.dataset.cellid);
                    map[elem.dataset.located] = array;
                }
            }
            action.joinGame(map);
        });
        action.saveListenersInViews(this._eventListeners);
        action.getFinishedGameList();
    }

    componentWillUnmount(events) {
        for (let elem in events) {
            const listeners = events[elem];
            const query = "." + elem;
            const element = document.querySelector(query);
            listeners.forEach(listener => element.removeEventListener(listener.type, listener.handler, false));
        }
        const gameDiv = document.querySelector('.game');
        gameDiv.innerHTML = '';
    }

}

export {JoinGameView};