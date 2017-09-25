package models.repositories

trait Repository[T] {
  def add(item: T): Option[Long]

  def add(items: Iterable[T])

  def update(item: T): Option[Long]

  def remove(item: T)

  def remove(querySeq : (String,String)*)

  def query(querySeq : (String,String)*): Option[T]

  def listQuery(querySeq : (String,String)*): List[T]
}
