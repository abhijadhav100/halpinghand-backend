const express = require('express');
const dotnev = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
dotnev.config();
const bodyParser = require('body-parser');
const dburl = process.env.MONGODB_URI;

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(dburl).then(()=>{
  console.log('Database connected...');
}).catch((err)=>{
  console.log(err);
})
}

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required: true,
    unique: true
  },
  mobile:{
    type: Number,
    required: true
  },
  password:{
    type:String,
    required:true
  },
  conpassword:{
    type:String
  }
})

const donarSchema = new mongoose.Schema({
  dname:{
    type:String,
    required:true
  },
  address:{
    type:String,
    required: true,
  },
  mobile:{
    type: Number,
    required: true
  },
  dtype:{
    type:String,
    required:true
  },
  message:{
    type:String
  }
})

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const port = process.env.PORT || 8000;

const userCollection = new mongoose.model('trustinfo',userSchema)
const donarCollection = new mongoose.model('donardata',donarSchema)


app.post('/api',(req,res)=>{
  // console.log(req.body);
  const user = req.body;
  userCollection.insertMany(user).then((result)=>{
    console.log(result);
  }).catch((err)=>{
    console.log(err);
  })
  res.json({message:"Data added successfully!"});
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)
  userCollection.findOne({email: email}).then(user=>{
    if(user){
      if(user.password===password){
        res.json('success')
      }else{
        res.json('the password is incorrect')
      }
    }else{
      res.json('No record exits')
    }
  })
});

app.get('/api',(req,res)=>{
  userCollection.find()
   .then(users=> res.json(users))
   .catch(err=> res.json(err))
});

app.post('/api/donardata',async (req,res)=>{
   const donar = req.body;
   donarCollection.insertMany(donar).then(result=>{
    console.log(result)
   }).catch(err=>{
    console.log(err)
   })
   res.json("Data added....")
})

app.get('/api/donardata',(req,res)=>{
   donarCollection.find()
   .then(donars=> res.json(donars))
   .catch(err=>console.log(err))
})

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})


