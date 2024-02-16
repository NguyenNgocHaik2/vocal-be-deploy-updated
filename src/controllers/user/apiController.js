require('dotenv').config()
import loginRegisterService from '../../services/user/loginRegisterService'

const handleTestApi = (req, res) => {
    return res.status(200).json({
        message: "oke",
        data: "test api..."
    })
}

const handleApiRegister = async (req, res) => {
    try {
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
        // service: create user
        let data = await loginRegisterService.registerNewUser(req.body)

        return res.status(200).json({
            EM: data.EM, // error message
            EC: data.EC, // error code
            DT: data.DT,  // data
        })

    } catch (e) {
        return res.status(500).json({
            EM: "Error Form Server", // error messsage
            EC: "-1", // error code
            DT: '', // data
        })
    }
}

const handleApiLogin = async (req, res) => {
    try {
        let data = await loginRegisterService.handleUserLogin(req.body)
        if (data && data.DT && data.DT.access_token) {
            res.cookie("jwt", data.DT.access_token, { 
                secure: true, // process.env.NODE_ENV === 'production' ? true : false, 
                httpOnly: true, 
                sameSite: 'none', 
                maxAge: 60 * 60 * 1000 
            })
        }
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

const handleApiLogout = async (req, res) => {
    try {
        res.clearCookie("jwt" , { secure: true, httpOnly: true, sameSite: 'none' })
        return res.status(200).json({
            EM: "Clear cookies done!", // error message
            EC: 0, // error code
            DT: '',  // data
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

module.exports = {
    handleTestApi,
    handleApiRegister,
    handleApiLogin,
    handleApiLogout
}