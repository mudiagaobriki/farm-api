import jwt from 'jsonwebtoken';
const { verify } = jwt;
import moment from 'moment';
// import env from "../../env";
import User from '../src/models/User.js';
import http  from './axios.js';

import fs from 'fs';
import fsExtra from 'fs-extra';

import dotenv from 'dotenv';
dotenv.config();

const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

const checkIfUserIsLoggedIn = async (http) => {
    const bearerHeader = http.req.headers['authorization'];
    if (bearerHeader) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];

        try {
            const decoded = verify(bearerToken);
            if (decoded) {
                const findUserByID = await User.findById(decoded.id);

                if (findUserByID) {
                    return findUserByID.id().toString();
                }

                return false;
            }

            return false;
        } catch (e) {
            return false;
        }
    }
};

const isNumeric = str => /^[+-]?\d+(\.\d+)?$/.test(str);

const formatPhoneNumber = (phoneNumber) => {
    if (isNumeric(phoneNumber)) {
        if (phoneNumber.indexOf('0') === 0) {
            return phoneNumber.replace('0', '');
        }
    }
    else if (phoneNumber.indexOf('+') === 0) {
        return phoneNumber.replace('+234', '');
    }
    else{
        return phoneNumber;
    }
}

export {
    capitalize,
    checkIfUserIsLoggedIn,
    formatPhoneNumber,
};
