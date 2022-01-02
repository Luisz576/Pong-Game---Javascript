// Criado por Luisz576
// Versão 1.0
class Game{
	#canvas
	#canvasContext
	#info
	#loopId = -1
	#listeners = {
		"startGame": [],
		"stopGame": [],
		"updateFrame": [],
		"renderFrame": [],
		"keydownEvent": [],
		"clearScreen": [],
		"setInfo": []
	}
	constructor(canvas){
		this.#canvas = canvas
		this.#canvasContext = canvas.getContext('2d')
	}
	/**
	 * @param {"startGame"|"stopGame"|"updateFrame"|"renderFrame"|"keydownEvent"|"setInfo"|"clearScreen"} eventType
	 * @param {function} listener
	 */
	addEventListener(eventType, listener){
		if(this.#listeners[eventType])
			this.#listeners[eventType].push(listener)
		else
			throw "The Event " + eventType + " doesn't exist!"
	}
	/**
	 * @param {"startGame"|"stopGame"|"updateFrame"|"renderFrame"|"keydownEvent"|"setInfo"|"clearScreen"} eventType
	 * @param {function} listener
	 */
	removeEventListener(eventType, listener){
		if(this.#listeners[eventType]){
			let index = this.#listeners[eventType].indexOf(listener)
			if(index !== -1)
				this.#listeners[eventType].splice(index, 1)
		}else
			throw "The Event " + eventType + " doesn't exist!"
	}
	runGame(frames=30){
		if(this.isRunning())
			throw "This game is already running!"
		window.addEventListener("keydown", this.#KeydownHandler.bind(this))
		this.#loopId = setInterval(this.#GameLoop.bind(this), 1000/frames)
		this.#notifyListeners("startGame", this, "a", "b")
	}
	isRunning(){
		return this.#loopId != -1
	}
	stopGame(){
		if(!this.isRunning())
			throw "This game isn't running!"
		clearInterval(this.#loopId)
		this.#loopId = -1
		window.removeEventListener("keydown", this.#KeydownHandler.bind(this))
		this.#notifyListeners("stopGame", this)
	}
	setInfo(info){
		this.#info = info
		this.#notifyListeners("setInfo", this.#info)
	}
	getCanvas(){
		return this.#canvas
	}
	getCanvasContext(){
		return this.#canvasContext
	}
	#notifyListeners(eventType, ...args){
		this.#listeners[eventType].forEach(listener => {
			listener(...args)
		})
	}
	#Update(){
		GameComponent.UpdateComponents(this.#canvas, this.#info)
		this.#notifyListeners("updateFrame", this.#canvas, this.#info)
	}
	#Render(){
		GameComponent.clearScreen(this.#canvas, this.#canvasContext)
		this.#notifyListeners("clearScreen", this.#canvas, this.#canvasContext, this.#info)
		GameComponent.RenderComponents(this.#canvas, this.#canvasContext, this.#info)
		this.#notifyListeners("renderFrame", this.#canvas, this.#canvasContext, this.#info)
	}
	#GameLoop(){
		this.#Update()
        this.#Render()
	}
	#KeydownHandler(event){
		GameComponent.KeyDownComponents(event, this.#info)
		this.#notifyListeners("keydownEvent", event, this.#info)
	}
}
class GameComponent{
	static _gameComponents = []
	constructor(){
        setTimeout(() => {
            GameComponent._gameComponents.push(this)
        }, 0)
    }
	static KeyDownComponents(event, info){
        for(let gameComponentIndex in GameComponent._gameComponents)
            GameComponent._gameComponents[gameComponentIndex].KeyDown(event, info)
    }
    static UpdateComponents(canvas, info){
        for(let gameComponentIndex in GameComponent._gameComponents)
            GameComponent._gameComponents[gameComponentIndex].Update(canvas, info)
    }
    static RenderComponents(canvas, canvasContext, info){
        for(let gameComponentIndex in GameComponent._gameComponents)
            GameComponent._gameComponents[gameComponentIndex].Render(canvas, canvasContext, info)
    }
	static createRect(canvasContext, x, y, width, height, color="white"){
        canvasContext.fillStyle = color
        canvasContext.fillRect(x, y, width, height)
    }
    static createText(canvasContext, text, x, y, color="black", font="20px Arial"){
        canvasContext.font = font
        canvasContext.fillStyle = color
        canvasContext.fillText(text, x, y)
    }
    static clearScreen(canvas, canvasContext){
        canvasContext.clearRect(0, 0, canvas.width, canvas.height)
    }
	Update(canvas, info){}
    Render(canvas, canvasContext, info){}
    KeyDown(event, info){}
}