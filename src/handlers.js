const { fileToArray, getTodayIndex } = require('./utils')
const db = require('./db')
const utils = require('./utils')

const getWordBord = async (boardName, boardSize) => {
    const boards = fileToArray(boardName)
    const dayIndex = getTodayIndex()

    // Generate the board
    const board = Array(boardSize).fill([])
    for (index in board)
        board[index] = await boards[dayIndex * boardSize + parseInt(index)].split('')
            .slice(0, boardSize + 1)

    return board
}

const getLeaderboard = async () => {
    return db.getScores()
}

const addLeaderboardScore = async (req) => {
    // TODO: Game/score validation
    let size = parseInt(req.boardSize)
    let board = await getWordBord(`boards${size}`, parseInt(size))
    let validGame = await utils.simulateGame(board, req.moves)
    let validScore = await utils.checkScore(req.score, req.moves)

    if (!validGame)
        throw new Error("Invalid Game")
    if (!validScore)
        throw new Error("Invalid Score")
    
    const score = {
        name: req.name,
        score: req.score
    }
    const obj = db.addScore(score)

    if (!obj)
        throw new Error("Error Adding to Leaderboard")
    else return score
}

module.exports = {
    getWordBord: getWordBord,
    getLeaderboard: getLeaderboard,
    addLeaderboardScore: addLeaderboardScore
}