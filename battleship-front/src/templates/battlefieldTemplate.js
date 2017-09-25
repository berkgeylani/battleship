class BattlefieldTemplate{
    draw(props){
        let battlefieldDiv = document.createElement('div');
        battlefieldDiv.classList.add('battlefield');
        for (let template in props){
            battlefieldDiv.appendChild(props[template]);
        }
        return battlefieldDiv;
    }

}
export {BattlefieldTemplate}