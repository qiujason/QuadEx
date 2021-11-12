# API Endpoints

## Users
* Get user - http://localhost:3001/users/?id=_____
* Post new user - http://localhost:3001/users (with request body)
* Put user - http://localhost:3001/users/?id=____ (with request body)
* Delete user - http://localhost:3001/users/?id=______

## Events
* Get all events - http://localhost:3001/events/
* Get event by id - http://localhost:3001/events/?id=__
* Get event by quad - http://localhost:3001/events/?quad=________ (use %20 as space like ?quad=blue%20jay)
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

## Points
* Get points by user id - http://localhost:3001/points/user/?id=_____
* Get sum points by user id - http://localhost:3001/points/user/sum/?id=_____
* Get points by quad name - http://localhost:3001/points/quad/?id=________
* Get sum points by quad name - http://localhost:3001/points/quad/sum/?id=___
* Post new points - http://localhost:3001/points (with request body); returns points ID
    * ex. {
	"net_id": "jq39",
	"date": "110821",
	"point_value": "-10",
	"reason": "being too cool" 
    }
* Put points - http://localhost:3001/points/?id=_______ (with request body)
* Delete points - http://localhost:3001/points/?id=______ (id is point id in table)

## Images
* Get image by filename - http://localhost:3001/images/_(filename)__
* Upload image - http://localhost:3001/images (multipart form)
* Delete image by filename - http://localhost:3001/images/_(filename)__

## Admin
* Get admin - http://localhost:3001/admins/?id=_____
* Post new admin - http://localhost:3001/admins (with request body)
* Put admin - http://localhost:3001/admins/?id=____ (with request body)
* Delete admin - http://localhost:3001/admins/?id=______