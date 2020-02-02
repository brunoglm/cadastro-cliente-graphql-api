const db = require("../../config/db")
const bcrypt = require("bcrypt-nodejs")
const { getUsuarioLogado } = require("../comum/usuario")

module.exports = {
  async login(_, { dados }) {
    const usuario = await db("usuarios")
      .where({ email: dados.email })
      .first()

    if (!usuario) {
      throw new Error("Usuário não cadastrado")
    }

    const saoIguais = bcrypt.compareSync(dados.senha, usuario.senha)

    if (!saoIguais) {
      throw new Error("Senha informada inválida")
    }

    return getUsuarioLogado(usuario) //Retorna o usuário com o token para uso
  },
  usuarios(_, args, ctx) {
    ctx && ctx.validarAdmin()
    return db("usuarios")
  },
  usuario(_, { filtro }, ctx) {
    ctx && ctx.validarUsuarioFiltro(filtro)
    if (!filtro) return null
    const { id, email } = filtro
    if (id) {
      return db("usuarios")
        .where({ id })
        .first()
    } else if (email) {
      return db("usuarios")
        .where({ email })
        .first()
    } else {
      return null
    }
  }
}
