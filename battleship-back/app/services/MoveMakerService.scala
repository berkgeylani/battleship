package services

import javax.inject.{Inject, Singleton}

import com.google.inject.ImplementedBy
import models._
import models.repositories.{GameRepository, MoveRepository}

@ImplementedBy(classOf[MoveMakerService])
trait AbstractMoveMakerService {
  def makeMove(gId: Long, shootableLocation: ShootableLocation): HitResult
}

@Singleton
class MoveMakerService @Inject()(GameRepo: GameRepository, MoveRepo: MoveRepository) extends AbstractMoveMakerService {

  override def makeMove(gId: Long, shootableLocation: ShootableLocation): HitResult = {
    val game = GameRepo.findById(gId)
    val moveResult = game.fold(throw new IllegalStateException("Game couldn't be found."))
    { g =>
      if(g.winnerId.isDefined) throw new UnsupportedOperationException("The game is already over.")
      val hitResult = g.hit(shootableLocation)
      hitResult.map(hResult => {
        val move = new Move(gId, g.turn, shootableLocation,hResult.hitType)
        MoveRepo.add(move)
        GameRepo.update(g)
        hResult
      })
    }
    moveResult.getOrElse(throw new IllegalStateException("Game couldn't be found."))
  }
}