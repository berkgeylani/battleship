export class Request {

    joinGame(shootableArray) {
        return fetch('http://localhost:9000/admiral/game', {
            method: 'PUT',
            body: shootableArray
        }).then(response => response.json())
            .then(function (response) {
                return response;
            }).catch(function (err) {
                alert("Problem while tryin to join game");
                console.log(err);
            });
    }

    makeMove(data) {
        return fetch(`http://localhost:9000/admiral/game/${data.game.gameId}/attack`, {
            method: 'POST',
            body: JSON.stringify(data.move)
        }).then(response => response.json())
            .then(function (response) {
                console.log(response);
                return response;
            }).catch(function (err) {
                alert("Problem while tryin to join game");
                console.log(err);
            });
    }

    checkStatus(data) {
        const gId = data.gameId;
        const pId = data.playerId1 || data.playerId2;
        // throw new Error("nerde geldim buraya");
        return fetch(`http://localhost:9000/admiral/game/${gId}/${pId}`, {
            method: 'GET'
        }).then(response => response.json())
            .then(function (response) {
                return response;
            }).catch(function (err) {
                alert("Problem while tryin to join game");
                console.log(err);
            });
    }


    getFinishedGame(data) {
        const gId = data.gameId;
        // throw new Error("nerde geldim buraya");
        return fetch(`http://localhost:9000/admiral/game/${gId}`, {
            method: 'GET'
        }).then(response => response.json())
            .then(function (response) {
                return response;
            }).catch(function (err) {
                alert("Problem while tryin to join game");
                console.log(err);
            });
    }

    getFinishedGameList() {
        return fetch("http://localhost:9000/admiral/game/list", {
            method: 'GET'
        }).then(response => response.json())
            .then(function (response) {
                return response;
            }).catch(function (err) {
                alert("Problem while tryin to join game");
                console.log(err);
            });
    }
}