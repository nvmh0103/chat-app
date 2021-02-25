
// store users
const users= [];

// add user

const addUser= ( {id ,username, room} ) => {
    // clean data, validate

    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // validate
    if (!username || !room ) {
        return {
            error: 'Username and room are required!',
        }
    }

    // check for existing user
    const existingUser = users.find(( user ) => {
        return user.room === room && user.username === username;
    })

    // validate username
    if (existingUser) {
        return {
            error: 'Username has been used!',
        }
    }
    
    // store user
    const user = { id, username, room};
    users.push(user);
    return { user };

}

// remove user

const removeUser= (id) => {
    const index= users.findIndex( (user) => {
        return user.id === id;
    })

    if ( index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// get user 
const getUser = (id) => {
    return users.find( (user) => {
        return user.id===id;
    })
}

// get users in a room

const getUserInARoom= (room) => {
    const userList=[];
    users.forEach( (user) => {
        if (user.room===room){
            userList.push(user);
        }
    })
    return userList;
}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUserInARoom,
}
