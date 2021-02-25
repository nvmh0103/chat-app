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
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML;

//options
const { username, room } =Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // get new message
    const newMessage = messages.lastElementChild

    // get height of the new message
    const newMessageStyles = getComputedStyle(newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

    // visible height
    const visibleHeight= messages.offsetHeight;

    // height of messages window
    const containerHeight= messages.scrollHeight;

    // scroll offset
    const scrollOffset= messages.scrollTop + visibleHeight;

    if ( containerHeight - newMessageHeight <= scrollOffset) {
        messages.scrollTop = messages.scrollHeight;
    }

}

// disable send button if there was nothing
message.addEventListener('input', () =>{

    if (message.value==''){
        button.setAttribute('disabled','disabled');
    } else {
        button.removeAttribute('disabled');
    }
})


socket.on('sendMessage', (message) => {
    console.log(message);
    const html= Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('hh:mm A'),
        username: message.username,
    });
    messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
})

socket.on('roomData', ( {room,users}) => {
    const html= Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html;
})

socket.on('locationMessage', (location) => {
    const html= Mustache.render(locationTemplate, {
        url: location.url,
        createdAt: moment(location.createdAt).format('hh:mm A'),
        username: location.username,

    });
    messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
})

document.querySelector('#submit').addEventListener('click', (e) => {
    e.preventDefault();
    //disable
    button.setAttribute('disabled','disabled')
    socket.emit('sendMessage', message.value, (error) =>{
        //enable
        // button.removeAttribute('disabled');
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

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href ='/';
    }
});