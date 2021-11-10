const db = require('../db')
const path = require('path')

const getImage = (req, res) => {
    const { filename } = req.params
    db.query('SELECT * FROM images WHERE filename = $1', [filename], (error, results) => {
        if (error) {
            res.status(500).send("Error executing image query: " + error)
        } else {
            if (results.rows[0]) {
                const dirname = path.resolve()
                const fullfilepath = path.join(dirname, results.rows[0].filepath)
                res
                    .type(results.rows[0].mimetype)
                    .sendFile(fullfilepath)
            } else {
                return res.status(500).send(`Image ${filename} does not exist`)
            }
        }
    })
}

const postImage = (req, res) => {
    const { filename } = req.params

    console.log("upload image")
    console.log(req.file)
    
    const {
        path,
        mimetype,
        size
    } = req.file

    db.query('INSERT INTO images (filename, filepath, mimetype, size) VALUES ($1, $2, $3, $4)',
        [
            filename,
            path,
            mimetype,
            size
        ],
        (error, results) => {
            if (error) {
                res.status(500).send("Error executing image upload query: " + error)
            } else {
                res.status(201).send(`Image uploaded with filename: ${filename}`)
            }
        }
    )
}

const deleteImage = (req, res) => {
    const { filename } = req.params

    db.query('DELETE FROM images WHERE filename = $1', [filename], (error, results) => {
            if (error) {
                res.status(500).send("Error executing image delete query: " + error)
            } else {
                res.status(201).send(`Image delete with filename: ${filename}`)
            }
        }
    )
}

module.exports = {
    getImage,
    postImage,
    deleteImage
}