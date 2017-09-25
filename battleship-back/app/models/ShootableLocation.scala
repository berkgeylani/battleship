package models


import org.json4s.DefaultFormats
import org.json4s.JsonAST.JObject
import org.json4s.JsonDSL._
import org.json4s.native.JsonMethods



case class ShootableLocation(x: Int, y: Int, var isHit: Boolean=false)

object ShootableLocation {
  def toJson(sLocation: ShootableLocation): JObject = {
    ("x" -> sLocation.x) ~
      ("y" -> sLocation.y) ~
      ("isHit" -> sLocation.isHit)
  }

  def toJsonString(sLocation: ShootableLocation): String = {
    JsonMethods.compact(JsonMethods.render(toJson(sLocation)))
  }

  def fromJson(jObj: JObject): ShootableLocation = {
      new ShootableLocation(
        x = (jObj \ "x").extract[Int],
        y = (jObj \ "y").extract[Int],
        isHit = (jObj \ "isHit").extractOrElse(false)
      )
  }

  implicit def fromJsonString2JObj(str:String):JObject = JsonMethods.parse(str).asInstanceOf[JObject]

  implicit val formats = DefaultFormats

}