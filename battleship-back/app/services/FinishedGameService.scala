package services

import javax.inject.{Inject, Singleton}

import com.google.inject.ImplementedBy
import models.repositories._
import models.{FinishedGame, Game, GameStatus, Move}

@ImplementedBy(classOf[FinishedGameService])
trait AbstractFinishedGameService {
  def getFinishedGame(gId: Long): Option[Game]

  def listFinishedGames(): Option[Seq[Game]]

  def getReplay(gId: Long): Option[FinishedGame]
}

@Singleton
class FinishedGameService @Inject()(GameRepo: GameRepository, MoveRepo: MoveRepository) extends AbstractFinishedGameService {

  override def getFinishedGame(gId: Long): Option[Game] = {
    val game = GameRepo.getFinishedGame(gId).fold(throw new IllegalAccessException("Game couldn't be " +
      "Game found/started or hasn't finished yet.")) { g => Some(g) }
    game
  }

  override def getReplay(gId: Long): Option[FinishedGame] = {
    val finishedGame = GameRepo.getFinishedGame(gId).fold(throw new IllegalAccessException("Game couldn't be " +
      "Game found/started or hasn't finished yet.")) { g =>
      val moves: Seq[Move] = MoveRepo.getMovesOrderedById(gId)
      Some(new FinishedGame(g, moves))
    }
    finishedGame
  }

  override def listFinishedGames(): Option[Seq[Game]] = {
    val gameList = GameRepo.listByStatus(GameStatus.FINISHED)
    gameList match {
      case Nil => None
      case _ => Some(gameList)
    }
  }
}
