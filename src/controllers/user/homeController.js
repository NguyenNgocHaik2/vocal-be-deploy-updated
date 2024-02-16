import userService from "../services/userService"

const handleHomePage = (req, res) => {
    return res.render("home.ejs")
}

const handleUserPage = async (req, res) => {
    let userLists = await userService.getUserList()
    return res.render("user.ejs", { userLists })
}

const handleCreateNewUser = (req, res) => {
    let { email, password, username } = req.body // let email = req.body.email , ...v.v..
    userService.createNewUser(email, password, username)
    return res.redirect("/user")
}

const handleDeleteUser = async (req, res) => { 
    await userService.deleteUser(req.params.id)
    return res.redirect("/user")
}

const handleEditUser = async (req, res) => { 
    let userData = await userService.getUserById(req.params.id)
    return res.render("user-update.ejs", { userData })
}

const handleUpdateUser = async (req, res) => {
    // let { email, username, id } = req.body // cách lây value ngắn gọn
    let email = req.body.email
    let username = req.body.username
    let id = req.body.id
    await userService.updateUserInfo(email, username, id)
    return res.redirect("/user")
}

module.exports = {
    handleHomePage,
    handleUserPage,
    handleCreateNewUser,
    handleDeleteUser,
    handleEditUser,
    handleUpdateUser
}