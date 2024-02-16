import db from '../models'

const readFunc = async () => {
    try {
        let levels = await db.Levels.findAll({
            attributes: ['id', "name", "description"],
            raw: true,
            nest: true
        })
        if (levels) {
            return {
                EM: "Get levels data success..!",
                EC: 0,
                DT: levels
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

const createNewLevel = async (levels) => {
    try {
        let currentLevels = await db.Levels.findAll({
            attributes: ['name', 'description'],
            raw: true
        })
        const persist = levels.filter(({ name: name1 }) => !currentLevels.some(({ name: name2 }) => name2 === name1));

        if (persist && persist.length === 0) {
            return {
                EM: "Levels created error..!",
                EC: 2,
                DT: []
            }
        }
        await db.Levels.bulkCreate(persist)
        return {
            EM: `Create ${persist.length} level oke!`,
            EC: 0,
            DT: []
        }
    } catch (error) {
        console.log(error)
        return {
            EM: "Not found crate level failed !",
            EC: 1,
            DT: []
        }
    }
}

const updateLevel = async (data) => {
    try {
        let level = await db.Levels.findOne({
            where: { id: data.id }
        })
        if (level) {
            // update
            await db.Levels.update({
                name: data.name,
                description: data.description,
            }, {where: { id: data.id }})
            return {
                EM: 'Update level oke..!',
                EC: 0,
                DT: ''
            }
        } else {
            // not found
            console.log(error)
            return {
                EM: 'Update level not found!',
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

const deleteLevel = async (id) => {
    try {
        let level = await db.Levels.findOne({
            where: { id: id }
        })
        if (level) {
            await db.Levels.destroy({ where: { id: id }})
            return {
                EM: "Delete level successfully!",
                EC: 0,
                DT: []
            }
        } else {
            return {
                EM: "Levels not exits",
                EC: 2,
                DT: []
            }
        }
    } catch (error) {
        console.log(error)
        return {
            EM: 'error form role services',
            EC: 1,
            DT: []
        }
    }
}

module.exports = {
    readFunc, createNewLevel, updateLevel,
    deleteLevel
}