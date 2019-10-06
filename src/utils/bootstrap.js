import models from '@models';


export function insertDatabase() {
    const db = models.sequelize.models;
    console.log("inserting records to databse....");
    // muon insert bang nao thi db.ten_model cua bang do ex: db.circle, db.parent
    db.user.create(
        {
            phoneNumber: '123412341234',
            email: 'cute@gmail.com',
            password: '12341234',
            nickname: 'cutephomaique',
            address: '123 Quang Trung, Q12, TP Ho Chi Minh, Viet Nam',
            isAdmin: 0
        }
    );
}