SELECT "Game".id, "Player".*, "User".*, imagetable.path, "Avatar".* FROM "Player"
INNER JOIN "User" ON "Player.userid"="User".id
INNER JOIN "Avatar" ON ("Avatar".id = "User".avatarid)
INNER JOIN imagetable ON (imagetable.id = "Avatar".imageid)
WHERE "Player".gameid = $1;

SELECT "Game".name, "Game".description, "Player".*, "User".username , imagetable.path FROM "Game"
INNER JOIN "Player" ON "Game".id ="Player".gameid
INNER JOIN "User" ON ("Player".id = "User".id)
INNER JOIN "Avatar" ON ("User".avatarid = "Avatar".id)
INNER JOIN imagetable ON imagetable.id = "Avatar".imageid WHERE "Game".id = 2;