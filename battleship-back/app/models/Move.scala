package models

import anorm.SqlParser.get
import anorm.~
import models.HitTypes.HitTypes
import org.json4s.JsonDSL._
import org.json4s._
import org.json4s.native.JsonMethods

case class Move(gId: Long, turn: Boolean, shootableLocation: ShootableLocation, var result: HitTypes = HitTypes.Missed)

object Move {
  def fromJson(gId: Int, jObjAsStr: Option[String]): Option[Move] = {
    jObjAsStr.map(jObjStr => {
      val json = JsonMethods.parse(jObjStr)
      val turn = (json \ "turn").extract[Boolean]
      val result: Int = (json \ "result").extractOrElse(0)
      val x = (json \ "x").extract[Int]
      val y = (json \ "y").extract[Int]
      val isHit = (json \ "isHit").extract[Boolean]
      new Move(gId, turn, new ShootableLocation(x, y, isHit), HitTypes(result))
    })
  }

  implicit val formats = DefaultFormats

  def toJson(move: Move): JObject = {
    ("turn" -> move.turn) ~ ("result" -> move.result.id) ~ ShootableLocation.toJson(move.shootableLocation)
  }

  def toJsonString(move: Move): String = JsonMethods.compact(JsonMethods.render(toJson(move)))

  val generalParse = {
    get[Long]("move.gId") ~
      get[Boolean]("move.turn") ~
      get[Int]("move.x") ~
      get[Int]("move.y") ~
      get[Int]("move.result") map {
      case gId ~ turn ~ x ~ y ~ result =>
        new Move(
          gId, turn, new ShootableLocation(x, y,result>0), HitTypes(result)
        )
    }
  }

}