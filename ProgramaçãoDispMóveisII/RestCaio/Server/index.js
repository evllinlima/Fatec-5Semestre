// expressjs.com
//ttps://expressjs.com/en/resources/middleware/method-override.html

const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const axios = require('axios');
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

// estrutura da mongodb para armazenar os dados dos Alunos
const alunoSchema = new mongoose.Schema({
  matricula: { type: String, required: true, unique: true },
  nome: { type: String, required: true },
  endereco: {
    cep: { type: String, required: true },
    logradouro: String,
    cidade: String,
    bairro: String,
    estado: String,
    numero: String,
    complemento: String
  },
  cursos: [String]
});

var Aluno = mongoose.model('Aluno', alunoSchema);

// ENDPOINT PARA BUSCAR CEP NA API VIA CEP
app.get('/buscar-cep/:cep', async (req, res) => {
  try {
    const cep = req.params.cep.replace(/\D/g, ''); // Remove caracteres não numéricos
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    
    if (response.data.erro) {
      return res.status(400).json({ erro: 'CEP não encontrado' });
    }
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar CEP' });
  }
});

// INSERIR ALUNO
app.post('/alunos', async(req, res) => {
  try {
    const { matricula, nome, endereco, cursos } = req.body;
    
    // Verificar se matrícula já existe
    const alunoExistente = await Aluno.findOne({ matricula });
    if (alunoExistente) {
      return res.status(400).json({ erro: 'Matrícula já cadastrada' });
    }
    
    const aluno = new Aluno({
      matricula,
      nome,
      endereco,
      cursos: cursos || []
    });
    
    await aluno.save();
    res.json({ status: 'Aluno adicionado com sucesso', aluno });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao adicionar aluno' });
  }
});

// LISTAR TODOS OS ALUNOS
app.get('/alunos', async (req, res) => {
  try {
    const alunos = await Aluno.find({});
    res.json(alunos);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar alunos' });
  }
});

// BUSCAR ALUNO POR ID
app.get('/alunos/:id', async(req, res) => {
  try {
    const id = req.params.id;
    const aluno = await Aluno.findOne({ _id: id });
    
    if (!aluno) {
      return res.status(404).json({ erro: 'Aluno não encontrado' });
    }
    
    res.json(aluno);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar aluno' });
  }
});

// ATUALIZAR ALUNO
app.put('/alunos/:id', async(req, res) => {
  try {
    const id = req.params.id;
    const { matricula, nome, endereco, cursos } = req.body;
    
    // Verificar se matrícula já existe em outro aluno
    if (matricula) {
      const alunoExistente = await Aluno.findOne({ matricula, _id: { $ne: id } });
      if (alunoExistente) {
        return res.status(400).json({ erro: 'Matrícula já cadastrada em outro aluno' });
      }
    }
    
    const alunoAtualizado = await Aluno.findByIdAndUpdate(
      id, 
      { matricula, nome, endereco, cursos },
      { new: true }
    );
    
    if (!alunoAtualizado) {
      return res.status(404).json({ erro: 'Aluno não encontrado' });
    }
    
    res.json({ status: 'Aluno atualizado com sucesso', aluno: alunoAtualizado });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar aluno' });
  }
});

// DELETAR ALUNO
app.delete('/alunos/:id', async(req, res) => {
  try {
    const id = req.params.id;
    const aluno = await Aluno.findByIdAndDelete(id);
    
    if (!aluno) {
      return res.status(404).json({ erro: 'Aluno não encontrado' });
    }
    
    res.json({ status: 'Aluno deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao deletar aluno' });
  }
});

// ROTA PRINCIPAL
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Gerenciamento de Alunos',
    endpoints: {
      'GET /alunos': 'Listar todos os alunos',
      'GET /alunos/:id': 'Buscar aluno por ID',
      'POST /alunos': 'Adicionar novo aluno',
      'PUT /alunos/:id': 'Atualizar aluno',
      'DELETE /alunos/:id': 'Deletar aluno',
      'GET /buscar-cep/:cep': 'Buscar endereço por CEP'
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
