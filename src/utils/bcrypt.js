import bcrypt from 'bcrypt'

export const hashPassword = async (password) => {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

export const comparePassword = async (password, hashedPassword) => {
  const match = await bcrypt.compare(password, hashedPassword)
  return match
}
