import db from '../models/index'
import { checkExistEnglish } from './checkExistService'

const getAllVocal = async () => {
    try {
        let vocals = await db.Vocals.findAll({
            attributes: ['id', "en", "vn", "spelling", 'pronunciation', 'example_en', 'example_vn', 'levelId'],
            order: [["id", "DESC"]],
            raw: true,
            nest: true
        })
        if (vocals) {
            return {
                EM: "Get vocal data success..!",
                EC: 0,
                DT: vocals
            }
        } else {
            return {
                EM: "Get don't data success",
                EC: 0,
                DT: []
            }
        }
    } catch (error) {
        console.log(error)
        return {
            EM: "Something wrongs with vocal service",
            EC: 1,
            DT: []
        }
    }
}
const getVocalWithPagination = async (page, limit, levelId) => {
    try {
        let offset = (page - 1) * limit

        const { count, rows } = await db.Vocals.findAndCountAll({
            where: { levelId: levelId },
            attributes: ['id', "en", "vn", "spelling", 'pronunciation', 'example_en', 'example_vn', 'levelId'],
            order: [["id", "ASC"]],
            offset: offset,
            limit: limit,
            raw: true,
            nest: true
        })

        let totalPages = Math.ceil(count / limit)
        let data = {
            totalRows: count,
            totalPages: totalPages,
            vocals: rows
        }

        if (data) {
            return {
                EM: "Get vocal data success..!",
                EC: 0,
                DT: data
            }
        }
    } catch (error) {
        console.log(error)
        return {
            EM: "Something wrongs with vocal service",
            EC: 1,
            DT: []
        }
    }
}

const createFunc = async (rawData) => {
    try {
        if (rawData.length === 1) {
            let isEnglishExits = await checkExistEnglish(rawData[0].en)
            if (isEnglishExits === true) {
                return {
                    EM: 'The English is already exiteds!',
                    EC: 2,
                    DT: 'en',
                }
            }
        }

        let currentVocals = await db.Vocals.findAll({
            attributes: ['en'],
            raw: true
        })

        const persist = rawData.filter(({ en: name1 }) => !currentVocals.some(({ en: name2 }) => name2 === name1))

        if (persist && persist.length === 0) {
            return {
                EM: "Vocals created error..!",
                EC: 2,
                DT: []
            }
        }

        await db.Vocals.bulkCreate(persist)
        return {
            EM: `Create ${persist.length} vocalbulary oke!`,
            EC: 0,
            DT: []
        }
    } catch (error) {
        console.log(error)
        return {
            EM: "Error not server..!",
            EC: 1,
            DT: []
        }
    }
}

const updateVocal = async (data) => {
    try {
        if (!data.levelId) {
            return {
                EM: 'Error with empty levelId',
                EC: 1,
                DT: 'levelId'
            }
        } 
        let vocal = await db.Vocals.findOne({
            where: { id: data.id }
        })

        let updateValues = {
            en: data.en,
            vn: data.vn,
            spelling: data.spelling,
            pronunciation: data.pronunciation,
            example_en: data.example_en,
            example_vn: data.example_vn,
            levelId: data.levelId
        }

        if (vocal) {
            // update
            let resultUpdate = await db.Vocals.update(updateValues, { where: { id: data.id }})
            if (resultUpdate[0] === 1) {
                console.log("Success Update: ", resultUpdate)
                return {
                    EM: 'Update Vocals oke..!',
                    EC: 0,
                    DT: ''
                }
            } else {
                console.log("Error Update: ", resultUpdate)
            }
        } else {
            // not found
            console.log(error)
            return {
                EM: 'Update Vocals not found!',
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

const deleteVocal = async (id) => {
    try {
        let vocal = await db.Vocals.findOne({
            where: { id: id }
        })
        if (vocal) {
            await db.Vocals.destroy({where: { id: id }})
            return {
                EM: "Delete vocal successfully!",
                EC: 0,
                DT: []
            }
        } else {
            return {
                EM: "Vocals not exits",
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

const checkExistUserVocal = async (data) => {
    let check = await db.UserVocals.findOne({
        where: { userId: data.userId, vocalId: data.vocalId  }
    })
    if (check) return true
    return false
}
const assignVocalToUser = async (data) => {
    try {
        let isUserVocalExits = await checkExistUserVocal(data)
        if (isUserVocalExits === true) {
            return {
                EM: 'The assign vocal to user is already exiteds!',
                EC: 2,
                DT: '',
            }
        }
        await db.UserVocals.create(data)
        return {
            EM: `assign vocal to user oke!`,
            EC: 0,
            DT: []
        }
    } catch (error) {
        console.log(error)
        return {
            EM: "Error not server..!",
            EC: 1,
            DT: []
        }
    }
}
const deleteAssignVocalToUser = async (data) => {
    try {
        console.log("check data: ", data)
        let UserVocal = await db.UserVocals.findOne({
            where: { 
                userId: data.userId,
                vocalId: data.vocalId
            }
        })
        console.log("check UserVocal: ", UserVocal)
        if (UserVocal) {
            await db.UserVocals.destroy({
                where: { 
                    userId: data.userId,
                    vocalId: data.vocalId
                }
            })
            return {
                EM: "Un Assign vocal To User successfully!",
                EC: 0,
                DT: []
            }
        } else {
            return {
                EM: "Un Assign vocal not exits",
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

const getVocalByUser = async () => {
    try {
        let vocalByUser = await db.UserVocals.findAll({
            attributes: ['userId', 'vocalId'],
            raw: true,
            nest: true
        })
        if (vocalByUser) {
            return {
                EM: "Get user by vocal data success..!",
                EC: 0,
                DT: vocalByUser
            }
        }
    } catch (error) {
        console.log(error)
        return {
            EM: "Something wrongs with user by vocal service",
            EC: 1,
            DT: []
        }
    }
}

module.exports = {
    getAllVocal,
    getVocalWithPagination, 
    createFunc, 
    updateVocal, 
    deleteVocal, 
    assignVocalToUser,
    getVocalByUser,
    deleteAssignVocalToUser
}