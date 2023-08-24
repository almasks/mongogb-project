const express=require('express')
const {connectToDb,getDb}=require('./db.js')
const { ObjectId } = require('mongodb')
const app =express()
let db
connectToDb((err)=>{
    if(!err){
        app.listen(5001,()=>{
            console.log('server running in port 5001')
        })
        db=getDb()
    }

})
//fetching all books
app.get('/books',(req,res)=>{
    let books=[]
    db.collection('books').find().sort({author:1}).forEach(book=>books.push(book))
    .then(()=>{
        res.status(200).json(books)

    }).catch(()=>{
        res.status(500).json({error:'could not fetch decument'})

    })
})
//fetch single document
app.get('/books/:id',(req,res)=>{
    if(ObjectId.isValid(req.params.id)){
        db.collection('books').findOne({_id: new ObjectId(req.params.id)}).then((doc=>{
            res.status(200).json(doc)
        })).catch((err)=>{res.status(500).json({error:'cannot fetch data'})})
    }
    else{
        res.status(500).json({error:'not valid id'})
    }
       
   
})