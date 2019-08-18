/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var gameOver = false;

var canvas = document.getElementById("canvas");
var contexto = canvas.getContext("2d");

var pontos = 0;

function desenhaPontos() {
    contexto.fillStyle = "black";
    contexto.font = "12pt Monospace";
    contexto.fillText(pontos, 5, 20);
}

//            Função fillRect - preenche o canvas;
//            Os parâmetros da função fillRect são:
//
//            o x inicial, da esquerda para a direita
//            o y inicial, do topo para baixo
//            a largura do retângulo em px
//            a altura do retângulo em px
//
//            Alterar para pegar o tamanho da janela de forma dinâmica!

function desenhaFundo() {
    //preenche o fundo com cinza escuro
    contexto.fillStyle = "dimgray";
    contexto.fillRect(0, 0, canvas.width, canvas.height);

    //calcada superior
    contexto.fillStyle = "lightgray";
    contexto.fillRect(0, 0, canvas.width, 80);

    //calcada inferior
    contexto.fillStyle = "lightgray";
    contexto.fillRect(0, 380, canvas.width, 100);

    //faixas
    contexto.fillStyle = "white";
    for (var i = 0; i < 25; i++) {
        contexto.fillRect(i * 30 - 5, 185, 20, 4);
        contexto.fillRect(i * 30 - 5, 280, 20, 4);
    }
}

function Sprite(caminhoDaImagem, xInicial, yInicial) {
    this.x = xInicial;
    this.y = yInicial;

    this.imagem = new Image();
    this.imagem.src = caminhoDaImagem;

    var that = this;
    this.imagem.onload = function () {
        if (caminhoDaImagem === "images/potatoMan.png") {
            that.largura = 49;
            that.altura = 82;
        } else {
            that.largura = that.imagem.width;
            that.altura = that.imagem.height;
        }
        that.desenhaImagem();
    };

    this.desenhaImagem = function () {
        contexto.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
//                    Código para ver a borda dos elementos e detectar a colisão
//                    contexto.strokeStyle = "darkred";
//                    contexto.lineWidth = 0.2;
//                    contexto.strokeRect(this.x, this.y, this.largura, this.altura);
    };

    this.move = function (dx, dy) {
        this.x += dx;
        this.y += dy;
        //limites
        if (this.x > canvas.width) {
            this.x = -this.largura;
        } else if (this.x < -this.largura) {
            this.x = canvas.width;
        }
        if (this.y > canvas.height - this.altura + 5) {
            this.y -= dy;
        } else if (this.y <= -5) {
            this.y = canvas.height - this.altura;
        }
    };

    this.colidiu = function (outro) {
        var colidiuNoXTopo = outro.x >= this.x && outro.x <= (this.x + this.largura);
        var colidiuNoYTopo = outro.y >= this.y && outro.y <= (this.y + this.altura);
        var colidiuNoXBase = (outro.x + outro.largura) >= this.x && (outro.x + +outro.largura) <= (this.x + this.largura);
        var colidiuNoYBase = (outro.y + outro.altura) >= this.y && (outro.y + outro.altura) <= (this.y + this.altura);
        return (colidiuNoXTopo && colidiuNoYTopo) || (colidiuNoXBase && colidiuNoYBase);
    };
}

var potatoMan = new Sprite("images/potatoMan.png", 320, 400);

potatoMan.passou = function () {
    if (this.y <= 0) {
        this.y = canvas.height - this.altura;
        return true;
    }
    return false;
};

var yellowCar = new Sprite("images/yellow-car.png", -10, 300);
var blueCar = new Sprite("images/blue-car.png", 560, 200);
var policeCar = new Sprite("images/police-car.png", 10, 100);

document.onkeydown = function (event) {
    if (gameOver) {
        return;
    }

    switch (event.which) {
        case 37: //pra esquerda
            potatoMan.move(-10, 0);
            break;
        case 38: //pra cima
            potatoMan.move(0, -10);
            break;
        case 39: //pra direita
            potatoMan.move(10, 0);
            break;
        case 40: //pra baixo
            potatoMan.move(0, 10);
            break;
    }

    if (potatoMan.passou()) {
        pontos++;
    }
};

setInterval(function () {
    desenhaFundo();
    desenhaPontos();
    potatoMan.desenhaImagem();
    yellowCar.desenhaImagem();
    blueCar.desenhaImagem();
    policeCar.desenhaImagem();

    if (gameOver) {
        contexto.fillStyle = "red";
        contexto.font = "Bold 80px Segoe UI";
//        contexto.font = "Bold 80px Sans";
        contexto.textAlign = "center";
        contexto.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 + 20);
//        contexto.fillText("GAME OVER", canvas.width / 16, canvas.height / 2 + 20);
        return;
    }

    yellowCar.move(7, 0);
    blueCar.move(-5, 0);
    policeCar.move(10, 0);

    if (yellowCar.colidiu(potatoMan)
            || blueCar.colidiu(potatoMan)
            || policeCar.colidiu(potatoMan)) {
        gameOver = true;
    }
}, 50);