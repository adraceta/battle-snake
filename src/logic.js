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

function move(gameState) {

  let possibleMoves = {
    up: true,
    down: true,
    left: true,
    right: true
  }
  const boardWidth = gameState.board.width
  const boardHeight = gameState.board.height

  // Step 0: Don't let your Battlesnake move back on its own neck
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
  // Use information in gameState to prevent your Battlesnake from moving beyond the boundaries of the board.
  if (myHead.x == 0) {
    possibleMoves.left = false
  }
  if (myHead.y == 0) {
    possibleMoves.down = false
  }
  if (myHead.x == (boardWidth - 1)) {
    possibleMoves.right = false
  }
  if (myHead.y == (boardHeight - 1)) {
    possibleMoves.up = false
  }

  console.log('possibleMoves: ', possibleMoves)



  // Step 2 - Don't hit yourself.
  // Use information in gameState to prevent your Battlesnake from colliding with itself.
  const myBody = gameState.you.body
  myBody.forEach(myPart => {
    if (myPart.x < myHead.x) {
      possibleMoves.left = false
    } else if (myPart.x > myHead.x) {
      possibleMoves.right = false
    } else if (myPart.y < myHead.y) {
      possibleMoves.down = false
    } else if (myPart.y > myHead.y) {
      possibleMoves.up = false
    }
  })

  // Step 3 - Don't collide with others.
  // Use information in gameState to prevent your Battlesnake from colliding with others.
  gameState.board.snakes.forEach(snake => {
    snake.body.forEach(snakePart => {
      if (snakePart.x < myHead.x) {
        possibleMoves.left = false
      } else if (snakePart.x > myHead.x) {
        possibleMoves.right = false
      } else if (snakePart.y < myHead.y) {
        possibleMoves.down = false
      } else if (snakePart.y > myHead.y) {
        possibleMoves.up = false
      }
    })
  })

  // TODO: Step 4 - Find food.
  // Use information in gameState to seek out and find food.

  // Finally, choose a move from the available safe moves.
  // TODO: Step 5 - Select a move to make based on strategy, rather than random.
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
