class InitialGameTemplate {
    draw(props){
        let initialGameTemplate = document.createElement('div');
        for (let template in props){
            initialGameTemplate.appendChild(props[template]);
        }
        return initialGameTemplate;
    }
}


export {InitialGameTemplate};