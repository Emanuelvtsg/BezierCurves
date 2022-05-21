// constrói um ponto A=(x,y)
class Ponto{
    constructor(coordX, coordY) {
        this.coordX = coordX;
        this.coordY = coordY;
    }
}

// cria um novo ponto interpolado entre dois pontos, utilizando parâmetro t
function Interpolação(pontoA, pontoB, t){
    return new Ponto(((pontoA.coordX * (1 - t)) + (pontoB.coordX * t)), ((pontoA.coordY * (1 - t)) + (pontoB.coordY * t)));
}

// algoritmo de deCasteljau. Retorna o último ponto interpolado dentre a sequência de interpolações realizadas
// entre os pontos passados como parâmetro, utilizando t como parâmetro
function deCasteljau(pontos, t){
    var grau = pontos.length -1;
    if (grau === 1){
        return Interpolação(pontos[0], pontos[1], t);
    }
    else {
        var pontosIntermed = [];
        for (let i = 0; i < grau; i++){
            pontosIntermed.push(Interpolação(pontos[i], pontos[i+1], t));
        }
        return deCasteljau(pontosIntermed, t);
    }
}

// variáveis do html

var criarCurva = document.getElementById("criarCurva");
var apagarCurva = document.getElementById("apagarCurva");
var proxCurva = document.getElementById("proxCurva");
var antCurva = document.getElementById("antCurva");
var limparTela = document.getElementById("limparTela");
var campoAvaliacoes = document.getElementById("campoAvaliacoes");
var addPonto = document.getElementById("addPonto");
var apagarPonto = document.getElementById("apagarPonto");
var reposPonto = document.getElementById("reposPonto");
var proxPonto = document.getElementById("proxPonto");
var antPonto = document.getElementById("antPonto");
var exibirPontosCheckbox = document.getElementById("exibirPontos");
var exibirPoligonaisCheckbox = document.getElementById("exibirPoligonais");
var exibirCurvasCheckbox = document.getElementById("exibirCurvas");
var textoApoio = document.getElementById("textoApoio");
textoApoio.innerText = "Inicie uma ação pressionando em algum dos botões acima!"
var canvas = document.getElementById("canvas");


// canvas
var ctx = canvas.getContext("2d");

// variáveis auxiliares

const raioPonto = 6;
var curvas = []; // array de curvas, onde cada curva é um array de pontos
var curvaSelecionada = -1; // ponteiro para a curva selecionada
var pontoSelecionado = []; // array de ponteiro para as curvas, a posição 0 indica o ponto selecionado para a curva 0, etc
var numeroAvaliacoes = 100;
var estadoCanvas = 0; // 1 - está acrescentando, 2 - está reposicionando
var clique = false;
var exibirPontos = true;
var exibirPoligonais = true;
var exibirCurvas = true;

// funções de desenhar

function desenharPonto(ponto){
    ctx.beginPath();
    ctx.arc(ponto.coordX, ponto.coordY, raioPonto, 0, 2 * Math.PI);
    ctx.stroke();
}

function desenharLinha(pontoA, pontoB){
    ctx.beginPath();
    ctx.lineTo(pontoA.coordX, pontoA.coordY);
    ctx.lineTo(pontoB.coordX, pontoB.coordY);
    ctx.strokeStyle = "8px"
    ctx.stroke();
}

function desenharPoligonoControle(pontos){
    for (let i = 0; i < pontos.length - 1; i++){
        desenharLinha(pontos[i], pontos[i+1]);
    }
}

// para desenhar a curva de bezier, adiciona o primeiro e o ultimo pontos de controle ao array, e pega os outros 
// através do deCasteljau, utilizando o numero de avaliaçoes para calcular quantos serão (são (nAval - 2) pontos interpolados)
// depois, chama a funçao de desenhar poligono para ligar cada um desses pontos, o que vai ficar parecido com uma curva
function desenharCurvaBezier(pontos) {
    if(pontos.length > 2){
        var curvasBezier = [];
        curvasBezier.push(pontos[0]);
        for (let i = 1; i <= numeroAvaliacoes-2; i++){
            curvasBezier.push(deCasteljau(pontos, i/(numeroAvaliacoes - 1)));
        }
        curvasBezier.push(pontos[pontos.length-1]);
        desenharPoligonoControle(curvasBezier);
    }
}

// deverá ser chamada sempre que fazemos algo no canvas, para que não fique "lixo" na tela
function redesenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (exibirPontos){
        for (let i = 0; i < curvas.length; i++){
            for (let j = 0; j < curvas[i].length; j++){
                if ((j == pontoSelecionado[curvaSelecionada]) && (i == curvaSelecionada)){
                    ctx.strokeStyle = "red";
                }
                else {
                    ctx.strokeStyle = "black";
                }
                
                desenharPonto(curvas[i][j]);

            }
        }
    }
    if (exibirPoligonais){
        for (let i = 0; i < curvas.length; i++){
            if (i == curvaSelecionada){
                ctx.strokeStyle = "#05386B";
            }
            else {
                ctx.strokeStyle = "black";
            }
            desenharPoligonoControle(curvas[i]);
        }
    }
    if (exibirCurvas && numeroAvaliacoes > 1){
        for (let i = 0; i < curvas.length; i++){
            if (i == curvaSelecionada) {
                ctx.strokeStyle = "#05386B";
            }
            else {
                ctx.strokeStyle = "black";
            }
            desenharCurvaBezier(curvas[i]);
            
            
        }
    }

}

// listeners

// para os botões
criarCurva.addEventListener("click", function(event) {
    if(curvaSelecionada === -1 || curvas[curvaSelecionada]?.length > 1){
        estadoCanvas = 1;
        var novaCurva = [];
        curvas.push(novaCurva);
        pontoSelecionado.push(0);
        curvaSelecionada = curvas.length - 1;
        textoApoio.innerText = "Clique na tela para adicionar os pontos para a sua curva.";
        redesenhar();
    }
    else {
        textoApoio.innerText = "Finalize a curva atual antes de adicionar uma nova.";
    }

});

apagarCurva.addEventListener("click", function(event){
    if(curvas.length > 0){
        curvas.splice(curvaSelecionada, 1);
        pontoSelecionado.splice(curvaSelecionada, 1);
        if(curvaSelecionada > 0){
            curvaSelecionada--;
        }
        else if(curvaSelecionada == 0){
            curvaSelecionada = -1;
            estadoCanvas = 0;
            textoApoio.innerText = "Inicie uma ação pressionando em algum dos botões acima!"
        }
    }
    else {
        return;
    }
    redesenhar();
});

proxCurva.addEventListener("click", function(event){
    if (curvas[curvaSelecionada].length == 0){
        textoApoio.innerText = "Primeiro faça alguma ação na curva atual para poder trocar de curva."
    }
    else if(curvaSelecionada < curvas.length-1){
        curvaSelecionada++;
        redesenhar();
    }
    

});

antCurva.addEventListener("click", function(event){
    if (curvas[curvaSelecionada].length == 0){
        textoApoio.innerText = "Primeiro faça alguma ação na curva atual para poder trocar de curva."
    }
    else if(curvaSelecionada > 0){
        curvaSelecionada--;
        redesenhar();
    }


});

limparTela.addEventListener("click", function(event){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pontoSelecionado = [];
    curvas = [];
    curvaSelecionada = -1;
    estadoCanvas = 0;
    textoApoio.innerText = "Inicie uma ação pressionando em algum dos botões acima!"
});

addPonto.addEventListener("click", function(event){
    estadoCanvas = 1;
    textoApoio.innerText = "Clique na tela para adicionar os pontos para a sua curva.";

});

apagarPonto.addEventListener("click", function(event){
    if(curvas[curvaSelecionada].length > 0){
        curvas[curvaSelecionada].splice(pontoSelecionado[curvaSelecionada], 1);
        pontoSelecionado.splice(curvaSelecionada, 1, 0)
        if(curvas[curvaSelecionada].length === 0){ // se apagamos o ultimo elemento
            curvas.splice(curvaSelecionada, 1);
            if(curvaSelecionada > 0){
                curvaSelecionada--;
            }
            if(curvas.length === 0){
                curvaSelecionada = -1;
                textoApoio.innerText = "Inicie uma ação pressionando em algum dos botões acima!"
            }
        }
        redesenhar();
    }

});

reposPonto.addEventListener("click", function(event){
    estadoCanvas = 2;
    textoApoio.innerText = "Clique na tela para reposicionar o ponto selecionado.";

});

proxPonto.addEventListener("click", function(event){
    if(pontoSelecionado[curvaSelecionada] < curvas[curvaSelecionada].length-1){
        pontoSelecionado[curvaSelecionada]++;
        redesenhar();
    }
});

antPonto.addEventListener("click", function(event){
    if(pontoSelecionado[curvaSelecionada] > 0){
        pontoSelecionado[curvaSelecionada]--;
        redesenhar();
    }

});

exibirPontosCheckbox.addEventListener("click", function(event){
    exibirPontos = !exibirPontos;
    redesenhar();
});

exibirPoligonaisCheckbox.addEventListener("click", function(event){
    exibirPoligonais = !exibirPoligonais;
    redesenhar();
});

exibirCurvasCheckbox.addEventListener("click", function(event){
    exibirCurvas = !exibirCurvas;
    redesenhar();
});



// para o canvas
canvas.addEventListener("mousedown", function(event){
    clique = true;
    var pontoA = new Ponto(event.offsetX, event.offsetY);
    if (estadoCanvas == 1){
        textoApoio.innerText = "Clique na tela para adicionar os pontos para a sua curva."
        curvas[curvaSelecionada].push(pontoA);
    }
    else if (estadoCanvas == 2){
        curvas[curvaSelecionada].splice(pontoSelecionado[curvaSelecionada], 1, pontoA);
    }
    redesenhar();
});

canvas.addEventListener("mousemove", function(event){
    if (clique) {
        if (estadoCanvas == 2) {
            var pontoA = new Ponto(event.offsetX, event.offsetY);
            curvas[curvaSelecionada]?.splice(pontoSelecionado[curvaSelecionada], 1, pontoA);
        }
            redesenhar();
        }
});

canvas.addEventListener("mouseup", function(event){
    clique = false;
    redesenhar();
});



// para o campo avaliações -> teclado
campoAvaliacoes.addEventListener("keyup", function(event){
    var entrada = event.target.value;
    numeroAvaliacoes = parseInt(entrada);
    redesenhar();
});