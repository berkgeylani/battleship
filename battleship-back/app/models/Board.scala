package models

import org.json4s.JsonDSL._
import org.json4s.native.JsonMethods
import org.json4s.{DefaultFormats, _}
import play.Logger

import scala.util.Try


class Board(val shootables: Seq[Shootable]) {
  val board: Seq[Shootable] = shootables

  def hit(hLoc: ShootableLocation): HitResult = {
    board.find(_.hasLocation(hLoc)).fold(new HitResult(Shootables.Nothing, -1, HitTypes.Missed)) { shootable =>
      shootable.hit(hLoc)
    }
  }

  def isEveryThingSinked: Boolean = board.forall(_.health == 0)
}

object Board {
  def fromJson(jObjAsStr: Option[String]): Option[Board] = {
      jObjAsStr.map(jObjStr => {
        val json = JsonMethods.parse(jObjStr)
        val shootables: Seq[Shootable] = for {
          JArray(shootableArray) <- json
          JObject(shootable) <- shootableArray
          JField("shootableType", JInt(shootableType)) <- shootable
          JField("subShootableType", JInt(subShootableType)) <- shootable
          JField("locs", JArray(locs)) <- shootable
        } yield Shootable(Shootables(shootableType.toInt), subShootableType.toInt, for {
          JObject(loc) <- locs
        } yield ShootableLocation.fromJson(loc))
        if(shootables.size==0) throw new IllegalArgumentException("Non valid json argument.")
        new Board(shootables)
      })
  }

  def toJson(board: Board): Seq[JObject] = {
    board.board.map { shootable =>
      Shootable.toJson(shootable)
    }
  }

  def toJsonString(board: Board): String = JsonMethods.compact(JsonMethods.render(toJson(board)))

  implicit val formats = DefaultFormats

}

object HitTypes extends Enumeration {
  type HitTypes = Value
  val Missed, Hit, HitAndSink = Value
}
