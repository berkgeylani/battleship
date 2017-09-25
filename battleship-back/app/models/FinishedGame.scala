package models

import org.json4s.JsonAST.JObject
import org.json4s.JsonDSL._
import org.json4s.native.JsonMethods

case class FinishedGame(game: Game, moves: Seq[Move])

object FinishedGame {
  def toJson(finishedGame: FinishedGame): JObject = {
    val movesAsJobj: Seq[JObject] = finishedGame.moves.map { move => Move.toJson(move) }
    ("game" -> Game.toJson(finishedGame.game)) ~
      ("moves" -> movesAsJobj)
  }

  def toJsonString(finishedGame: FinishedGame): String = {
    JsonMethods.compact(JsonMethods.render(toJson(finishedGame)))
  }
}