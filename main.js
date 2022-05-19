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
    if (grau == 1){
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

}

function desenharLinha(pontoA, pontoB){

}

function desenharPoligonoControle(pontos){

}

function desenharCurvaBezier(curva) {

}

// deverá ser chamada sempre que fazemos algo no canvas, para que não fique "lixo" na tela
function redesenhar() {

}

// listeners

        // para os botões
criarCurva.addEventListener("click", function(event) {

});

apagarCurva.addEventListener("click", function(event){

});

proxCurva.addEventListener("click", function(event){

});

antCurva.addEventListener("click", function(event){

});

addPonto.addEventListener("click", function(event){

});

apagarPonto.addEventListener("click", function(event){

});

proxPonto.addEventListener("click", function(event){

});

antPonto.addEventListener("click", function(event){

});

exibirPontos.addEventListener("click", function(event){

});

exibirPoligonais.addEventListener("click", function(event){

});

exibirCurvas.addEventListener("click", function(event){

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