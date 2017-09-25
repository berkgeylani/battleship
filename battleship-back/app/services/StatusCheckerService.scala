package services

import javax.inject.{Inject, Singleton}

import com.google.inject.ImplementedBy
import models.{Game, Move}
import models.repositories.{GameRepository, MoveRepository}

@ImplementedBy(classOf[StatusCheckerService])
trait AbstractStatusCheckerService {
  def checkStatus(gId: Long, pId: String): (Option[Game],List[Move])
}

@Singleton
class StatusCheckerService @Inject()(GameRepo: GameRepository,MoveRepo: MoveRepository) extends AbstractStatusCheckerService {
  override def checkStatus(gId: Long, pId: String): (Option[Game],List[Move]) = {
    val move:List[Move] = MoveRepo.getMovesOrderedById(gId)
    println("moveÇıktısı"+move)
    val game: Option[Game] = GameRepo.findById(gId)
    val resultGame: Game = game.fold(throw new IllegalStateException("There is no game with that game id.")){g =>
      if (g.player1Id.get == pId) {
        g.copy(player2Board = None, player2Id = None)
      } else if (g.player2Id.isDefined && g.player2Id.get == pId) {
        g.copy(player1Board = None, player1Id = None)
      }else
        throw new IllegalArgumentException("There is no playerId with that game Id.")
    }
    (Some(resultGame),move)
  }
}