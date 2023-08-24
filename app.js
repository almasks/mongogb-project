const express=require('express')
const {connectToDb,getDb}=require('./db.js')
const { ObjectId } = require('mongodb')
const app =express()
app.use(express.json())
let db
connectToDb((err)=>{
    if(!err){
        app.listen(5002,()=>{
            console.log('server running in port 5002')
        })
        db=getDb()
    }

})
//fetching all books
app.get('/books',(req,res)=>{
    const pages=req.query.p ||0
    const booksPerPage=2

    let books=[]
    db.collection('books').find().sort({author:1})
    .skip(pages*booksPerPage)
    .limit(booksPerPage)
    .forEach(book=>books.push(book))
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
app.post('/books',(req,res)=>{
    const book=req.body
    db.collection('books').insertOne(book)
    .then(result=>{
        res.status(200).json(result)
    })
    .catch(err=>{
        res.status(500).json({error:'cannot fetch data'})
    })
})
app.delete('/books/:id',(req,res)=>{
    if(ObjectId.isValid(req.params.id)){
        db.collection('books').deleteOne({_id: new ObjectId(req.params.id)})
        .then(result=>{
            res.status(200).json(result)
        })
        .catch((err)=>{
            res.status(500).json({error:'cannot delete data'})
        })
    }else{
        res.status(500).json({error:'not valid id'})
    }
    
})
app.patch('/books/:id',(req,res)=>{
    const update=req.body
    if(ObjectId.isValid(req.params.id)){
        db.collection('books').updateOne({_id:new ObjectId(req.params.id)},{$set:update})
        .then(result=>{
            res.status(200).json(result)
        })
        .catch(err=>{
            res.status(500).json({error:'cannot update data'})
        })
    }else{
        res.status(500).json({error:'not valid id'})
    }
    
})