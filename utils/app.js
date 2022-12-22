var socket = io('http://localhost:3000', {
    transports: ['websocket'],
    withCredentials: true,
});

async function renderMessage(message) {
    await $('.texto-mensagens').append('<div class="envia"><strong>' + message.users.from + '</strong>:' + message.message + '</div><br>');
}
async function renderMessageTo(message) {
    await $('.texto-mensagens').append('<div class="recebe"><strong>' + message.users.to + '</strong>:' + message.message + '</div><br>');
}

$('.form').submit(function(event) {
    event.preventDefault();
    let id = $(this).attr("id");
    let from = $('input[name=email]').val();
    let to = $(`#${id}`).find(`input[name=emailTo]`).val();
    let toDo = $('input[name=toDo]').val(`${to}`);
    let mensagemObj = {
        users: {
            from: from,
            to: to,
            }
        };
        $('.texto-mensagens').html("");
        socket.emit('escolhaPessoa', mensagemObj);
    });

socket.on('previousMessage', async function(msgsDatabase) {
    for (let i = 0; i < msgsDatabase.length; i++) {
        const from = msgsDatabase[i]['users']['from'];
        const to = msgsDatabase[i]['users']['to'];
        const message = msgsDatabase[i]['message'];
        let objdatabase = {
            message: message,
            users: {
                from: from,
                to: to,
            }
        };
        await renderMessage(objdatabase);
        await renderMessageTo(objdatabase);
    }
}); 

socket.on('receveidMessage', async function(msgsDatabase) {
    await renderMessage(msgsDatabase);
    await renderMessageTo(msgsDatabase);
});

$('#chat').submit(function(event) {
    event.preventDefault();
    let from = $('input[name=email]').val();
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
        renderMessage(mensagemObj);
        renderMessageTo(mensagemObj);
        socket.emit('sendMessage', mensagemObj);
        $('input[name=mensagem]').val("");
    }
});