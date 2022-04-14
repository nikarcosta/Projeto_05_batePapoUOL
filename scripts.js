let nome = "";
let mensagens = [];
let privacy = "";
let paraUsuario = "";
    


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

    paraUsuario = destinatarioMensagem();
   
    const mensagem  = document.querySelector(".mensagem-usuario").value;
    const d = new Date();
    let hora = d.toLocaleTimeString();

    const novaMensagem =   {
		from: nome,
		to: paraUsuario,
		text: mensagem,
		type: privacy,
		time: hora
	}

    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", novaMensagem);
    promise.then(getMessages);


}

function destinatarioMensagem(){
    let destinatario;

    const privado = prompt("É uma mensagem privada? S para sim ou N para não");

    if(privado === "S"|| privado === "s"){
        destinatario = prompt("Digite o nome do usuário para o qual a mensagem deve ser entregue:");
        privacy = "private_message";
        return destinatario;

    }else if(privado === "N" || privado === "n"){
        destinatario = "Todos";
        privacy = "message"
        return destinatario;
    }
}


function errorGettingMessages(erro){
    console.log("Failed getting message");
    const statusCode = resposta.status;

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
    promessa.then(entrou);
    promessa.catch(tratarErro);
}


function entrou(resposta){
    alert("Você está logado");
    const statusCode = resposta.status;
	console.log(statusCode);
}

function tratarErro(erro){
    const statusCode = erro.response.status;
	console.log(statusCode);

    nome = prompt("O nome de usuário já está em uso. Por gentileza, digite outro:");
    requisitarEntrada(nome);

}


//AVISA AO SERVIDOR QUE O USUÁRIO ESTÁ ONLINE
function manterConexao(){
    const userName = {
        name: nome
    }

    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", userName);

}

setInterval(manterConexao,4000);
setInterval(getMessages, 3000);