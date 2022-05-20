// constrói um ponto A=(x,y)
class Ponto{
    constructor(coordX, coordY) {
        this.coordX = coordX;
        this.coordY = coordY;
    }
}

// cria um novo ponto interpolado entre dois pontos, utilizando parâmetro t
function Interpolação(pontoA, pontoB, t){
    return new Ponto(pontoA.coordX * (1 - t) + pontoB.coordX * t, pontoA.coordY * (1 - t) + pontoB.coordY * t);
}

// algoritmo de deCasteljau. Retorna o último ponto interpolado dentre a sequência de interpolações realizadas
// entre os pontos passados como parâmetro, utilizando t como parâmetro
function deCasteljau(pontos, t){
    var grau = pontos.length -1;
    if (grau === 1){
        return Interpolação(pontos[0], pontos[1], t)
    }
    else {
        var pontosIntermed = [];
        for (let i = 0; i < grau; i++){
            pontosIntermed.push(Interpolação(pontos[i], pontos[i+1]));
        }
        return deCasteljau(pontosIntermed, t);
    }
}

// variáveis do html

var criarCurva = document.getElementById("criarCurva");
var apagarCurva = document.getElementById("apagarCurva");
var proxCurva = document.getElementById("proxCurva");
var antCurva = document.getElementById("antCurva");
var campoAvaliacoes = document.getElementById("campoAvaliacoes");
var addPonto = document.getElementById("addPonto");
var apagarPonto = document.getElementById("apagarPonto");
var proxPonto = document.getElementById("proxPonto");
var antPonto = document.getElementById("antPonto");
var exibirPontos = document.getElementById("exibirPontos");
var exibirPoligonais = document.getElementById("exibirPoligonais");
var exibirCurvas = document.getElementById("exibirCurvas");
var textoApoio = document.getElementById("textoApoio");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// variáveis auxiliares

const raioPonto = 6;
var curvas = [] // armazenar ponteiros para as curvas
var curvaSelecionada = -1;
var pontoSelecionado = -1;
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
    ctx.stroke();
}

function desenharPoligonoControle(pontos){
    for (let i = 0; i < pontos.length; i++){
        desenharLinha(pontos[i], pontos[i+1]);
    }
}

function desenharCurvaBezier(pontos) {
    if(pontos.length > 2){
        var curvasBezier = [];
        curvasBezier.push(pontos[0]);
        for (let i = 0; i < numeroAvaliacoes-2; i++){
            curvasBezier.push(deCasteljau(pontos, i/(numeroAvaliacoes)));
        }
        curvasBezier.push(pontos[pontos.length-1]);
        desenharCurvaBezier(curvasBezier);
    }
}

// deverá ser chamada sempre que fazemos algo no canvas, para que não fique "lixo" na tela
function redesenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (exibirPontos){
        for (let i = 0; i < curvas.length; i++){
            for (let j = 0; j < curvas[i].length; j++){
                desenharPonto(curvas[i][j]);
            }
        }
    }
    if (exibirPoligonais){
        for (let i = 0; i < curvas.length; i++){
            desenharPoligonoControle(curvas[i]);
        }
    }
    if (exibirCurvas && numeroAvaliacoes > 1){
        for (let i = 0; i < curvas.length; i++){
            desenharCurvaBezier(curvas[i]);
        }
    }

}

// listeners

// para os botões
criarCurva.addEventListener("click", function(event) {
    if(curvaSelecionada === -1 || curvas[curvaSelecionada]?.length > 1){
        estadoCanvas = 1;
        const novaCurva = [];
        curvas.push(novaCurva);
        pontoSelecionado.push(0);
        curvaSelecionada++;
    }

});

apagarCurva.addEventListener("click", function(event){
    if(curvas.length > 0){
        curvas.splice(curvaSelecionada, 1);
        curvaSelecionada.splice(curvaSelecionada, 1);
        if(curvaSelecionada > 0){
            curvaSelecionada--;
        }
        redesenhar();
    }
});

proxCurva.addEventListener("click", function(event){
    if(curvaSelecionada < curvas.length-1){
        curvaSelecionada++;
        redesenhar();
    }

});

antCurva.addEventListener("click", function(event){
    if(curvaSelecionada > 0){
        curvaSelecionada--;
        redesenhar();
    }


});

addPonto.addEventListener("click", function(event){
    estadoCanvas = 1;
});

apagarPonto.addEventListener("click", function(event){
    if(curvas[curvaSelecionada].length > 0){
        curvas[curvaSelecionada].splice(pontoSelecionado[curvaSelecionada], 1);
        if(curvas[curvaSelecionada].length === 0){
            curvas.splice(curvaSelecionada, 1);
            pontoSelecionado.splice(curvaSelecionada, 1);
            if(curvaSelecionada > 0){
                curvaSelecionada--;
            }
            if(curvas.length === 0){
                curvaSelecionada = -1;
            }
        }
        redesenhar();
    }

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

exibirPontos.addEventListener("click", function(event){
    exibirPontos = !exibirPontos;
    redesenhar();
});

exibirPoligonais.addEventListener("click", function(event){
    exibirPoligonais = !exibirPoligonais;
    redesenhar();
});

exibirCurvas.addEventListener("click", function(event){
    exibirCurvas = !exibirCurvas;
    redesenhar();
});



// para o canvas
canvas.addEventListener("mousedown", function(event){

});

canvas.addEventListener("mousemove", function(event){

});

canvas.addEventListener("mouseup", function(event){

});



// para o campo avaliações -> teclado
campoAvaliacoes.addEventListener("keyup", function(event){

});