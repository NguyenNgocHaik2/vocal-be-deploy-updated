import db from '../../models';

const getGroups = async () => {
    try {
        let data = await db.Groups.findAll({
            order: [
                ['name', 'ASC']
            ]
        })
        return {
            EM: "get group successfully",
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

module.exports =  {
    getGroups
}