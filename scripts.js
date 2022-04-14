let nome = "";
let mensagens = [];


perguntarNome();
getMessages();


//FAZ O REQUEST BUSCAR AS MENSAGENS NA API
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


//PRINT AS MENSAGENS NA TELA
function printMessages(){
    const mensagemDisplay = document.querySelector(".container");
    mensagemDisplay.innerHTML = "";

    for(let i = 0; i < mensagens.length; i++){

        if(mensagens[i].type === "status"){

            mensagemDisplay.innerHTML += `<div class=".mensagem status">
            <div class=".hora">${mensagens[i].time}</div>
            <div class=".texto">${mensagens[i].from} ${mensagens[i].text}</div>
            </div>`;

            
        }else if(mensagens[i].type === "private_message"){
            mensagemDisplay.innerHTML += `<div class=".mensagem private_message">
            <div class=".hora">${mensagens[i].time}</div>
            <div class=".texto">${mensagens[i].from} reservadamente para ${mensagens[i].to}: ${mensagens[i].text}</div>
            </div>`;


        }else{
            mensagemDisplay.innerHTML += `<div class=".mensagem">
            <div class=".hora">${mensagens[i].time}</div>
            <div class=".texto">${mensagens[i].from} para ${mensagens[i].to}: ${mensagens[i].text}</div>
            </div>`;
        }

        
 
    }

   
}

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

    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages");
    //mensagens.push(novaMensagem);
    promise.then(getMessages);


}

function errorGettingMessages(erro){
    console.log("Failed getting message");
    const statusCode = resposta.status;

}


function perguntarNome(){
    nome = prompt("Qual é o seu nome?");
    requisitarEntrada(nome);
}

function requisitarEntrada(nome){
    
    const sendName = {
        name: nome
    }    

    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", sendName);
    promessa.then(entrou);
    promessa.catch(tratarErro);
}


function entrou(resposta){
    alert("Você está logado");
    const statusCode = resposta.status;
	console.log(statusCode);
    //setInterval(verificarStatus,4000);
}

function tratarErro(erro){
    const statusCode = erro.response.status;
	console.log(statusCode);

    nome = prompt("O nome de usuário já está em uso. Por gentileza, digite outro:");
    requisitarEntrada(nome);

}

function verificarStatus(nome){
    console.log(nome);
    const checkUsuario = {
        name: nome
    }

    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", checkUsuario);
    promessa.then(onlineStatus);
    promessa.catch(offlineStatus);
}

function onlineStatus(respVerStatus){
    alert("Usuário online");
}

function offlineStatus(erro){
    alert("Erro");
    console.log(erro.response.status);
}

//setInterval(verificarStatus, 4000);