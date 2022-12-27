var socket = io('http://localhost:3000', {
    transports: ['websocket']
});

async function renderMessage(froming) {
    await $('.texto-mensagens').append('<div class="recebe"><strong>' + froming['users']['from'] + '</strong>:' + froming['message'] + '</div><br>');
}

$('.form').submit(function(event) {
    event.preventDefault();
    let id = $(this).attr("id");
    let groupName = $(`#${id}`).find(`input[name=toGroup]`).val();
    console.log(id, groupName);

    $('.texto-mensagens').html("");
    socket.emit('escolhaGrupo', groupName);
});

socket.on('previousMessageGroup', async function(msgsDatabase) {
    if (msgsDatabase.length > 0) {
        for (let i = 0; i < msgsDatabase.length; i++) {
            const msgRender = msgsDatabase[i];

            if (msgRender != null) {
                await renderMessage(msgRender);
            }else {
                console.log('Msg deu undefined');
            }
        }
    }else {
        $('.texto-mensagens').append('<div class="noMessage"><strong>' + 'Inicie uma conversa!' + '</strong></div><br>');
        setTimeout(function() { 
            $('.noMessage').html("");
        }, 3000);
    }
}); 

$('#chat').submit(function(event) {
    event.preventDefault();
    let from = $('input[name=user]').val();
    let toDos = $('input[name=toDo]').val();
    let message = $('input[name=mensagem]').val();
    
    if (from.length && message.length) {
        let mensagemObj = {
            message: message,
            users: {
                from: from,
                to: toDos,
            }
        };
        socket.emit('sendMessage', mensagemObj);
        $('input[name=mensagem]').val("");
    }
});

socket.on('receveidMessage', async function(msgAdd) {
    await renderMessage(msgAdd);
});