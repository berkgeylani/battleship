import BattlefieldView from '../component/battlefieldView';
import EndGameView from "../component/endGameView";

class BattlefieldRender {

    constructor() {
        this.batteshipView = new BattlefieldView();
        this._pollTimeout = undefined;
    }

    mount(battleshipStore) {
        battleshipStore.addListener("initializeBattleship", (data) => this.initializeBattlefield(data));
        battleshipStore.addListener("overEnemysCell", (data) => this.setEffectOverEnemyCell(data));
        battleshipStore.addListener("maybeAtack", (data) => this.informAboutMove(data));
        battleshipStore.addListener("atack", (data) => this.setAtackEffect(data));
        battleshipStore.addListener("updateGameView", (data) => this.updateBattlefield(data));
        battleshipStore.addListener("optimisePollInterval", (data) => this.optimiseInterval(data));
        battleshipStore.addListener("endGame", (data) => this.endGame(data));
        battleshipStore.addListener("matchResult", (data) => this.initilizeMatchResult(data));
    }

    initilizeMatchResult(data){
        new EndGameView().render(data);
    }

    endGame(data){
        this.batteshipView.componentWillUnmount(data);
    }

    optimiseInterval(data){
        this.batteshipView.setPollTime(data);
    }

    updateBattlefield(data){
        if(data.statusCode===2){
            clearTimeout(this._pollTimeout);
        }
        this.batteshipView.updateBattlefieldView(Object.assign({},data));

        // this.batteshipView.updateBattlefieldView(data);
    }

    setAtackEffect(data){
        const hitresult = data.moveResult.hitResult;
        this.batteshipView.addOverClassToCell({loc:data.loc,hitResult:hitresult});
    }

    informAboutMove(data) {
        if ((!data.game.turn && 'playerId1' in data.game) ||
            (data.game.turn && 'playerId2' in data.game))
            data.legal = true;
        else
            data.legal = false;
        this.batteshipView.notificateUserAboutMove(data);
    }

    initializeBattlefield(data) {
        this._pollTimeout =this.batteshipView.render(data);
    }

    setEffectOverEnemyCell(data) {
        this.batteshipView.updateEnemyCell(data);
    }
}

export default new BattlefieldRender();