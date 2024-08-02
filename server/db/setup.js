 require("dotenv").config()
    const fs = require("fs")
    
    const db = require("../db/connect")
    const sql = fs.readFileSync("./server/db/entry.sql").toString()
    
    db.query(sql)
    .then(data => {
        db.end()
        console.log("Setup complete")
    })
    .catch(error => console.log(error))