const generateToken = (user) => {
    const userStr = JSON.stringify(user)
    // return Buffer.from(userStr).toString("base64")
    return btoa(userStr)
}

const verifyToken = (token) => {
    // const userStr = Buffer.from(token, "base64").toString()
    const userStr = atob(token)
    return JSON.parse(userStr)
}

const user = {
    name: "abdul",
    age: 17,
    email: "test@gmail.com"
}

const token = generateToken(user)

console.log("Token : ", token)

console.log("User : ", verifyToken(token))