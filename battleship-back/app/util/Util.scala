package util

import org.json4s.JsonAST.JValue
import org.json4s.native.JsonMethods

class Util {
  def json2JsonString(json:JValue): String ={
    return JsonMethods.compact(JsonMethods.render(json))
  }

}
