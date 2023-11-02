import jwtDecode from 'jwt-decode'

interface Token {
  pId: string
}

export const tokenDecode = (token: string): Token | undefined => {
  if (token !== null) return jwtDecode(token)
}
