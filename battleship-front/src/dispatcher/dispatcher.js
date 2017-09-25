class Dispatcher {
    constructor() {
        this._prefix = 'ID_';
        this._callbacks = {};
        this._lastId = 1;
    }

    register(callback) {
        const id = this._prefix + this._lastId++;
        this._callbacks[id] = callback;
        return id;
    }

    unregister(id) {
        delete this._callbacks[id];
    }

    /**
     * Dispatches a payload to all registered callback.
     * @param payload
     */
    dispatch(payload) {
        try {
            for (let id in this._callbacks) {
                this._callbacks[id].reduce(payload);
            }
        }catch(error){
            console.error(error);
        }
    }
}

export default new Dispatcher();