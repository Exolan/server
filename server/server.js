import mariadb from 'mariadb'
import express, { json } from "express"

const app = express()
let conn
app.use(json())
app.listen(5000, async ()=>{
    conn = await mariadb.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '12345',
        database: 'librarybachurin', 
        bigIntAsNumber: true,
        insertIdAsNumber: true
    })
    console.log('Подключено');
})

app.get('/get/tables', async (req, res)=>{
    const tables = await conn.query(`SHOW TABLES`)
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "origin, content-type, accept")
    res.json(tables)
})

app.get('/get/:table' , async (req, res)=>{
    const {table} = req.params;
    const getReq = await conn.query(`SELECT * FROM ${table}`)
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "origin, content-type, accept")
    res.json(getReq)
})

app.post('/post/avthor',  async (req, res)=>{
    const avthor = req.body
    console.log(avthor);
    const postAv = await conn.query(`INSERT INTO avthor (fio_avth, date_avth) VALUES (${JSON.stringify(avthor.fio_avth)}, ${JSON.stringify(avthor.date_avth)})`)
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "origin, content-type, accept")
    res.json(postAv)
})

app.post('/post/ganre',  async (req, res)=>{
    const ganre = req.body
    console.log(ganre);
    const postGan = await conn.query(`INSERT INTO ganre (name_ganre)) VALUES (${JSON.stringify(ganre.name_ganre)})`)
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "origin, content-type, accept")
    res.json(postGan)
})

app.post('/post/book',  async (req, res)=>{
    const book = req.body
    console.log(book);
    const postBook = await conn.query(`INSERT INTO book (name_book, id_avth, id_ganre, amount) VALUES (${JSON.stringify(book.name_book)}, ${book.id_avth}, ${book.id_ganre}, ${book.amount})`)
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "origin, content-type, accept")
    res.json(postBook)
})

app.post('/post/reader',  async (req, res)=>{
    const reader = req.body
    console.log(reader);
    const postRead = await conn.query(`INSERT INTO reader (passport, fio_reader, phone_num, date_reader) VALUES (${JSON.stringify(reader.passport)}, ${JSON.stringify(reader.fio_reader)}, ${JSON.stringify(reader.phone_num)}, ${JSON.stringify(reader.date_reader)})`)
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "origin, content-type, accept")
    res.json(postRead)
})

app.post('/post/moving',  async (req, res)=>{
    const moving = req.body
    console.log(moving);
    const postMov = await conn.query(`INSERT INTO moving (id_reader, id_book, amount, date_out, date_in) VALUES (${moving.id_reader}, ${moving.id_book}, ${moving.amount}, ${JSON.stringify(moving.date_out)}, ${JSON.stringify(moving.date_in)}, ${JSON.stringify(moving.date_in_fact)})`)
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "origin, content-type, accept")
    res.json(postMov)
})

app.put('/:table/:id/update', async (req, res)=>{
    const body = req.body
    const table = req.params.table
    const id = req.body.id
    const values = Object.entries(body)
        .map(([key, value], index) => {
            let serializeValue
            if (typeof value === 'number'){
                serializeValue = value 
            }
            else{
                serializeValue = JSON.stringify(value)
            }

            if (index == 0){
                return `${key}_${table} = ${serializeValue}`
            }
            else{
                return `${key} = ${serializeValue}`
            }
        })
        .join(', ')
    const putTable = await conn.query(`UPDATE ${table} SET ${values} WHERE id_${table} = ${id}`)
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "origin, content-type, accept")
    res.json(putTable)
})