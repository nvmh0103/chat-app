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
    socket.emit('sendMessage',value.value);
})