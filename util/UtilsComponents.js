const ValidarEntorno = (env) => {
  if (env === 'Desarrollo') return true
  else if (env === 'Produccion') return false
}

export { ValidarEntorno }