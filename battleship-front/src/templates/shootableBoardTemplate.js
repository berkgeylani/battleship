import {getSubshootableEnum, ShootableTypes} from "../component/shootableTypes";

export class ShootableBoardTemplate {
    /**
     * Format the contents of a shootableBoard.
     * Shootable = {shootableType,subshootableType}
     * @param {Array<Shootable>} props items that contains coordinates details,shipType,subShootabletype.
     */
    draw(props) {
        let shootableBoardDiv = document.createElement('div');
        shootableBoardDiv.classList.add('shootableBoard');
        shootableBoardDiv = props.reduce(function (a, item) {
            const detailedItem = getSubshootableEnum(item.shootableType).properties[item.subshootableType];
            let shootableItemDiv = document.createElement('div');
            shootableItemDiv.classList.add('shootable-item');
            shootableItemDiv.setAttribute('draggable', true);
            shootableItemDiv.dataset.isreversed = false;
            shootableItemDiv.dataset.shootable = `${item.shootableType}${item.subshootableType}${detailedItem.size}`;
            let img = document.createElement('img');
            img.setAttribute('draggable', false);
            img.src = `/img/shootable/${detailedItem.name.toLowerCase()}.png`;
            img.alt = detailedItem.name;
            img.title = detailedItem.name;
            shootableItemDiv.appendChild(img);
            a.appendChild(shootableItemDiv);
            return a;
        }, shootableBoardDiv);
        const joinGameDiv = document.createElement('div');
        joinGameDiv.classList.add("join-game");
        const button = document.createElement('button');
        button.classList.add('button');
        button.appendChild(document.createTextNode('WannaPlay?'));
        joinGameDiv.appendChild(button);
        shootableBoardDiv.appendChild(joinGameDiv);
        return shootableBoardDiv;
    }
}
