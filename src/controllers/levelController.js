import levelApiService from '../services/levelApiService'

const readFunc = async (req , res) => {
    try {
        let data = await levelApiService.readFunc()
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
const crateFunc = async (req , res) => {
    try {
        let data = await levelApiService.createNewLevel(req.body)
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
        let data = await levelApiService.updateLevel(req.body)
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
        let data = await levelApiService.deleteLevel(req.body.id)
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

module.exports = {
    readFunc, crateFunc, updateFunc,
    deleteFunc
}