package models

import org.json4s.JsonAST.JObject

trait Shootable extends PlaceOwner {
  val size: Int
  var health: Int
  val subShootableType: Int

  def hit(hitLoc: ShootableLocation): HitResult
  def hasLocation(hitLocations: ShootableLocation) : Boolean = locations.exists(_== hitLocations)

}

object Shootable {
  def apply(shootableT: Shootables.Value, subShootableType: Int, locSeq: Seq[ShootableLocation]): Shootable = {
    shootableT match {
      case Shootables.Ship => new Ship(Ships(subShootableType), locSeq)
    }
  }

  def toJson(sLocation: Shootable): JObject = {
    sLocation match {
      case ship: Ship => Ship.toJson(ship)
    }
  }


}

object Shootables extends Enumeration {
  type Shootables = Value
  val Ship,Nothing = Value
}
