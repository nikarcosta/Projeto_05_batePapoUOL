let nome = "";
let mensagens = [];
    


perguntarNome();
getMessages();


//FAZ O REQUEST PARA BUSCAR AS MENSAGENS NA API
function getMessages(){
    const promessa =  axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    console.log(promessa);
    promessa.then(carregarDados);
    promessa.catch(errorGettingMessages);
}

//RECEBE OS DADOS DA API E SALVA ELES NO ARRAY DE MENSAGENS
function carregarDados(response){
    console.log(response.data);
    mensagens = response.data;
    printMessages()
}

function errorGettingMessages(erro){
    const statusCode = resposta.status;
    console.log("Failed getting message, error: " + statusCode);
    
}


//IMPRIME AS MENSAGENS NA TELA
function printMessages(){
    const mensagemDisplay = document.querySelector(".container");
    mensagemDisplay.innerHTML = "";

    for(let i = 0; i < mensagens.length; i++){

        if(mensagens[i].type === "status"){
            mensagemDisplay.innerHTML += `<div class="mensagem status">
            <div class="hora">(${mensagens[i].time})</div>
            <div class="texto"> <span>${mensagens[i].from}</span> ${mensagens[i].text}</div>
            </div>`;
        }
            
        else if(mensagens[i].type === "private_message" && (mensagens[i].from === nome) || mensagens[i].to === nome){
            mensagemDisplay.innerHTML += `<div class="mensagem private_message">
            <div class="hora">(${mensagens[i].time})</div>
            <div class="texto"> <span>${mensagens[i].from}</span> reservadamente para <span>${mensagens[i].to}</span>: ${mensagens[i].text}</div>
            </div>`

        }            
            

        else{
            if(mensagens[i].type === "message"){
                mensagemDisplay.innerHTML += `<div class="mensagem">
                <div class="hora">(${mensagens[i].time})</div>
                <div class="texto"> <span>${mensagens[i].from}</span> para <span>${mensagens[i].to}</span>: ${mensagens[i].text}</div>
                </div>`;}
    
        }
            
        const divScroll = document.querySelector(".scroll");
        divScroll.scrollIntoView();
    }
        
}
    
         


//ENVIA MENSAGEM DO USUÁRIO PARA A SALA
function enviarMensagem(){
   
    const mensagem  = document.querySelector(".mensagem-usuario").value;
    const d = new Date();
    let hora = d.toLocaleTimeString();

    const novaMensagem =   {
		from: nome,
		to: "Todos",
		text: mensagem,
		type: "message",
		time: hora
	}

    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", novaMensagem);
    promise.then(getMessages);
    promise.catch(sendMessageError);

}

function sendMessageError(erro){
    const statusCode = erro.status;
    console.log("Send Message error: " + statusCode);
    window.location.reload()
}

function perguntarNome(){
    nome = prompt("Qual é o seu nome?");
    requisitarEntrada(nome);
}

//NOME DO USUÁRIO É ENVIADO PARA O SERVIDOR A FIM DE SER CADASTRADO
function requisitarEntrada(nome){
    
    const sendName = {
        name: nome
    }    

    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", sendName);
    promessa.then(logInSucessfull);
    promessa.catch(logInError);
}


function logInSucessfull(resposta){
    const statusCode = resposta.status;
	console.log("Log in sucessfull: " + statusCode);
}

function logInError(erro){
    const statusCode = erro.response.status;
	console.log("Log in Error: " + statusCode);

    nome = prompt("O nome de usuário já está em uso. Por gentileza, digite outro:");
    requisitarEntrada(nome);

}


//AVISA AO SERVIDOR QUE O USUÁRIO ESTÁ ONLINE
function manterConexao(){
    const userName = {
        name: nome
    }

    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", userName);
    promessa.then(connectionOk);
    promessa.catch(connectionError);

}

function connectionOk(resposta){
    const statusCode = resposta.status;
    console.log("Connection status: " + statusCode);
}

function connectionError(erro){
    const statusCode = erro.status;
    console.log("Connection error: " + statusCode);
}

setInterval(manterConexao,4000);
setInterval(getMessages, 3000);