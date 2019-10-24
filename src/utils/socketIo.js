var qr = require('socket.io-client')('http://localhost:5000/api/v1/qr');
var test = require('socket.io-client')('http://localhost:5000/api/v1/test');

export const triggerQR = () => {
    qr.on('qrcode', () => {
        console.log('this guys fuck');
    });
};

export const testSocketIo = () => {
    test.emit('testing', { data: 'testData' });
};
    