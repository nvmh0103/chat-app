const socket= io();

//elements

const form = document.querySelector('#form-input');
const message = document.querySelector('#inputValue');
const button = document.querySelector('#submit');
const locationButton = document.querySelector('#send-location');
const messages = document.querySelector('#message');

//templates

const messageTemplate=document.querySelector('#message-template').innerHTML;
const locationTemplate=document.querySelector('#location-template').innerHTML;

socket.on('sendMessage', (message) => {
    console.log(message);
    const html= Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('hh:mm A'),
    });
    messages.insertAdjacentHTML('beforeend', html);
})

socket.on('locationMessage', (location) => {
    const html= Mustache.render(locationTemplate, {
        url: location.url,
        createdAt: moment(location.createdAt).format('hh:mm A'),

    });
    messages.insertAdjacentHTML('beforeend', html);
})

document.querySelector('#submit').addEventListener('click', (e) => {
    e.preventDefault();
    //disable
    button.setAttribute('disabled','disabled');

    socket.emit('sendMessage', message.value, (error) =>{
        //enable
        button.removeAttribute('disabled');
        message.value='';
        message.focus();


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
    // disable
    locationButton.setAttribute('disabled','disabled');

    navigator.geolocation.getCurrentPosition((position) => {
        // enable
        locationButton.removeAttribute('disabled');

        socket.emit('sendLocation', {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
        }, () => {
            console.log('Location shared!')
        });
    })
})
