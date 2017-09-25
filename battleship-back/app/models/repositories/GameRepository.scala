package models.repositories

import javax.inject.{Inject, Singleton}

import anorm._
import models.GameStatus.GameStatus
import models.{Board, Game}
import play.api.Logger
import play.api.db.DBApi
import util.DatabaseException

@Singleton
class GameRepository @Inject()(dbApi: DBApi) extends Repository[Game] {

  private val db = dbApi.database("default")
  private val logger = Logger(this.getClass)

  override def add(item: Game): Option[Long] = {
    db.withConnection { implicit connection =>
      var id: Option[Long] = try {
        SQL("INSERT INTO Game (pId1,pId2,status,winner,turn,p1Board) VALUES ({pId1},{pId2},{status},{winner},{turn},{p1Board});")
          .on(
            'pId1 -> item.player1Id,
            'pId2 -> item.player2Id,
            'status -> item.statusCode,
            'winner -> item.winnerId,
            'turn -> item.turn,
            'p1Board -> item.player1Board.map(pBoard => Board.toJsonString(pBoard))
          ).executeInsert()
      }
      catch {
        case e: Exception =>
          Logger.error("An error was occured while inserting database.\nGame:\t" + item.toString, e)
          throw new DatabaseException("Database problem while inserting.")
      }
      id
    }
  }

  override def add(items: Iterable[Game]): Unit = ???

  override def update(item: Game): Option[Long] = {
    db.withConnection { implicit connection =>
      val id: Option[Long] = try {
        val updatedItemCount = SQL("UPDATE Game SET pId1={pId1}, pId2={pId2}, status={status}, winner={winner},turn={turn},p1Board={p1Board},p2Board={p2Board} WHERE gId ={gId};")
          .on(
            'gId -> item.gameId,
            'pId1 -> item.player1Id,
            'pId2 -> item.player2Id,
            'status -> item.statusCode,
            'winner -> item.winnerId,
            'turn -> item.turn,
            'p1Board -> item.player1Board.map(pBoard => Board.toJsonString(pBoard)),
            'p2Board -> item.player2Board.map(pBoard => Board.toJsonString(pBoard))
          ).executeUpdate()
        if (updatedItemCount == 0) None else item.gameId
      }
      catch {
        case e: Exception =>
          Logger.error("An error was occured while updating database.\nGame:\t" + item.toString, e)
          throw new DatabaseException("Database problem while updating.")
      }
      if (id.isEmpty) logger.warn("Update couldn't be performed for any row.\nGame:\t" + item.toString)
      id
    }
  }

  override def remove(item: Game): Unit = ???

  override def remove(querySeq: (String, String)*): Unit = ???

  override def query(querySeq: (String, String)*): Option[Game] = {
    val query = "SELECT * FROM Game WHERE " + querySeq.map { t => t._1 + " = " + t._2 }.mkString(" ", " AND ", " ")
    db.withConnection { implicit connection =>
      try {
        SQL(query).as(Game.generalParse.singleOpt)
      } catch {
        case e: Exception =>
          Logger.error("\"An error was occured while fetching database.\nQuery:\t" + querySeq.mkString(","), e)
          throw new DatabaseException("Database problem while fetching.")
      }
    }
  }

  def findById(id: Long): Option[Game] = {
    query(("gId", id.toString))
  }

  def findWaitingGame(gameStatus: GameStatus): Option[Game] = {
    query(("status", gameStatus.id.toString))
  }

  def getFinishedGame(gId: Long): Option[Game] = {
    val query = "SELECT * FROM Game WHERE gId = " + gId + " AND " + "winner IS NOT NULL"
    db.withConnection { implicit connection =>
      try {
        SQL(query).as(Game.generalParse.singleOpt)
      } catch {
        case e: Exception =>
          Logger.error("\"An error was occured while fetching database.\nQuery:\t" + query, e)
          throw new DatabaseException("Database problem while fetching.")
      }
    }
  }

  override def listQuery(querySeq: (String, String)*): List[Game] = {
    val query = "SELECT * FROM Game WHERE " + querySeq.map { t => t._1 + " = " + t._2 }.mkString(" ", " AND ", " ")
    db.withConnection { implicit connection =>
      try {
        SQL(query).as(Game.generalParse *)
      } catch {
        case e: Exception =>
          Logger.error("\"An error was occured while fetching database.\nQuery:\t" + querySeq.mkString(","), e)
          throw new DatabaseException("Database problem while fetching.")
      }
    }
  }

  def listByStatus(gameStatus: GameStatus): Seq[Game] = {
    listQuery(("status", gameStatus.id.toString))
  }

}
