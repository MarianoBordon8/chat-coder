const socket = io()

let user
let chatBox = document.querySelector('#chatBox')

Swal.fire({
    title: 'Identificate',
    text: 'Ingrese el usuario',
    input: 'text',
    allowOutsideClick: false,
    inputValidator: value => {
        return !value && 'Escriba un nombre de usuario'
    }
}).then(result =>{
    user = result.value
})

chatBox.addEventListener('keyup', evt =>{
    if(evt.key === 'Enter'){
        if(chatBox.value.trim().length > 0){
            socket.emit('message', {user, message: chatBox.value})
            chatBox.value = ''
        }
    }
})

socket.on('messageLogs', data => {
    let messageLogs = document.querySelector('#messageLogs')
    let messages = ''

    data.forEach(element => {
        messages += `
            ${element.user} dice: ${element.message}
            <br>
        `
    })
    messageLogs.innerHTML = messages
})