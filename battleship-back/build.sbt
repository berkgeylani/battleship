name := """/home/francium/IdeaProjects/battleship"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.7"

libraryDependencies ++= Seq(
  jdbc,
  cache,
  ws,
  "org.scalatestplus.play" %% "scalatestplus-play" % "1.5.1" % Test,
  "com.typesafe.play" % "anorm_2.11" % "2.5.3",
  "org.json4s" % "json4s-native_2.11" % "3.5.2",
  "mysql" % "mysql-connector-java" % "5.1.34",
  filters
)




fork in run := true