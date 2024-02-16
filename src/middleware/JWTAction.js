require("dotenv").config()
import jwt from 'jsonwebtoken'
import { getGroupWithRoles } from '../services/user/JWTService'
import _ from 'lodash'

const nonSecurePaths = ['/user/logout', '/user/login', '/user/register']

const createJWT = (payload) => {
    let key = process.env.JWT_SECRET
    let token = null
    try {
        token = jwt.sign(payload, key, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })
    } catch (error) {
        console.log(error)
    }
    return token
}

const verifyToken = (token) => {
    let key = process.env.JWT_SECRET
    let decoded = null
    try {
        decoded = jwt.verify(token, key)
    } catch (error) {
        console.log(error)
    }
    return decoded
}

const extractToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
}

const checkUserJWT = (req, res, next) => {
    // if (nonSecurePaths.includes(req.path) || req.path === '/admin/vocal/read' || req.path === '/vocalbulary/List') return next()
    if (nonSecurePaths.includes(req.path)) return next()

    let cookieVocalGoogle = null

    if (req.cookies['vocal-auth-google-sv']) {
        cookieVocalGoogle = JSON.parse(req.cookies['vocal-auth-google-sv'])
    }

    let cookies = req.cookies;
    let tokenFromHeader = extractToken(req)

    let origin = req.get('origin')

    console.log("Check req origin:: ", origin === process.env.REACT_URL)

    if ((cookies && cookies.jwt) || tokenFromHeader) {
        let token = cookies && cookies.jwt ? cookies.jwt : tokenFromHeader
        let decoded = verifyToken(token)
        if (decoded) {
            req.user = decoded
            req.token = token
            next()
        } else if (origin === process.env.REACT_URL) {
            next()
        } else {
            return res.status(401).json({
                EM: 'Not authentication the user',
                EC: -2,
                DT: ''
            })
        }
    } else {
        return res.status(401).json({
            EM: 'Not authentication the user JWT',
            EC: -1,
            DT: ''
        })
    }
}

const checkUserPermission = async (req, res, next) => {
    // if (nonSecurePaths.includes(req.path) || req.path === '/user/account' || req.path === '/vocalbulary/List' || req.path === '/admin/vocal/read') return next();
    if (nonSecurePaths.includes(req.path) || req.path === '/user/account') return next()

    let cookieVocalGoogle = null

    if (req.cookies['vocal-auth-google-sv']) {
        cookieVocalGoogle = JSON.parse(req.cookies['vocal-auth-google-sv'])
    }

    let origin = req.get('origin')

    if (req.user) {
        // let email = req.user.email
        let roles = req.user.groupWithRoles.Roles
        let currentUrl = req.path
        if (!roles || roles.length === 0) {
            return res.status(403).json({
                EM: `You dont't permission to access this resource...`,
                EC: -5,
                DT: ''
            })
        }

        let canAccess = roles.some(item => item.url === currentUrl || currentUrl.includes(item.url))
        if (canAccess === true) {
            next()
        } else {
            return res.status(403).json({
                EM: `You dont't permission to access this resource...`,
                EC: -4,
                DT: ''
            })
        }
    } else if (origin === process.env.REACT_URL) {
        let getGroupVSRoles = await getGroupWithRoles({ groupId: 3 })
        let getRoles = getGroupVSRoles.reduce((accumulator, currentValue) => {
            accumulator.push(currentValue.Roles)
            return accumulator
        }, [])

        let currentUrl = req.path
        if (!getRoles || getRoles.length === 0) {
            return res.status(403).json({
                EM: `You dont't permission to access this resource...`,
                EC: -3,
                DT: ''
            })
        }

        let canAccess = getRoles.some(item => item.url === currentUrl || currentUrl.includes(item.url))
        if (canAccess === true) {
            next()
        } else {
            return res.status(403).json({
                EM: `You dont't permission to access this resource...`,
                EC: -2,
                DT: ''
            })
        }
    } else {
        return res.status(401).json({
            EM: 'Not authentication the user Permission',
            EC: -1,
            DT: ''
        })
    }

    // if (req.user || req.cookies['next-auth.session-token']) {
    //     // check permission auth google
    //     if (!(req.cookies['next-auth.session-token']) && (_.size(req.body) !== 4)) {
    //         return {
    //             EM: "Is not failed..!",
    //             EC: -4,
    //             DT: ""
    //         }
    //     }

    //     console.log("check getRoles 333: ", req.user)

    //     // let email = req.user.email
    //     let roles = req.user?.groupWithRoles?.Roles ? req.user.groupWithRoles.Roles : [
    //         {
    //             "id": 21,
    //             "url": "/vocal/by-user/read",
    //             "description": ""
    //         },
    //         {
    //             "id": 20,
    //             "url": "/vocal/assign-to-user",
    //             "description": ""
    //         },
    //         {
    //             "id": 16,
    //             "url": "/level/read",
    //             "description": "view Level"
    //         },
    //         {
    //             "id": 12,
    //             "url": "/vocal/read",
    //             "description": ""
    //         }
    //     ]
    //     let currentUrl = req.path
    //     if (!roles || roles.length === 0) {
    //         return res.status(403).json({
    //             EM: `You dont't permission to access this resource...`,
    //             EC: -3,
    //             DT: ''
    //         })
    //     }

    //     let canAccess = roles.some(item => item.url === currentUrl || currentUrl.includes(item.url))

    //     if (canAccess === true) {
    //         next()
    //     } else {
    //         return res.status(403).json({
    //             EM: `You dont't permission to access this resource...`,
    //             EC: -2,
    //             DT: ''
    //         })
    //     }
    // } else {
    //     return res.status(401).json({
    //         EM: 'Not authentication the user Permission',
    //         EC: -1,
    //         DT: ''
    //     })
    // }
}

export {
    createJWT,
    verifyToken,
    checkUserJWT,
    checkUserPermission
}