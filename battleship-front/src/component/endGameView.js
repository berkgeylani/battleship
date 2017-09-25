import {Gameboard} from '../templates/joinGameBoardTemplate';
import {BattlefieldTemplate} from "../templates/battlefieldTemplate";

class EndGameView{
    render(props) {
        let playerBoardDiv = new Gameboard().draw({shootables: props.playerBoard, size: 10});
        let enemyBoardDiv = new Gameboard().draw({shootables: props.enemyBoard, size: 10});
        playerBoardDiv.classList.add('player');
        enemyBoardDiv.classList.add('enemy');
        const battlefieldDiv = new BattlefieldTemplate().draw({playerBoard: playerBoardDiv, enemyBoard: enemyBoardDiv});
        const $game = document.querySelector('.game');
        $game.innerHTML = battlefieldDiv.innerHTML;
    }
}

export default EndGameView;