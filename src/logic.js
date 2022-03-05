function info() {
  console.log("INFO")
  const response = {
    apiversion: "1",
    author: "",
    color: "#34a853",
    head: "fang",
    tail: "freckled"
  }
  return response
}

function start(gameState) {
  console.log(`${gameState.game.id} START`)
}

function end(gameState) {
  console.log(`${gameState.game.id} END\n`)
}

const dodgeWalls = (myHead, possibleMoves, boardWidth, boardHeight) => {
  const newPossibleMoves = { ...possibleMoves }
  if (myHead.x === 0) {
    newPossibleMoves.left = false
  }
  if (myHead.y === 0) {
    newPossibleMoves.down = false
  }
  if (myHead.x === (boardWidth - 1)) {
    newPossibleMoves.right = false
  }
  if (myHead.y === (boardHeight - 1)) {
    newPossibleMoves.up = false
  }

  return newPossibleMoves
}

const goUp = myHead => ({ x: myHead.x, y: myHead.y + 1 })
const goDown = myHead => ({ x: myHead.x, y: myHead.y - 1 })
const goRight = myHead => ({ x: myHead.x + 1, y: myHead.y })
const goLeft = myHead => ({ x: myHead.x - 1, y: myHead.y })
const compareCoordinates = (positionA, positionB) => (positionA.x === positionB.x && positionA.y === positionB.y)
const distanceBetween = (positionA, positionB) => (Math.abs(positionA.x - positionB.x) + Math.abs(positionA.y - positionB.y))


const nextPositions = (myHead, possibleMoves) => {
  const safeMoves = Object.keys(possibleMoves).filter(key => possibleMoves[key])
  const nextPositionArray = []

  safeMoves.forEach(safeMove => {

    if (safeMove === 'up') {
      nextPositionArray.push({ ...goUp(myHead), movement: 'up' })
    }
    if (safeMove === 'down') {
      nextPositionArray.push({ ...goDown(myHead), movement: 'down' })
    }
    if (safeMove === 'right') {
      nextPositionArray.push({ ...goRight(myHead), movement: 'right' })
    }
    if (safeMove === 'left') {
      nextPositionArray.push({ ...goLeft(myHead), movement: 'left' })
    }
  })
  return nextPositionArray

}

function move(gameState) {

  let possibleMoves = {
    up: true,
    down: true,
    left: true,
    right: true
  }
  const resetMovement = {
    up: false,
    down: false,
    left: false,
    right: false
  }
  const boardWidth = gameState.board.width
  const boardHeight = gameState.board.height

  // Step 0: Don't let your snake move back on its own neck
  const myHead = gameState.you.head
  const myNeck = gameState.you.body[1]
  if (myNeck.x < myHead.x) {
    possibleMoves.left = false
  } else if (myNeck.x > myHead.x) {
    possibleMoves.right = false
  } else if (myNeck.y < myHead.y) {
    possibleMoves.down = false
  } else if (myNeck.y > myHead.y) {
    possibleMoves.up = false
  }

  console.log('headx: ', myHead.x)
  console.log('heady: ', myHead.y)

  // Step 1 - Don't hit walls.
  // Use information in gameState to prevent your snake from moving beyond the boundaries of the board.
  possibleMoves = dodgeWalls(myHead, possibleMoves, boardWidth, boardHeight)


  // Step 2 - Don't hit yourself.
  // Use information in gameState to prevent your snake from colliding with itself.
  // Step 3 - Don't collide with others.
  // Use information in gameState to prevent your snake from colliding with others.
  gameState.board.snakes.forEach(snake => {
    // First snake is my snake, so step 2 & 3 are treated here
    if (snake) {
      console.log('name: ', JSON.stringify(snake.name))
      snake.body.forEach(snakePart => {

        console.log('snakePart: ', JSON.stringify(snakePart))

        if (compareCoordinates(snakePart, goUp(myHead))) {
          possibleMoves.up = false
        }
        if (compareCoordinates(snakePart, goDown(myHead))) {
          possibleMoves.down = false
        }
        if (compareCoordinates(snakePart, goRight(myHead))) {
          possibleMoves.right = false
        }
        if (compareCoordinates(snakePart, goLeft(myHead))) {
          possibleMoves.left = false
        }
      })
    }
  })


  // TODO: Step 4 - Find food.
  // Use information in gameState to seek out and find food.
  const food = gameState.board.food
  const closestFood = Math.min(...food.map(foodPoint => distanceBetween(foodPoint, myHead)))
  const nextPointsToMove = nextPositions(myHead, possibleMoves)
  const minDistance = Math.min(...nextPointsToMove.map(nextPoint => distanceBetween(nextPoint, closestFood)))
  const favoritePoint = nextPointsToMove.filter(nextPoint => distanceBetween(nextPoint, closestFood) === minDistance)
  // const favoriteDirection = favoritePoint.movement;
  possibleMoves = { ...resetMovement, [favoritePoint.movement]: true }


  // Finally, choose a move from the available safe moves.
  // TODO: Step 5 - Select a move to make based on strategy, rather than random.

  console.log('possibleMoves: ', possibleMoves)

  const safeMoves = Object.keys(possibleMoves).filter(key => possibleMoves[key])
  const response = {
    move: safeMoves[Math.floor(Math.random() * safeMoves.length)],
  }

  console.log(`${gameState.game.id} MOVE ${gameState.turn}: ${response.move}`)
  return response
}

module.exports = {
  info: info,
  start: start,
  move: move,
  end: end
}
