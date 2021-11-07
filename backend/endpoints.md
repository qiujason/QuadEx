# API Endpoints

## Users
* Get user - localhost:3001/users/?id=_____
* Post new user - localhost:3001/users (with request body)
* Put user - localhost:3001/users/?id=____ (with request body)
* Delete user - localhost:3001/users/?id=______

## Events
* Get event - localhost:3001/events/?id=__
* Post event - localhost:3001/events (with request body); returns event ID
* Put event - localhost:3001/events/?id=___ (with request body)
* Delete event - localhost:3001/events/?id=____

## Favorited Events
* Get list of favorited events by user ID - localhost:3001/events/favoriteByUser/?id=_____
* Get list of user ID by favorited event ID - localhost:3001/events/listUsers/?id=_____
* Post favorited event - localhost:3001/events/favoriteForUser/?net_id=_____&event_id=____
* Delete favorited event - localhost:3001/events/favoriteForUser/?net_id=___&event_id=___