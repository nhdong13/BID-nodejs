var io = require('socket.io-client')('http://localhost:5000/api/v1/socket');

export const reload = (notification) => {
    console.log(
        'PHUC: reload -> notification  ------ chay vao reload roi',
        notification,
    );

    io.emit('reload', notification);
};
