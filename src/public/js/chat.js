const socket = io();

socket.on('chat_messages', (data) => {
    render(data);
});

function render(message) {
  if (Array.isArray(message)) {
    message.forEach((messages) => {
      renderMessage(messages);
    });
  } else if (message) {
    renderMessage(message);
  }
}

function renderMessage(message) {
  const messagesContainer = document.getElementById('messagesContainer');

    const newMessage = document.createElement('div');
    newMessage.className = 'flex max-w-[376px] rounded-[10px] mb-[21px] px-[14px] bg-[#777]';
    newMessage.innerHTML = `
      <div class="ml-[12px] mt-[7px] flex flex-col">
        <div class="flex">
          <h2 class="font-medium text-[12px] text-white-500">${message.user}</h2>
          <h2 class="font-medium text-[12px] text-[#999] ml-[5px]">${message.date}</h2>
        </div>
        <p class="pt-[2px] text-[#D1D1D1] max-w-[250px] pb-[12px] font-medium text-[12px] break-words">${message.message}</p>
      </div>`;

      messagesContainer.appendChild(newMessage);

      messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

const addMensajes = () => {
  const fechaFormateada = moment().format('YYYY-MM-DD HH:mm');

  const msj = {
      name: document.getElementById('name').value,
      text: document.getElementById('message').value,
      date: fechaFormateada
  };

  socket.emit('new_message', msj);
};
