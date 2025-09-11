// expressjs.com
//ttps://expressjs.com/en/resources/middleware/method-override.html

const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const port = 3000;
// criar um objeto express
const app = express();
//vincualr o middleware ao express
app.use(cors());

// permissão para usar outros métodos HTTP
app.use(methodOverride('X-HTTP-Method'));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride('X-Method-Override'));
app.use(methodOverride('_method'));

//permissão servidor
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept');
  next();
})

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

//  fazer a conexão com o banco de dados mongoose
 let  url = "mongodb://localhost:27017/FatecVotorantim";

 // testa a conexão
 mongoose.connect(url)
 .then(
     () => console.log('MongoDB connected...') )
 .catch(
   () => { console.log("erro na conexão: " ) }
  );

// estrutura da mongodb para armazenar os dados
var User = mongoose.model('Usuario', { nome: String });

// inserir dados

app.post('/inseir', async(req, res) => {
    let corpo = req.body.name;
    //let corpo = "Ricardo";
    let user = await new User({ nome: corpo });
    user.save().then(() => console.log('Usuário salvo com sucesso'));
    res.send({status:'adicionado'});
    // respostar que tem voltar json
    res.json({"status": "adicionado com sucesso"});
})

// deletar dados campo nome
app.delete('/deletar', async(req, res) => {
  let corpo = req.body.name;
  await User.deleteOne({ nome: corpo });
  res.json({"status": "deletado com sucesso"});
});

// DELETA POR ID
app.delete('/deletar/:id', async(req, res) => {
  let id = req.params.id;
  await User.deleteOne({ _id: id });
  res.json({"status": "deletado com sucesso"});
});

// ALTERAR DADOS

app.put('/alterar/:id', async(req, res) => {
  let id = req.params.id;
  let corpo =   req.body.name;  
  await User.updateOne({ _id: id }, { nome: corpo });
  res.json({"status": "alterado com sucesso"});
});

// Middleware to parse JSON bodies rota
app.get('/', async (req, res) => {
   let user = await User.find({});
   if(user.length > 0){
     res.json(user);  
   }else{
      res.json({"status": "vazio"});
   } 
  })

// id
app.get('/:id', async(req, res) => {
  let id = req.params.id;
  let user = await User.findOne({ _id: id });
  res.json(user);   
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
