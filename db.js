const {MongoClient} = require('mongodb')
let dbConnection;
const uri=`mongodb+srv://almas:test123@cluster0.mxcte7v.mongodb.net/?retryWrites=true&w=majority`
module.exports={
    connectToDb:(cb)=>{
        MongoClient.connect(uri)
        .then((client)=>{
           dbConnection= client.db()
           return cb()

        }).catch((err)=>{
            console.log(err)
            return cb(err)
        })

    },
    getDb:()=>dbConnection
}