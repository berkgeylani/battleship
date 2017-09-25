package models

import org.json4s.JsonAST.JObject
import org.json4s.JsonDSL._

class Ship(shipType: Ships.Value, locs: Seq[ShootableLocation]) extends Shootable {

  override val subShootableType: Int = shipType.id
  override val locations: Seq[ShootableLocation] = locs
  override val size: Int = getShipSize
  override var health: Int = locations.count(_.isHit==false)

  lazy val getShipSize = shipType match {
    case Ships.AircraftCarrier => 5
    case Ships.Cruiser => 4
    case Ships.Frigate => 3
    case Ships.Submarine => 3
    case Ships.Minelayer => 2
  }


  override def hit(hitLoc: ShootableLocation): HitResult= {//TODO fonk isim
    var point = 0
    locations.find(_ == hitLoc).foreach(loc => {
      if (health > 0) {
        point += 1
        health -= 1
        loc.isHit = true
        if (isSinked()) point += 1
      }
    })
    new HitResult(Shootables.Ship, subShootableType, HitTypes(point))
  }

  override def toString: String = "ShootableType:Ship | ShipType:" + shipType + locations.mkString("  |  ")

  def isSinked(): Boolean = health == 0
}

object Ship {
  def toJson(ship: Ship): JObject = {
    ("shootableType" -> 0) ~
      ("subShootableType" -> ship.subShootableType) ~
      ("locs" ->
        ship.locations.map { l =>
          ShootableLocation.toJson(l)
        })
  }
}

object Ships extends Enumeration {
  type Ships = Value
  val AircraftCarrier, Cruiser, Frigate, Submarine, Minelayer = Value
}
