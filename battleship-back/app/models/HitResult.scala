package models

import models.HitTypes.HitTypes
import models.Shootables.Shootables
import org.json4s.JsonAST._
import org.json4s.native.JsonMethods

case class HitResult(shootable:Shootables, subShootable:Int, hitType:HitTypes){
  def toJson():String = {
    JsonMethods.compact(JsonMethods.render(JObject(
      "shootableType" -> JString(shootable.toString),
      "subShootableType" -> JInt(subShootable),
      "hitResult" -> JInt(hitType.id)
    )))
  }
}
