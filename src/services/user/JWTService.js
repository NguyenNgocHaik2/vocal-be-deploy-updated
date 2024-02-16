import db from "../../models"

const getGroupWithRoles = async (user) => {
    let roles = await db.Groups.findAll({
        where: { id: user.groupId },
        attributes: ["id", "name", "description"],
        include: {
            model: db.Roles,
            attributes: ["id", "url", "description"],
            through: {attributes: []}
        },
        raw: true,
        nest: true
    })
    return roles ? roles : {}
}

module.exports = { 
    getGroupWithRoles 
}