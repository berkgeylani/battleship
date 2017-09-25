package models.repositories

import javax.inject.{Inject, Singleton}

import anorm.SQL
import models.Move
import play.api.Logger
import play.api.db.DBApi

@Singleton
class MoveRepository @Inject()(dbApi: DBApi) extends Repository[Move] {

  private val db = dbApi.database("default")
  private val logger = Logger(this.getClass)

  override def add(item: Move): Option[Long] = {
    db.withConnection { implicit connection =>
      try {
        SQL("INSERT INTO Move (gId,turn,x,y,result) VALUES ({gId},{turn},{x},{y},{result});")
          .on(
            'gId -> item.gId,
            'turn -> item.turn,
            'result -> item.result.id,
            'x -> item.shootableLocation.x,
            'y -> item.shootableLocation.y
          ).executeInsert()
      }catch {
        case e:Exception =>
          Logger.error("\"An error was occured while inserting database.\nGame:\t" + item.toString ,e)
          None
      }
    }
  }

  override def add(items: Iterable[Move]): Unit = ???

  override def update(item: Move): Option[Long] = ???

  override def remove(item: Move): Unit = ???

  override def remove(querySeq : (String,String)*): Unit = ???

  override def query(querySeq : (String,String)*): Option[Move] = ???

  override def listQuery(querySeq : (String,String)*): List[Move] = ???

  def getMovesOrderedById(gId:Long) :List[Move] = {
    db.withConnection { implicit connection =>
      try {
        SQL("SELECT * FROM Move WHERE gId="+gId+" ORDER BY moveDate;").as(Move.generalParse *)
      }catch {
        case e:Exception =>
          Logger.error("\"An error was occured while fetching database.\nMove:\t" + gId+"\n",e)
          Nil
      }
    }
  }
}
