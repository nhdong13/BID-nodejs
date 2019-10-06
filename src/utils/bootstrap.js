import models from '@models';
import { hashPassword } from '@utils/hash';


export async function insertDatabase() {
    const db = models.sequelize.models;
    console.log("inserting records to databse....");
    // muon insert bang nao thi db.ten_model cua bang do ex: db.circle, db.parent
    db.user.bulkCreate(
        [
            {
                phoneNumber: '0903322351',
                email: 'cute@gmail.com',
                password: await hashPassword('12341234'),
                nickname: 'cutephomaique',
                address: '123 Quang Trung, Q12, TP Ho Chi Minh, Viet Nam',
                roleId: 2,
            },
            {
                phoneNumber: '0978199199',
                email: 'tho@gmail.com',
                password: await hashPassword('12341234'),
                nickname: 'thobaytmau',
                address: '321 heaven Q12, TP Ho Chi Minh, Viet Nam',
                roleId: 3,
            }
        ]
    );
    db.role.bulkCreate(
        [
            {
                roleName: 'admin',
            },
            {
                roleName: 'parent',
            },
            {
                roleName: 'babysitter',
            },
            {
                roleName: 'staff',
            },
        ]
    )
}