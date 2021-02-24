const socket= io();

// socket.on('countUpdated', (count) => {
//     console.log('Updated!',count);

// })
// document.querySelector('#increment').addEventListener('click', () => {
//     socket.emit('increment');
// })
socket.on('sendMessage', (value) => {
    console.log(value);
})

const form=document.querySelector('#form-input');
const value=document.querySelector('#inputValue');
document.querySelector('#submit').addEventListener('click', (e) => {
    e.preventDefault()
    socket.emit('sendMessage',value.value, (error) =>{
        if (error){
            return console.log(error);
        }
        console.log('Message delivered!')
    });
})
document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported!');
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
        }, () => {
            console.log('Location shared!')
        });
    })
})
