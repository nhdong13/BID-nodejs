import models from '@models';
import { createJWT } from '@utils/jwt';
import { comparePassword } from '@utils/hash';
import speakeasy from 'speakeasy';

const login = async (req, res) => {
    const { phoneNumber, password } = req.body;
    try {
        const user = await models.user.findOne({
            where: {
                phoneNumber,
            },
        });

        if (user) {
            const { id: userId, roleId, firstTime, secret } = user;
            const isValid = await comparePassword(password, user.password);
            if (isValid) {
                if (roleId == 2) {
                    const token = createJWT(userId, roleId);
                    res.send({ token, roleId: roleId, userId: userId });
                } else {
                    // const token = createJWT(userId, roleId);
                    if (firstTime) {
                        const secret = speakeasy.generateSecret({ length: 20 });
                        const updateUser = {
                            firstTime: false,
                            secret: secret.base32,
                        };

                        const token = createJWT(userId, roleId);
                        await models.user.update(updateUser, {
                            where: { id: userId },
                        });
                        res.send({
                            token,
                            roleId,
                            userId,
                            firstTime: true,
                            secret,
                        });
                    } else {
                        res.send({
                            secret,
                            roleId,
                            userId,
                            firstTime: false,
                        });
                    }
                }
            } else {
                res.status(400);
                res.send();
            }
        } else {
            res.status(400);
            res.send();
        }
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

const checkOtp = async (req, res) => {
    const { phoneNumber, otp } = req.body;
    try {
        const user = await models.user.findOne({
            where: {
                phoneNumber,
            },
        });

        if (user) {
            const { id: userId, roleId, secret } = user;
            console.log('PHUC: checkOtp -> user', user);
            console.log('PHUC: checkOtp -> secret', secret);
            console.log('PHUC: checkOtp -> otp', otp);

            const tokenValidates = speakeasy.totp.verify({
                secret: secret,
                encoding: 'base32',
                token: otp,
                window: 0,
            });
            console.log('PHUC: checkOtp -> tokenValidates', tokenValidates);
            if (tokenValidates) {
                const token = createJWT(userId, roleId);

                res.send({ token, userId, roleId });
            } else {
                res.status(401);
                res.send();
            }
        } else {
            res.status(400);
            res.send();
        }
    } catch (err) {
        res.status(400);
        res.send(err);
    }
};

export default { login, checkOtp };
