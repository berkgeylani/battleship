import _ from 'lodash';
export function numberedBoardToBoard(game){
    if('player1Board' in game){
        game["pBoard"] = game['player1Board'];
        delete game["player1Board"];
    } else {
        game["pBoard"] = game['player2Board'];
        delete game["player2Board"];
    }
    return game;
}

export function createFireEmoji() {
    const fireEmoji = document.createElement('i');
    fireEmoji.classList.add('em');
    fireEmoji.classList.add('em-fire');
    return fireEmoji;
}

export function getLegalShootableLocations(info, isReversed, cellId) {
    let shootableType = null;
    let subShootableType = null;
    let size = null;
    [shootableType, subShootableType, size] = info.split('');
    return _getLocations(cellId, size, isReversed === "true");
}


function _getLocations(cellId, size, isReversed) {
    const halfSize = size / 2;
    if (cellId !== undefined) {
        if (isReversed) {
            return _.range(Number(cellId) - 10 * Math.floor(halfSize), Number(cellId) + 10 * Math.ceil(Number(halfSize)), 10);
        } else {
            const addition = (halfSize % 1 === 0) ? 0 : 1;
            return _.range(Math.ceil(Number(cellId) - Number(halfSize)), Math.floor(Number(halfSize) + Number(cellId)) + addition);
        }
    }
}