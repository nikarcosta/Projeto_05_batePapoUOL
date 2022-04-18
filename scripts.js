let nome = "";
let mensagens = [];
let participantes = [];
let contatoSelecionado = "";
let paraUsuario = "Todos";
let privacidadeEscolhida = "message";
    
function logInButton(){
    document.querySelector(".entrar").classList.add("escondido");
    document.querySelector(".carregando").classList.remove("escondido");
    setTimeout(requisitarEntrada,2000);
}


//CADASTRA E LOGA O USUÁRIO NA SALA DE BATE-PAPO
function requisitarEntrada(){
   
    nome = document.querySelector(".userName").value;

    if(nome === ""){
        alert("Digite seu nome");
        document.querySelector(".entrar").classList.remove("escondido");
        document.querySelector(".carregando").classList.add("escondido");   
        return;
    }

    const sendName = {
        name: nome
    }    

    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", sendName);
    promessa.then(logInSucessfull);
    promessa.catch(logInError);
}


function logInSucessfull(resposta){

    getMessages();
    buscarParticipantes();

    setInterval(manterConexao,4000);    
    setInterval(getMessages, 3000);
    setInterval(buscarParticipantes, 10000);

    const statusCode = resposta.status;
	console.log("Log in sucessfull: " + statusCode);

    document.querySelector(".logIn-Page").classList.add("escondido");
    document.querySelector(".sala-BatePapo").classList.remove("escondido");
}


function logInError(erro){
    const statusCode = erro.response.status;
	console.log("Log in Error: " + statusCode);

    alert("O nome de usuário já está em uso. Por gentileza, digite outro");
    document.querySelector(".userName").value = "";
    document.querySelector(".entrar").classList.remove("escondido");
    document.querySelector(".carregando").classList.add("escondido");

}


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

    if(mensagem === ""){
        return;
    }

    //APAGA INPUT FIELD
    document.querySelector(".mensagem-usuario").value = "";


    const d = new Date();
    let hora = d.toLocaleTimeString();

    const novaMensagem =   {
		from: nome,
		to: paraUsuario,
		text: mensagem,
		type: privacidadeEscolhida,
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
    alert("Você foi desconectado");
    window.location.reload();
}

// PERMITE O ENVIO DE MENSAGENS COM A TECLA ENTER
document.querySelector(".mensagem-usuario").addEventListener('keydown', function(e){
    if (e.key === "Enter") { 
        enviarMensagem();
        }
});


//ABRE A SIDEBAR
function showSidebar(){
    document.querySelector(".sidebar").classList.remove("escondido");
    document.querySelector(".contatos-privacidade").classList.remove("escondido");
}


//FECHA A SIDEBAR
function closeSidebar(){
    document.querySelector(".sidebar").classList.add("escondido");
    document.querySelector(".contatos-privacidade").classList.add("escondido");
}


//BUSCA LISTA DE PARTICIPANTES DO CHAT
function buscarParticipantes(){

    const promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    console.log(promessa);
    promessa.then(carregarParticipantes);
    promessa.catch(errorGettingParticipants);
    
}

function carregarParticipantes(response){
    console.log(response.data);
    let temp = response.data;


    console.log(participantes);
      

    let result2 = temp.filter(person => participantes.every(person2 => !person2.name.includes(person.name)))
    console.log(result2);

    participantes = [];
    participantes = result2;

    console.log(participantes);    

    printParticipantes();
}

function errorGettingParticipants(erro){
    const statusCode = resposta.status;
    console.log("Failed getting participants list, error: " + statusCode);
    
}


//IMPRIME LISTA DE PARTICIPANTES
function printParticipantes(){
    const contatosDisplay = document.querySelector(".contatos");
    
    for(let i = 0; i < participantes.length; i++){
            contatosDisplay.innerHTML += `<div class="nome-contato" onclick="selecionaContato(this)"><div><ion-icon name="person-circle"></ion-icon></div><div class="nomeParticipante">${participantes[i].name}</div><div class="icon"><ion-icon name="checkmark-outline"></ion-icon></div></div>`;
    }
    
}


//SELECIONA CONTATO PARA MANDAR MENSAGEM
function selecionaContato(nomeContato){
    let contatoSelected = document.querySelector(".contatos").querySelector(".selecionado");
    
    if(contatoSelected !== null){
        contatoSelected.classList.remove("selecionado");
    }
    
    nomeContato.classList.add("selecionado");
    paraUsuario = document.querySelector(".selecionado > .nomeParticipante").innerHTML;
    console.log(paraUsuario);

    dadosMensagem()
}


//SELECIONA O TIPO DE MENSAGEM (PRIVADA OU PÚBLICA)
function selecionaPrivacidade(tipoPrivacidade){
   
    let privacidadeSelected = document.querySelector(".tipos-privacidade").querySelector(".selecionado");
    
    if(privacidadeSelected !== null){
        privacidadeSelected.classList.remove("selecionado");
    }
    
    tipoPrivacidade.classList.add("selecionado");
    let privacidadeEscolha = document.querySelector(".selecionado > .privacidade").innerHTML;
    console.log(privacidadeEscolha);
    privacidadeEscolhida = corrigindoPrivacidade(privacidadeEscolha);

    dadosMensagem()
}


//CONVERTE O TIPO DE PRIVACIDADE ANTES DE MANDAR PARA A API
function corrigindoPrivacidade(elemento){

    if(elemento === "Público"){
        return "message";
    }
    if(elemento === "Reservadamente"){
        return "private_message";
    }

}

//INFORMA NO CAMPO DE MENSAGEM PARA QUEM A MENSAGEM ESTÁ SENDO ENVIADA
function dadosMensagem(){

    let setPrivacidade = privacidadeEscolhida;

    if(privacidadeEscolhida === "message"){
        setPrivacidade = "Público";
    }else {
        setPrivacidade = "Reservadamente";
    }

    let trocarDados = document.querySelector(".enviando-para").innerHTML = "";
    trocarDados = document.querySelector(".enviando-para").innerHTML = `Enviando para ${paraUsuario} (${setPrivacidade})`;

}