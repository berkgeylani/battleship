package services

import javax.inject.{Inject, Singleton}

import com.google.inject.ImplementedBy
import models.repositories._
import models.{Board, Game, GameStatus}

@ImplementedBy(classOf[MatchMakerService])
trait AbstractMatchMakerService {
  def findMatch(board: Option[Board]): Option[Game]
}

@Singleton
class MatchMakerService @Inject()(GameRepo: GameRepository) extends AbstractMatchMakerService {

  override def findMatch(board: Option[Board]): Option[Game] = {
    val waitingGame: Option[Game] = GameRepo.findWaitingGame(GameStatus.WAITING)
    val game: Game = waitingGame.fold {
      createGame(board)
    } { x =>
      joinExistingGame(board, x)
    }
    println(game.toString);
    Some(game)
  }

  private def createGame(board: Option[Board]) = {
    val newGame: Game = new Game(player1Id = uuid, statusCode = Some(1), turn = false, player1Board = board)
    val gId = GameRepo.add(newGame)
    val resultGame = gId.map(gameId => new Game(gameId = gId, player1Id = newGame.player1Id, statusCode = Some(1), turn = false, player1Board = board))
    resultGame
      .getOrElse(throw new IllegalStateException("Game's id couldn't be found after insert process." +
        "Maybe insert process have some problem"))
  }

  private def joinExistingGame(board: Option[Board], x: Game) = {
    val game = x.copy(player2Id = uuid, statusCode = Some(0), player2Board = board)
    val gId: Option[Long] = GameRepo.update(game)
    gId.getOrElse(throw new IllegalArgumentException("Game's id couldn't be found after update process." +
      "Maybe update process have some problem"))
    game.copy(player1Id = None, player1Board = None)
  }

  def uuid = Some(java.util.UUID.randomUUID.toString)
}
