class FinishedGameListTemplate {
    draw(datas) {
        const finishedGamesDiv = document.createElement('div');
        finishedGamesDiv.classList.add('finishedGames');
        for (let i = 0; i < datas.length; i++) {
            const data = datas[i];
            const finishedGameDiv = document.createElement('div');
            finishedGameDiv.classList.add('finishedGame');
            const finishedGamePlayer1Div = document.createElement('div');
            const finishedGamePlayer2Div = document.createElement('div');
            finishedGamePlayer1Div.classList.add('finishedGameInfo');
            finishedGamePlayer2Div.classList.add('finishedGameInfo');
            const p = document.createElement('p');
            p.appendChild(document.createTextNode(data.playerId1));
            finishedGamePlayer1Div.appendChild(p);
            const p2 = document.createElement('p');
            p2.appendChild(document.createTextNode(data.playerId2));
            finishedGamePlayer2Div.appendChild(p2);
            if (data.winnerId === data.playerId1) {
                finishedGamePlayer1Div.classList.add("winner");
                    finishedGamePlayer2Div.classList.add("loser");
            }
            else {

                finishedGamePlayer1Div.classList.add("loser");
                finishedGamePlayer2Div.classList.add("winner");
            }
            finishedGameDiv.appendChild(finishedGamePlayer1Div);
            finishedGameDiv.appendChild(finishedGamePlayer2Div);
            finishedGamesDiv.appendChild(finishedGameDiv);
        }
        return finishedGamesDiv;
    }
}

export {FinishedGameListTemplate};