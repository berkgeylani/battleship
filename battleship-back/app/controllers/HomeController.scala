package controllers

import javax.inject._

import akka.util.ByteString
import models.GameStatus
import org.json4s.native.JsonMethods
import play.api._
import play.api.mvc._

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject() extends Controller {

  /**
   * Create an Action to render an HTML page with a welcome message.
   * The configuration in the `routes` file means that this method
   * will be called when the application receives a `GET` request with
   * a path of `/`.
   */
  def index = Action(parse.raw) { implicit request =>
    val body: String = request.body.asBytes().get.decodeString("UTF-8")
    JsonMethods.parse(body)
    Ok(views.html.index("Got request [" + request.body+GameStatus.WAITING.toString+ "]") )
  }

}
