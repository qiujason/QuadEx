# API Endpoints

## Users
* Get user - http://localhost:3001/users/?id=_____
* Get user by birthday - http://localhost:3001/users/birthday/________ (put birthday there)
* Get users by quad name - http://localhost:3001/users/?quad=_____
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
* Get quad by event - http://localhost:3001/quads/?event=_____
* Post quad - http://localhost:3001/quads (with request body)
    *  ex. {
            "name": "QuadTest",
            "dorms": [
                "Avana",
                    "Swift"
                ]
            }
* Post quad event - http://localhost:3001/quads/event/?quad_name=______&event_id=_______
* Put quad - http://localhost:3001/quads/?id=_______ (with request body)
* Delete quad - http://localhost:3001/quads/?id=_______
* Delete quad event - http://localhost:3001/quads/event/?event_id=__

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
* Upload image - http://localhost:3001/images (multipart form: key - "image" (without quotes), value - add the file)
* Delete image by filename - http://localhost:3001/images/_(filename)__

## Admin
* Get admin - http://localhost:3001/admins/?id=_____
* Get admins by quad name - http://localhost:3001/admins/?quad=_________
* Post new admin - http://localhost:3001/admins (with request body)
* Put admin - http://localhost:3001/admins/?id=____ (with request body)
* Delete admin - http://localhost:3001/admins/?id=______