import * as SQLite from 'expo-sqlite';

// ------------------------------------------------------------------------------
async function criarBanco() {
    // criar um banco de dados
    try {
        const db = await SQLite.openDatabaseAsync('fatecVotorantim.db');
        console.log('Banco de dados criado / aberto');
        return db;
    } catch (error) {
        console.log('Erro ao criar / abrir o banco de dados: ' + error);
    }
}


// ----------------------------TABELA--------------------------------------
async function criarTabela(dataBase: SQLite.SQLiteDatabase) {
    try {
        await dataBase.execAsync(
            `PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS USUARIO(
                ID_USUARIO INTEGER PRIMARY KEY AUTOINCREMENT,
                NOME_USUARIO VARCHAR(100),
                EMAIL_USUARIO VARCHAR(100)
            );            
            `
        );
        console.log('Tabela USUARIO criada com sucesso');
    } catch (error) {
        console.log('Erro ao criar a Tabela USUARIO: ' + error);
    }
}

// --------------------------INSERIR---------------------------------------
async function inserirUsuario(dataBase: SQLite.SQLiteDatabase,
    nome: string, email: string) {
    try {
        await dataBase.runAsync(
            `INSERT INTO USUARIO (NOME_USUARIO, EMAIL_USUARIO)
            VALUES (?, ?)`, nome, email
        );
        console.log('Usuário inserido com sucesso');
    } catch (error) {
        console.log('Erro ao inserir usuário: ' + error);
    }
}

// -----------------------Seleciona Todos-------------------------------------
async function selectTodos(db: SQLite.SQLiteDatabase) {
    try {
        let arrayReg =await db.getAllAsync(
            `SELECT * FROM USUARIO`
        );
        return arrayReg;
    } catch (error) {
        console.log("Não há registros de usuários");
    }
}

// exportar a função
export { criarBanco, criarTabela, inserirUsuario, selectTodos };