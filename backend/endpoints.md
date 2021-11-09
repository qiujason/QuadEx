# API Endpoints

## Users
* Get user - http://localhost:3001/users/?id=_____
* Post new user - http://localhost:3001/users (with request body)
* Put user - http://localhost:3001/users/?id=____ (with request body)
* Delete user - http://localhost:3001/users/?id=______

## Events
* Get all events - http://localhost:3001/events/
* Get event - http://localhost:3001/events/?id=__
* Post event - http://localhost:3001/events (with request body); returns event ID
* Put event - http://localhost:3001/events/?id=___ (with request body)
* Delete event - http://localhost:3001/events/?id=____

## Favorited Events
* Get list of favorited events by user ID - http://localhost:3001/events/favoriteByUser/?id=_____
* Get list of user ID by favorited event ID - http://localhost:3001/events/listUsers/?id=_____
* Post favorited event - http://localhost:3001/events/favoriteForUser/?net_id=_____&event_id=____
* Delete favorited event - http://localhost:3001/events/favoriteForUser/?net_id=_____&event_id=_____

## Quads
* Get quad - http://localhost:3001/quads/?id=____
* Post quad - http://localhost:3001/quads (with request body)
    *  ex. {
            "name": "QuadTest",
            "dorms": [
            "Avana",
                    "Swift"
            ]
            }
* Put quad - http://localhost:3001/quads/?id=_______ (with request body)
* Delete quad - http://localhost:3001/quads/?id=_______