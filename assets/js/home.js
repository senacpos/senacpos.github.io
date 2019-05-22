window.onload = () => {

    // Renderiza o Menu
    let divMenu = document.getElementById('mainContent');

    for (let i = 0; i < modulos.length; i++) {
        let modulo = modulos[i];

        let coluna = document.createElement('div');
        coluna.className = 'col-md-4';

        let tituloModulo = document.createElement('h4');
        tituloModulo.innerHTML = modulo.nome;
        coluna.appendChild(tituloModulo);

        let lista = document.createElement('div');
        lista.className = 'list-group';

        for (let j = 0; j < modulo.disciplinas.length; j++) {
            let disciplina = modulo.disciplinas[j];
            let link = document.createElement('a');
            link.className = 'list-group-item list-group-item-action' + (!disciplina.ativo ? ' disabled' : '');
            link.id = disciplina.id;
            link.href = (disciplina.ativo ? disciplina.link : '#');
            link.innerHTML = disciplina.nome;
            lista.appendChild(link);
        }

        coluna.appendChild(lista);
        divMenu.appendChild(coluna);
        divMenu.classList.add("loaded");
    }

}
