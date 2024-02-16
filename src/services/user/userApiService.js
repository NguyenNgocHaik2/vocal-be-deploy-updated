import db from '../../models'
import { hashUserPassword, checkEmailExist, checkPhoneExist} from './loginRegisterService'

const getAllUser = async () => {
    try {
        let users = await db.Users.findAll({
            attributes: ['id', "username", "email", "phone", 'sex'],
            include: { model: db.Groups, attributes: ["name", "description"] },
        })
        if (users) {
            return {
                EM: "get data Success",
                EC: 0,
                DT: users
            }
        } else {
            return {
                EM: "get data Success",
                EC: 0,
                DT: []
            }
        }
    } catch (error) {
        console.log(error)
        return {
            EM: "something wrongs with userService",
            EC: 1,
            DT: []
        }
    }
}

const getUserWithPagination = async (page, limit) => {
    console.log("check page, limit: ", page, limit);

    try {
        let offset = (page - 1) * limit
        const { count, rows } = await db.Users.findAndCountAll({
            attributes: ["id", "username", "email", "phone", "sex", "address"],
            include: { model: db.Groups, attributes: ["id","name", "description"]},
            order: [["id", "DESC"]],
            offset: offset,
            limit: limit,
            raw: true,
            nest: true
        })

        let totalPages = Math.ceil(count / limit)
        let data = {
            totalRows: count,
            totalPages: totalPages,
            users: rows
        }
        return {
            EM: "fetch successfully",
            EC: 0,
            DT: data
        }
    } catch (error) {
        console.log(error)
        return {
            EM: 'something wrongs with services',
            EC: 1,
            DT: []
        }
    }
}

const createNewUser = async (rawData) => {
    try {
         // check: email/phonenunber are exist
         let isEmailExits = await checkEmailExist(rawData.email)
         if (isEmailExits === true) {
             return {
                 EM: 'The email is already exiteds!',
                 EC: 1,
                 DT: 'email',
             }
         }
         let isPhoneExits = await checkPhoneExist(rawData.phone)
         if (isPhoneExits === true) {
             return {
                 EM: 'The phone is already exiteds!',
                 EC: 1,
                 DT: 'phone',
             }
         }
         // hash user password
         let hashPassword = hashUserPassword(rawData.password)
        await db.Users.create({
            ...rawData,
            password: hashPassword
        })
        return {
            EM: "Create user oke!",
            EC: 0,
            DT: []
        }
    } catch (error) {
        console.log(error)
        return {
            EM: "Not found crate users failed !",
            EC: 1,
            DT: []
        }
    }
}

const updateUser = async (data) => {
    try {
        if (!data.groupId) {
            return {
                EM: 'Error with empty GroupId',
                EC: 1,
                DT: 'group'
            }
        } 
        let user = await db.Users.findOne({
            where: { id: data.id }
        })
        if (user) {
            // update
            await db.Users.update({
                username: data.username,
                address: data.address,
                sex: data.sex,
                groupId: data.groupId
            }, {where: { id: data.id }})
            return {
                EM: 'Update user oke..!',
                EC: 0,
                DT: ''
            }
        } else {
            // not found
            console.log(error)
            return {
                EM: 'Update user not found!',
                EC: 2,
                DT: ''
            }
        }

    } catch (error) {
        console.log(error)
        return {
            EM: 'something wrongs with services',
            EC: 1,
            DT: []
        }
    }
}

const checkIsNotAllowedToDelete = async (userCurrentlyLogged, userDeleteId) => {
    let user = await db.Users.findOne({
        where: { id: userDeleteId }
    })

    if (userCurrentlyLogged === user.email) return false

    return true
}

const deleteUser = async (userCurrentlyLogged, userDeleteId) => {
    try {
        let checkDelete = await checkIsNotAllowedToDelete(userCurrentlyLogged, userDeleteId)
        if (checkDelete) {
            await db.Users.destroy({where: { id: userDeleteId }})
            return {
                EM: "Delete user successfully!",
                EC: 0,
                DT: []
            }
        } else {
            return {
                EM: "Deleted is not allowed..!",
                EC: 2,
                DT: []
            }
        }
    } catch (error) {
        console.log(error)
        return {
            EM: 'error form services',
            EC: 1,
            DT: []
        }
    }
}

module.exports = {
    getAllUser,
    createNewUser,
    updateUser,
    deleteUser,
    getUserWithPagination
}