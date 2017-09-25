package controllers

import java.io.{File, PrintWriter}
import javax.inject._

import models._
import org.json4s
import org.json4s._
import org.json4s.JsonAST.{JArray, JField, JObject, JValue}
import org.json4s.JsonDSL._
import org.json4s.native.JsonMethods
import play.api.Logger
import play.api.mvc.{Action, Controller, Result}
import services.{AbstractFinishedGameService, AbstractMatchMakerService, AbstractMoveMakerService, AbstractStatusCheckerService}
import util.{DatabaseException, Util}

@Singleton
class GameController @Inject()(MatchMaker: AbstractMatchMakerService,
                               StatusChecker: AbstractStatusCheckerService,
                               MoveMaker: AbstractMoveMakerService,
                               FinishedGameOrganizer: AbstractFinishedGameService
                              ) extends Controller {

  private val logger = Logger(this.getClass)

  def joinGame = Action(parse.raw) { request =>
    try {
      val jsonAsString: Option[String] = request.body.asBytes().map(_.decodeString("UTF-8"))
      val game: Option[Game] = MatchMaker.findMatch(Board.fromJson(jsonAsString))
      val gameAsJsonStr: Option[String] = game.map(g => {
        Game.toJsonString(g)
      })
      gameAsJsonStr.fold(throw new IllegalStateException) { responseJson =>
        Ok(responseJson)
      }
    }
    catch {
      case e: IllegalArgumentException =>
        logger.error("Join game couldn't be processed.\n", e)
        BadRequest(ErrorResponse("Game couldn't be created.").toJson())
      case e: IllegalStateException =>
        logger.error("Join game couldn't be processed.\n", e)
        InternalServerError(ErrorResponse("Game couldn't be created.").toJson())
      case e: DatabaseException =>
        logger.error("Database problem occured while joining game.", e)
        InternalServerError(ErrorResponse("Game couldn't be created.").toJson())
      case e: Exception =>
        logger.error("Unexpected error", e)
        InternalServerError(ErrorResponse("Unexpected error").toJson())
    }
  }

  def checkStatus(gId: Long, pid: String) = Action { implicit request =>
    try {
      val (game, moves): (Option[Game], List[Move]) = StatusChecker.checkStatus(gId, pid)
      val gameAsJson: Option[JValue] = game.map(g => {
        Game.toJson(g)
      })
      val movesAsJson: List[json4s.JObject] = moves.map(move => {
        Move.toJson(move)
      })
      gameAsJson.fold(throw new IllegalStateException) { responseJson =>
        val jarray = new JArray(movesAsJson)
        val response = ("moves" -> jarray) ~ ("game" -> responseJson)

        //        val mergedJson = {responseJson ~ ("moves" -> jarray)}
        //        println(JsonMethods.compact(JsonMethods.render(mergedJson)))
        //        println("gameAsJsonText:\t"+responseJson)
        //        val jarray = new JArray(movesAsJson)
        //        val result = responseJson merge jarray
        //        println("resultAsJson:\t"+result)
        //        println("resultAsText:\t"+new Util().json2JsonString(result));
        //        Ok(new Util().json2JsonString(result))
        Ok(JsonMethods.compact(JsonMethods.render(response)))
        //        Ok("qwer")
      }
    }
    catch {
      case e: IllegalArgumentException =>
        logger.error("Check status couldn't be processed.\n", e)
        BadRequest(ErrorResponse("Game couldn't be checked.").toJson())
      case e: IllegalStateException =>
        logger.error("Check status couldn't be processed\n", e)
        InternalServerError(ErrorResponse("Game couldn't be checked.").toJson())
      case e: DatabaseException =>
        logger.error("Database problem occured while checking game.", e)
        InternalServerError(ErrorResponse("Game couldn't be checked.").toJson())
      case e: Exception =>
        logger.error("Unexpected error", e)
        InternalServerError(ErrorResponse("Unexpected error").toJson())
    }
  }

  def makeMove(gId: Long) = Action(parse.raw) { request =>
    try {
      val json = request.body.asBytes().map(jObj => JsonMethods.parse(jObj.decodeString("UTF-8")).asInstanceOf[JObject])
      val hitResult: Option[HitResult] = json.map(jObj => {
        MoveMaker.makeMove(gId, ShootableLocation.fromJson(jObj))
      })
      val result: Option[String] = hitResult.map(hR => hR.toJson())
      result.fold(throw new IllegalStateException) { responseJson =>
        Ok(responseJson)
      }
    }
    catch {
      case e: IllegalStateException =>
        logger.error("Game couldn't be found.\n", e)
        NotFound(ErrorResponse("Make move couldn't be processed.\n").toJson())
      case e: UnsupportedOperationException =>
        logger.error("Game is not over yet.\n", e)
        InternalServerError(ErrorResponse("Make move couldn't be processed.\n").toJson())
      case e: ClassCastException =>
        logger.error("Invalid Json Request.", e)
        BadRequest(ErrorResponse("Make move couldn't be processed.\n").toJson())
      case e: DatabaseException =>
        logger.error("Database problem occured while proccesing move.", e)
        InternalServerError(ErrorResponse("Make move couldn't be processed.").toJson())
      case e: Exception =>
        logger.error("Unexpected error", e)
        InternalServerError(ErrorResponse("Unexpected error").toJson())
    }
  }

  def getFinishedGame(gId: Long) = Action(parse.raw) { request =>
    try {
      val finishedGame: Option[Game] = FinishedGameOrganizer.getFinishedGame(gId)
      val finishedGameAsJson: Option[String] = finishedGame.map(fGame => Game.toJsonString(fGame))
      finishedGameAsJson.fold(throw new IllegalStateException) { responseJson =>
        Ok(responseJson)
      }
    }
    catch {
      case e: IllegalStateException =>
        logger.error("Getting finished game couldn't be processed.\n", e)
        InternalServerError(ErrorResponse("Get finished game couldn't be processed").toJson())
      case e: IllegalAccessException =>
        logger.error("Getting finished game couldn't be processed because game is not over yet.\n", e)
        BadRequest(ErrorResponse("Game is not over yet.").toJson())
      case e: DatabaseException =>
        logger.error("Database problem occured while fetching finished game.", e)
        InternalServerError(ErrorResponse("Fetching finished game couldn't be processed.").toJson())
      case e: Exception =>
        logger.error("Unexpected error", e)
        InternalServerError(ErrorResponse("Unexpected error").toJson())
    }
  }

  def getReplayOfGame(gId: Long) = Action { request =>
    try {
      val finishedGame: Option[FinishedGame] = FinishedGameOrganizer.getReplay(gId)
      val finishedGameAsJson = finishedGame.map(fGame => FinishedGame.toJsonString(fGame))
      finishedGameAsJson.fold(throw new IllegalStateException) { responseJson =>
        Ok(responseJson)
      }
    }
    catch {
      case e: IllegalStateException =>
        logger.error("Getting finished game as replay couldn't be processed.\n", e)
        InternalServerError(ErrorResponse("Get finished game couldn't be processed").toJson())
      case e: IllegalAccessException =>
        logger.error("Getting finished game as replay couldn't be processed because game is not over yet.\n", e)
        BadRequest(ErrorResponse("Game is not over yet.").toJson())
      case e: DatabaseException =>
        logger.error("Database problem occured while fetching finished game as replay.", e)
        InternalServerError(ErrorResponse("Fetching finished game as replay couldn't be processed.").toJson())
      case e: Exception =>
        logger.error("Unexpected error", e)
        InternalServerError(ErrorResponse("Unexpected error").toJson())
    }
  }

  def exportGame(gId: Long) = Action { request =>
    try {
      val finishedGame: Option[FinishedGame] = FinishedGameOrganizer.getReplay(gId)
      val finishedGameFile: Option[File] = finishedGame.map(fGame => {
        val json = FinishedGame.toJsonString(fGame)
        val file = new java.io.File("/tmp/battleshipGame-gameId-" + gId)
        val path: String = file.getPath
        new PrintWriter(path) {
          write(json);
          close;
        }
        file
      })
      finishedGameFile.fold(throw new IllegalStateException) { f => Ok.sendFile(f) }
    }
    catch {
      case e: IllegalAccessException =>
        logger.error("Exporting finished game couldn't be processed.\n", e)
        BadRequest(ErrorResponse(message = "Exporting finished game has been failed.").toJson())
      case e: IllegalStateException =>
        logger.error("Exporting finished game couldn't be processed.\n", e)
        InternalServerError(ErrorResponse(message = "Exporting finished game couldn't be processed.").toJson())
      case e: DatabaseException =>
        logger.error("Database problem occured while exporting game.", e)
        InternalServerError(ErrorResponse("Exporting game couldn't be processed.").toJson())
      case e: Exception =>
        logger.error("Unexpected error", e)
        InternalServerError(ErrorResponse("Unexpected error").toJson())
    }
  }

  def listFinishedGames = Action { request =>
    try {
      val listOfFinishedGame: Option[Seq[Game]] = FinishedGameOrganizer.listFinishedGames()
      val result: Option[String] = listOfFinishedGame.map(fGameList => {
        val gamesAsJson: Seq[JObject] = fGameList.map(fGame => Game.toJson(fGame))
        JsonMethods.compact(JsonMethods.render(JArray(gamesAsJson.toList)))
      })
      result.fold(throw new IllegalStateException) { listAsJSon => Ok(listAsJSon) }
    }
    catch {
      case e: IllegalAccessException =>
        logger.error("Listing finished game couldn 't be processed.\n", e)
        BadRequest(ErrorResponse(message = "Listing finished game couldn 't be processed.").toJson())
      case e: IllegalStateException =>
        logger.error("Listing finished game couldn 't be processed.\n", e)
        InternalServerError(ErrorResponse(message = "Listing finished game couldn 't be processed.").toJson())
      case e: DatabaseException =>
        logger.error("Database problem occured while fetching finished games.", e)
        InternalServerError(ErrorResponse("Fetching finished games couldn't be processed.").toJson())
      case e: Exception =>
        logger.error("Unexpected error", e)
        InternalServerError(ErrorResponse("Unexpected error").toJson())
    }
  }

}