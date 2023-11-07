import jwtDecode from 'jwt-decode'



export const tokenDecode = (token: string): any => {
  if (token !== null) return jwtDecode(token)
}
