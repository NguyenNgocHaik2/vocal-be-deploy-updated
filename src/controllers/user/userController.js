import userApiService from '../../services/user/userApiService'

const readFunc = async (req, res) => {
    try {
        if (req.query.page && req.query.limit) {
            let page = req.query.page
            let limit = req.query.limit
            let data = await userApiService.getUserWithPagination(+page, +limit)
            return res.status(200).json({
                EM: data.EM, // error message
                EC: data.EC, // error code
                DT: data.DT,  // data
            })
        } else {
            let data = await userApiService.getAllUser()
            return res.status(200).json({
                EM: data.EM, // error message
                EC: data.EC, // error code
                DT: data.DT,  // data
            })
        }
    } catch (error) {
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '',  // data
        })
    }

}
const crateFunc = async (req, res) => {
    try {
        // check validate...
        // req.body: email, phone, username, password
        if (!req.body.email || !req.body.phone || !req.body.password) {
            return res.status(200).json({
                EM: 'Missing required parameters', // error message
                EC: '1', // error code
                DT: '',  // data
            })
        }
        // check length password
        if (req.body.password && req.body.password.length < 3) {
            return res.status(200).json({
                EM: 'Your password must have more than 3 letters', // error message
                EC: '1', // error code
                DT: '',  // data
            })
        }
        let data = await userApiService.createNewUser(req.body)
        return res.status(200).json({
            EM: data.EM, // error message
            EC: data.EC, // error code
            DT: data.DT,  // data
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '',  // data
        })
    }
}
const updateFunc = async (req, res) => {
    try {
        let data = await userApiService.updateUser(req.body)
        return res.status(200).json({
            EM: data.EM, // error message
            EC: data.EC, // error code
            DT: data.DT,  // data
        })
    } catch (error) {
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '',  // data
        })
    }
}
const deleteFunc = async (req, res) => {
    try {
        let data = await userApiService.deleteUser(req.user.email, req.body.id)
        return res.status(200).json({
            EM: data.EM, // error message
            EC: data.EC, // error code
            DT: data.DT,  // data
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '',  // data
        })
    }
}

const getUserAccount = async (req, res) => {
    return res.status(200).json({
        EM: 'ok', // error message
        EC: 0, // error code
        DT: {
            access_token: req?.token,
            groupWithRoles: req.user?.groupWithRoles,
            email: req.user?.email,
            username: req.user?.username,
            id: req.user?.id
        },
    })
}

module.exports = {
    readFunc,
    crateFunc,
    updateFunc,
    deleteFunc,
    getUserAccount
}