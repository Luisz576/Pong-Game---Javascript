const canvas = document.querySelector('canvas')
// Configs
const configs = {
    color: "black",
    jogadores: {
        width: 10,
        height: 60,
        speed: 10,
    },
    jogador1: {
        keyUp: "w",
        keyDown: "s",
        position: {
            x: 10,
            y: canvas.height / 2 - 30
        }
    },
    jogador2: {
        keyUp: "ArrowUp",
        keyDown: "ArrowDown",
        position: {
            x: canvas.width - 20,
            y: canvas.height / 2 - 30
        }
    },
    ball: {
        size: 10,
        speed: 4,
        position: {
            x: canvas.width / 2 - 10,
            y: canvas.height / 2 - 10
        }
    }
}

// Classes
class Jogador extends GameComponent{
    constructor(x, y, width, height, speed, keyUp, keyDown, color){
        super()
        this.position = {x, y}
        this.width = width
        this.height = height
        this.speed = speed
        this.keyUp = keyUp
        this.keyDown = keyDown
        this.color = color
    }
    KeyDown(event, info){
        if(info.gameState == 1){
            const key = event.key
            if(key == this.keyUp){
                this.position.y -= this.speed
            }
            if(key == this.keyDown){
                this.position.y += this.speed
            }
        }
    }
    Render(_canvas, canvasContext, _info){
        GameComponent.createRect(canvasContext, this.position.x, this.position.y, this.width, this.height, this.color)
    }
}

class Ball extends GameComponent{
    constructor(x, y, size, speed, color, callbackEndGame){
        super()
        this.position = {x, y}
        this.direction = {
            x: -1,
            y: 1
        }
        this.speed = speed
        this.callbackEndGame = callbackEndGame
        this.size = size
        this.color = color
    }
    Update(canvas, info){
        if(info.gameState == 1){
            const futureBallX = this.position.x + this.speed * this.direction.x
            const futureBallY = this.position.y + this.speed * this.direction.y
            // Y CHANGES
            if(futureBallY + this.size <= 0)
                this.direction.y = 1
            if(futureBallY + this.size >= canvas.height)
                this.direction.y = -1
            // X CHANGES
            if((futureBallX + this.size < info.j1.position.x + info.j1.width &&
                futureBallY + this.size > info.j1.position.y &&
                futureBallY + this.size < info.j1.position.y + info.j1.height) ||
                (futureBallX + this.size > info.j2.position.x + info.j2.width &&
                    futureBallY + this.size > info.j2.position.y &&
                    futureBallY + this.size < info.j2.position.y + info.j2.height))
                    this.direction.x *= -1
            // MOVE
            this.position.x += this.speed * this.direction.x
            this.position.y += this.speed * this.direction.y
            if(this.position.x <= 0)
                this.callbackEndGame(2)
            if(this.position.x >= canvas.width)
                this.callbackEndGame(1)
        }
    }
    Render(_canvas, canvasContext, _info){
        GameComponent.createRect(canvasContext, this.position.x, this.position.y, this.size, this.size, this.color)
    }
}

// GAME
const game = new Game(canvas)

const j1 = new Jogador(configs.jogador1.position.x, configs.jogador1.position.y, configs.jogadores.width, configs.jogadores.height, configs.jogadores.speed, configs.jogador1.keyUp, configs.jogador1.keyDown, "s", configs.color)
const j2 = new Jogador(configs.jogador2.position.x, configs.jogador2.position.y, configs.jogadores.width, configs.jogadores.height, configs.jogadores.speed, configs.jogador2.keyUp, configs.jogador2.keyDown, configs.color)
const ball = new Ball(configs.ball.position.x, configs.ball.position.y, configs.ball.size, configs.ball.speed, configs.color, (winner) => {
    game.gameState = 2
    game.winner = winner
})

game.gameState = 1
game.winner = -1
game.setInfo({gameState: game.gameState, j1, j2})
game.addEventListener("updateFrame", (_canvas, info) => {
    info.gameState = game.gameState
    game.setInfo(info)
})
game.addEventListener('renderFrame', (canvas, canvasContext, info) => {
    if(info.gameState == 2){
        GameComponent.createText(canvasContext, "O jogador " + game.winner + " venceu!", canvas.width / 2 - 80, canvas.height / 2 - 20)
    }
})

game.runGame()