const socket= io();

socket.on('countUpdated', (count) => {
    console.log('Updated!',count);

})
document.querySelector('#increment').addEventListener('click', () => {
    socket.emit('increment');
})