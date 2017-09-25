import {ActionTypes} from "../actions/actionTypes";
import Immutable from 'immutable';

class BattlefieldStore {
    constructor() {
        this._map = this.getInitialState();
        this._map = this._map.set("moves", Immutable.List());
        this._listeners = new Map();
    }

    _mount(dispatcher) {
        this._dispatcher = dispatcher;
        this._dispatcher.register(this);
    }

    getInitialState() {
        return Immutable.Map();
    }

    reduce(payload) {
        switch (payload.type) {
            case ActionTypes.UPDATE_BATTLEFIELD_VIEW:
                const game = this._map.get('game');
                this._emit("updateGameView", game);
                break;
            case ActionTypes.POLL_GAME_INFO:
                let isChanged = false;
                if (JSON.stringify(this._map.get('game')) !== JSON.stringify(payload.data)) {
                    this._map = this._map.set('game', payload.data);
                    isChanged = true;
                }
                this._emit("optimisePollInterval", {isChanged: isChanged});
                break;
            case ActionTypes.MOUSE_OVER_ENEMY:
                const oldCell = this._map.get('overEnemysCell');
                const newCell = {cellId: payload.cellId};
                this._map = this._map.set('overEnemysCell', newCell);
                this._emit('overEnemysCell', Object.assign({}, {oldCell: (oldCell) ? oldCell.cellId : -1}, {newCell: newCell.cellId}));
                break;
            case ActionTypes.MAYBE_ATACK:
                this._emit('maybeAtack', Object.assign({}, {move: payload.loc}, {game: this._map.get('game')}));
                break;
            case ActionTypes.ATACK:
                const move = {moveResult: payload.data, loc: payload.loc};
                let newMoves = (this._map.get("moves", new Immutable.List())).push(move);
                this._map = this._map.set('moves', newMoves);
                this._emit("atack", move);
                break;
            case ActionTypes.JOIN_GAME:
                this._map = this._map.set('game', payload.game);
                this._emit("initializeBattleship", payload.game);
                break;
            case ActionTypes.INITIALIZE_BATTLEFIELD:
                this._map = this._map.set('viewListener', payload.listeners);
                break;
            case ActionTypes.END_GAME:
                this._emit("endGame", {listeners: this._map.get('viewListener'), game: this._map.get('game')});
                break;
            case ActionTypes.MATCH_RESULT:
                this._map = this._map.set('game', payload.data);
                this._emit("matchResult", this._map.get('game'));
                break;
        }

    }

    addListener(label, callback) {
        this._listeners.has(label) || this._listeners.set(label, []);
        this._listeners.get(label).push(callback);
    }

    removeListener(label, callback) {
        let listeners = this._listeners.get(label);
        if (listeners !== null) {
            listeners.reduce((i, listener, index) => {
                return (typeof listener === 'function') && (listener === callback) ?
                    i = index :
                    i;
            }, -1);
            if (index > -1) {
                listeners.splice(index, 1);
                this._listeners.set(label, listeners);
                return true;
            }
        }
        return false;
    }

    _emit(label, ...args) {
        let listeners = this._listeners.get(label);
        if (listeners !== null) {
            listeners.forEach(listener => listener(...args));
            return true;
        }
        return false;
    }
}

export default new BattlefieldStore();