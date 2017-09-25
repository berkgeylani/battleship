import {JoinGameView} from "./component/joinGameView";
import Store from "./store/store";
// import BattlefieldStore from "./store/battlefieldStore";
import JoinGameRender from "./render/joinGameRender";
import BattlefieldRender from "./render/battlefieldRender";
import Dispatcher from "./dispatcher/dispatcher";

global.app = function () {
    Store._mount(Dispatcher);
    // BattlefieldStore._mount(Dispatcher);
    JoinGameRender.mount(Store);
    BattlefieldRender.mount(Store);
    new JoinGameView().render();
};