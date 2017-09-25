package models

import org.json4s.JsonAST._
import org.json4s.native.JsonMethods

case class ErrorResponse(message: String = "", cause: Option[String] = None)  {
  def toJson(): String = {
    val jObject = JObject("error" -> JString(message), "details" -> JString(cause.getOrElse("Undetailed error.")))
    JsonMethods.compact(JsonMethods.render(jObject))
  }
}
