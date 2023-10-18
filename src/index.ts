import express, {Request, Response} from "express"
import cors from "cors"
import {db} from "./database/knex"
import {TUserDB} from "./types"

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`)
})

//## Users

//- GET all users
//- POST user
//- DELETE user by id

app.get("/users", async (req, res) => {
  try {
    // Consulta todos os usuários na tabela "users"
    const users = await db("users").select("*")

    // Retorna a lista de usuários como resposta
    res.status(200).json(users)
  } catch (error) {
    console.error(error) // Registre o erro no console para fins de depuração
    res.status(500).json({error: "Erro interno do servidor"})
  }
})

app.post("/users", async (req: Request, res: Response) => {
  try {
    const {id, name, email, password} = req.body

    if (typeof id !== "string") {
      res.status(400)
      throw new Error("id deve ser string")
    }

    if (id.length < 4) {
      res.status(400)
      throw new Error("Name deve possuir pelo menos 4 caracteres")
    }
    if (typeof name !== "string") {
      res.status(400)
      throw new Error("id deve ser string")
    }

    if (name.length < 2) {
      res.status(400)
      throw new Error("Name deve possuir pelo menos 2 caracteres")
    }

    if (typeof email !== "string") {
      res.status(400)
      throw new Error("id deve ser string")
    }

    if (email.length < 2) {
      res.status(400)
      throw new Error("Email deve possuir pelo menos 4 caracteres")
    }

    if (
      !password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g
      )
    ) {
      throw new Error(
        "'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial"
      )
    }

    const [userIdAlreadyExists]: TUserDB[] | undefined[] = await db(
      "users"
    ).where({id})

    if (userIdAlreadyExists) {
      res.status(400)
      throw new Error("User already exists")
    }

    const [userEmailAlreadyExists]: TUserDB[] | undefined[] = await db(
      "users"
    ).where({email})

    if (userEmailAlreadyExists) {
      res.status(400)
      throw new Error("Email already exists")
    }

    const newUser: TUserDB = {
      id,
      name,
      email,
      password,
    }

    await db("users").insert(newUser)

    res.status(201).send({message: "user criando com sucesso!", user: newUser})
  } catch (error) {
    console.log(error)

    if (req.statusCode === 200) {
      res.status(500)
    }

    if (error instanceof Error) {
      res.send(error.message)
    } else {
      res.send("Erro inesperado")
    }
  }
})

//## Tasks

//- GET all tasks
//- POST task
//- PUT task by id
//- DELETE task by id

//## Users + Tasks

//- GET all users with tasks
