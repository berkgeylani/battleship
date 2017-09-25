package models

import anorm.SqlParser._
import anorm._
import org.json4s.DefaultFormats
import org.json4s.JsonAST.JObject
import org.json4s.JsonDSL._
import org.json4s.native.JsonMethods


case class Game(gameId: Option[Long] = None,
                var player1Id: Option[String],
                var player2Id: Option[String] = None,
                var statusCode: Option[Int],
                var winnerId: Option[String] = None,
                var turn: Boolean = false,
                var player1Board: Option[Board] = None,
                var player2Board: Option[Board] = None
          ) {


  def hit(shootableLocation: ShootableLocation): Option[HitResult] = {
    if(statusCode.get != GameStatus.ONGOING.id) throw new IllegalStateException("Game is not over yet or hasn't started.")
    val playerBoard = if (turn) player1Board else player2Board
    playerBoard.map(board => {
      val result = board.hit(shootableLocation)
      if (result.hitType == HitTypes.Missed) {
        turn = !turn
      } else if (result.hitType == HitTypes.HitAndSink && board.isEveryThingSinked) {
        winnerId= if(turn) player2Id else player1Id
        statusCode = Some(GameStatus.FINISHED.id)
      }
      result
    })
  }

}

object Game {
  val generalParse = {
    get[Option[Long]]("game.gId") ~
      get[Option[String]]("game.pId1") ~
      get[Option[String]]("game.pId2") ~
      get[Option[Int]]("game.status") ~
      get[Option[String]]("game.winner") ~
      get[Boolean]("game.turn") ~
      get[Option[String]]("game.p1Board") ~
      get[Option[String]]("game.p2Board") map {
      case gId ~ pId1 ~ pId2 ~ status ~ winner ~ turn ~ p1Board ~ p2Board =>
        new Game(gId,
          pId1,
          pId2,
          status,
          winner,
          turn,
          Board.fromJson(p1Board),
          Board.fromJson(p2Board))
    }
  }


  def toJson(game: Game): JObject = {
    {
      ("gameId" -> game.gameId) ~
        ("playerId1" -> game.player1Id) ~
        ("playerId2" -> game.player2Id) ~
        ("statusCode" -> game.statusCode) ~
        ("winnerId" -> game.winnerId) ~
        ("turn" -> game.turn) ~
        ("player1Board" -> game.player1Board.map(p1Board => Board.toJson(p1Board))) ~
        ("player2Board" -> game.player2Board.map(p2Board => Board.toJson(p2Board)))
    }
  }

  def toJsonString(game: Game): String = {
    JsonMethods.compact(JsonMethods.render(toJson(game)))
  }


  implicit val formats = DefaultFormats

}

object GameStatus extends Enumeration {
  type GameStatus = Value
  val ONGOING, WAITING, FINISHED = Value
}