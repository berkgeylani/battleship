import {createFireEmoji} from "../utils/util";

export class Gameboard {
    /**
     * [{"shootableType":0,"subShootableType":3,"locs":[{"x":3,"y":1,"isHit":false},{"x":3,"y":2,"isHit":false},{"x":3,"y":3,"isHit":false}]}]
     * @param matrix
     * @returns {string}
     */
    draw(props) {
        const size = props.size;
        let gameBoardDiv = document.createElement('div');
        gameBoardDiv.classList.add('gameboard');
        for (let i = 0; i < size; i++) {
            let rowDiv = document.createElement('div');
            rowDiv.dataset.rowid = i;
            rowDiv.classList.add("gridRow");
            // let rowString = `<div data-rowId = ${rowId} class="gridRow">`;
            for (let j = 0; j < size; j++) {
                let cellDiv = document.createElement('div');
                cellDiv.dataset.cellid = 10 * i + j;
                cellDiv.classList.add('gridCell');
                rowDiv.appendChild(cellDiv);
            }
            gameBoardDiv.appendChild(rowDiv);
        }
        props.shootables.forEach(shootable => {
            shootable.locs.forEach(function (loc) {
                let relatedCell = gameBoardDiv.querySelector([`[data-cellid="${loc.x * 10 + loc.y}"]`]);
                let classArray = ['withShootable'];
                if (loc.isHit) {
                    relatedCell.appendChild(createFireEmoji());
                    classArray.push('hitted');
                }
                relatedCell.classList.add(...classArray);
            });
        });
        //TODO need to improvment about code.
        if (props.movesOnBoard) {
            props.movesOnBoard.forEach(function (move) {
                if (move) {
                    const $relatedCell = gameBoardDiv.querySelector([`[data-cellid="${move.x * 10 + move.y}"]`]);
                    $relatedCell.classList.add('hitted');
                }
            });
        }
        return gameBoardDiv;
    }
}
