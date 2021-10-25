const socket=io();
const chatForm=document.getElementById('chat-form');
const chatMessages=document.querySelector('.chat-messages');
const roomName=document.getElementById('room-name');
const userList=document.getElementById('users');
//Get username and room from URl

const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
});
//Join chatroom
socket.emit('joinRoom',{username,room});
//Get room and users
socket.on('roomUsers',({room,users}) => {
    outputRoomName(room);
    outputUsers(users);
});


//Message From Server
socket.on('message',message=>{
    console.log(message);
    outputMessage(message);

    //SCroll down to the bottom of the chat page
    chatMessages.scrollTop=chatMessages.scrollHeight;
})

//message submit
chatForm.addEventListener('submit', (e) =>{
    e.preventDefault();
//get message text
    const msg=e.target.elements.msg.value;
    //emit message to the server
    socket.emit('chatMessage',msg);

    //clear our inputs
    e.target.elements.msg.value='';
    
    e.target.elements.msg.focus();
});


//output message to DOM
function outputMessage(message){
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML= `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text};
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//Add Room name to DOm
function outputRoomName(room){
    roomName.innerText=room;
}
//Add users to DOm Sidebar Basically
function outputUsers(users){
    userList.innerHTML=`
    ${users.map(user=>`<li>${user.username}</li>`).join('')}`;
}