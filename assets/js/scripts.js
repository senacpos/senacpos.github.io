$(document).ready(function () {
    
    // Renderiza o Mega Menu
    let divMenu = document.getElementById('megaMenu');

    for (let i = 0; i < modulos.length; i++) {
        let modulo = modulos[i];

        let coluna = document.createElement('div');
        coluna.className = 'coluna coluna-4';

        let tituloModulo = document.createElement('h5');
        tituloModulo.innerHTML = modulo.nome;
        tituloModulo.style.color = '#16232d';
        coluna.appendChild(tituloModulo);

        let lista = document.createElement('ul');

        for (let j = 0; j < modulo.disciplinas.length; j++) {
            let disciplina = modulo.disciplinas[j];
            let item = document.createElement('li');
            let link = document.createElement('a');
            link.id = disciplina.id;
            link.href = disciplina.link;
            link.innerHTML = disciplina.nome;
            item.appendChild(link);
            lista.appendChild(item);
        }

        coluna.appendChild(lista);
        divMenu.appendChild(coluna);
    }
    
    let btnVisualizaHorarios = document.getElementById("visualizaHorarios");
    if(btnVisualizaHorarios != null) {
        btnVisualizaHorarios.addEventListener('click', function(e) {
            document.getElementById("horarios").classList.toggle("show");
        });
    }
    
    // carrega a tabela de horarios
    let tabelaHorarios = document.getElementById('tabelaHorarios');
    if(tabelaHorarios != null) {
        for(var x = 0; x < listaHorarios.length; x++) {
            let linha = tabelaHorarios.insertRow(-1);
            let colunaDia = linha.insertCell(0);
            let colunaHora = linha.insertCell(1);
            colunaDia.textContent = listaHorarios[x].dia;
            colunaHora.textContent = listaHorarios[x].horario;
        }
    }
    
    var linksDesativados = "#desenvolvimento-android, #desenvolvimento-ios, #tecnologia-bd-dispositivos-moveis, #desenvolvimento-dispositivos-moveis-idc, #desenvolvimento-aplicacoes-hibridas, #gerenciamento-de-projetos, #qualidade-de-software, #metodologia-e-tcc";

    $(linksDesativados).addClass("disabled");
    $(linksDesativados).attr("href", "#");

    var page = window.location.pathname.replace(/\//g, ' ').trim();
    $("#" + page).css("background-color", "#dddddd");
});

function openMenuMobile() {
    var x = document.getElementById("navDemo");
    if (x.className.indexOf("ms-show") == -1) {
        x.className += " ms-show";
    } else {
        x.className = x.className.replace(" ms-show", "");
    }
}

function openMegaMenu() {
    document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function (e) {
    if (!e.target.matches('.dropbtn')) {
        var myDropdown = document.getElementById("myDropdown");
        if (myDropdown.classList.contains('show')) {
            myDropdown.classList.remove('show');
        }
    }
}

// Inicializar Firebase
var config = {
    apiKey: "AIzaSyBJzsD206qIKb70UvFqcWy3PUz5MRSzVB4",
    authDomain: "fatecsenacposapp.firebaseapp.com",
    databaseURL: "https://fatecsenacposapp.firebaseio.com",
    projectId: "fatecsenacposapp",
    storageBucket: "fatecsenacposapp.appspot.com",
    messagingSenderId: "45692216041"
};
firebase.initializeApp(config);

let Professor = firebase.database().ref('Professores').child(idProfessor);
Professor.once('value', function (r) {
    let prof = r.val();
    $(".tituloDisciplina").text(prof.disciplina);
    $(".nomeProfessor").text(prof.nome);
    $(".emailProfessor").text(prof.email);
    $(".nomeProfessor, .emailProfessor").show();
});

let lista = document.getElementById('listaLinks');

let LinksRef = firebase.database().ref('Links/' + idProfessor).orderByChild('dtCriacao');
LinksRef.once('value', function (snapshot) {
    let num = 0;

    snapshot.forEach(function (childSnapshot) {
        let id = childSnapshot.key;
        let link = childSnapshot.val();
        num++;
        $("#carregando").hide();
        $("#listaLinks").addClass('borda');

        let linha = document.createElement('div');
        linha.className = 'linha' + (num%2 == 0 ? ' zebra' : '');   
      
        linha.innerHTML = "<span class='titulo_link'>" + link.descricao + "</span>";
        
        if(link.url) {
           linha.innerHTML += "<a href='" + link.url + "' class='btn-download link' target='_blank'><i class='fa fa-external-link'></i></a>";
        }

        lista.appendChild(linha);

        // Mostra anexos
        let AnexosRef = firebase.database().ref('Anexos/' + idProfessor + '/' + id);
        AnexosRef.once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                let id = childSnapshot.key;
                let anexo = childSnapshot.val();
                
                linha.innerHTML += "<a href='" + anexo.urlDownload + "' class='btn-download anexo'>" + anexo.nomeArquivo + " <i class='fa fa-download'></i></a>";
            });
        });
        
        $(".anexo").on('click', function(e) {
            e.preventDefault();
            baixarAnexo($(this).attr("href"));
        });
    });

    if (num == 0) {
        $("#listaLinks").removeClass('borda');
        $("#carregando").hide();
        $("#listaLinks").text('Nenhum conteúdo cadastrado até o momento.');
    }
    
    document.getElementById("visualizaHorarios").style.display = 'inline-block';
});

function baixarAnexo(url) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function(event) {
      var blob = xhr.response;
    };
    xhr.open('GET', url);
    xhr.send();
}
