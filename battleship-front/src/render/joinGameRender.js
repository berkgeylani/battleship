import {JoinGameView} from "../component/joinGameView";
import {getLegalShootableLocations}from "../utils/util";

class JoinGameRender {
    constructor(){
        this.joinGameView = new JoinGameView();
    }

    mount(subject) {
        this.subject = subject;
        // this.subject.addListener("change", (data) => this.onChange(data));
        this.subject.addListener("shootableBoardChange", (data) => this.updateShootableBoard(data));
        this.subject.addListener("gameBoardChange", (data) => this.updateGameBoard(data));
        this.subject.addListener("locateFinish", (data) => this.locateFinish(data));
        this.subject.addListener("reverseShootable", (data) => this.reverseShootable(data));
        this.subject.addListener("joinGame", (data) => this.joinGame(data));
        this.subject.addListener("listFinishedGames", (data) => this.listFinishedGames(data));
    }

    listFinishedGames(data){
        this.joinGameView.visualizeFinishedGames(data);
    }

    joinGame(data) {
        //git view i temizle.
        this.joinGameView.componentWillUnmount(data);
    }

    reverseShootable(data) {
        this.joinGameView.shootableBoard(data);
    }

    locateFinish(data) {
        let locatedCells = data.hasOwnProperty("enteredCellId") ? getLegalShootableLocations(
            data.shootable,
            data.isReversed,
            data.enteredCellId
        ) : [];
        this.joinGameView.updateGameBoard({locateShootable: locatedCells, shootable: data.shootable});
    }

    updateGameBoard(data) {
        let leavedCells = data.hasOwnProperty("leavedCellId") ? getLegalShootableLocations(
            data.shootable,
            data.isReversed,
            data.leavedCellId
        ) : [];
        let enteredCells = data.hasOwnProperty("enteredCellId") ? getLegalShootableLocations(
            data.shootable,
            data.isReversed,
            data.enteredCellId
        ) : [];
        this.joinGameView.updateGameBoard({enteredCellIds: enteredCells, leavedCellIds: leavedCells});
    }

    updateShootableBoard(data) {
        this.joinGameView.shootableBoard(data);
    }
}

export default new JoinGameRender();