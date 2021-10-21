var baseURL = 'https://soumax.com.br/api';
function login(){
    var numero = $("#numero").val();
    localStorage.setItem("numero_do_usuario",numero)
    $.post(`${baseURL}/login.php`,{
        numero : numero
    },function(resposta){
        if (resposta == "registado") {
            login()
        }else{
            localStorage.setItem("ID",resposta)
            location.href='comecar.html'
        }
    })
}

function logOut(){
    localStorage.clear("ID");
}


function pegarLocalizacaoAtual() {
    navigator.geolocation.getCurrentPosition(function (position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        localStorage.setItem("latitude_atual", latitude)
        localStorage.setItem("longitude_atual", longitude)
        map.flyTo([latitude, longitude], 17);
        layerGroup.clearLayers();
        // create markers
        var marker = L.marker([latitude, longitude]).addTo(layerGroup);
        marker.bindPopup("Sua localização atual").openPopup()
    }, function (error) {
        swal(error.message)
    }, {
        enableHighAccuracy: true,
    });
}



function guardarInformacoes(tipo){
    var nome = $("#nome").val();
    var numero = $("#numero").val();
    if (numero.length == 0 || nome.length == 0) {
        swal({icon:"info",title:"Preencha todos os campos"})
    }else{
        if (tipo == "receber") {
            localStorage.setItem("nome_do_rementente", nome)
            localStorage.setItem("numero", numero)
            localStorage.setItem("tipo", tipo);
            location.href = 'local_da_entrega.html'
        }else{
            localStorage.setItem("nome", nome)
            localStorage.setItem("numero", numero)
            localStorage.setItem("tipo", tipo);
            location.href = 'local_da_entrega.html'
        }
    }
}

function confirmarSelecaoDeEndereco(){
    var origem = $("#origem").val();
    var destino = $("#destino").val();
    if (origem.length == 0 || destino.length == 0) {
        swal({ icon: "info", title: "Preencha todos os campos" })
    }else{
        localStorage.setItem("origem", origem)
        localStorage.setItem("destino", destino)
        location.href = 'confirmar.html';
    }
}

//Cartões de crédito
var tbCartoes = localStorage.getItem("tbCartoes");// Recupera os dados armazenados
tbCartoes = JSON.parse(tbCartoes); // Converte string para objeto
if (tbCartoes == null){
    tbCartoes = [];
} // Caso não haja conteúdo, iniciamos um vetor vazio
    
function adicionarCartao(){
    var numero = $("#cartao").val();
    var nome = $("#nome").val();
    var data = $("#data").val();
    var tipo_de_cartao = $("#tipo").val();
    var bandeira = $("#bandeira").val();
    var CVV = $("#CVV").val();
    if (numero.length == 0 || nome.length == 0 || data.length == 0 || tipo_de_cartao == "Selecione o tipo de cartão" || bandeira == "Selecione a bandeira" || CVV.length == 0) {
        swal({icon:"info", title:"Preencha todos os campos"})
    }else{
        var cartao = JSON.stringify({
            nome: nome,
            numero: numero,
            data: data,
            tipo: tipo_de_cartao,
            bandeira: bandeira,
            CVV: CVV
        })
        tbCartoes.push(cartao)
        localStorage.setItem("tbCartoes", JSON.stringify(tbCartoes))
        swal({icon:"success",title:"Cartão adicionado com sucesso!"}).then(function(){
            window.location.reload();
        })
    }
}

function mostrarCartoes(){
    if (tbCartoes.length == 0) {
        $('.card-container').html(`
        <div class="card-item" onclick="$('.modal-adicionar-cartao').css('display','flex')">
            <img src='${(cartao.bandeira == "Mastercard") ? "img/mastercard.svg" : "img/visa.svg"}'>
            <label for="">Adicionar cartão</label>
        </div>
        `)
    }else{
        $('.card-container').html("")
        for (var i in tbCartoes) {
            var cartao = JSON.parse(tbCartoes[i]);
            $('.card-container').append(`
            <hr style='margin-top:8px;'>
            <div class="card-item" onclick='$(".cartao-${i}").css("display","flex")'>
                <img src='${(cartao.bandeira == "Mastercard") ? "img/mastercard.svg" : "img/visa.svg"}' >
                <label for="">${cartao.bandeira} ${cartao.CVV}</label>
            </div>
            <div class='modal-cartao cartao-${i}'>
                <div class='modal-cartao-buttons animate__animated animate__fadeInUp'>
                    <button onclick='eliminarCartao(${i})'>Eliminar <i class="fa fa-trash"></i></button>
                    <button onclick='$(".cartao-${i}").css("display","none")'>Fechar <i class="fa fa-window-close"></i></button>
                </div>
            </div>
        `)
        }
        $('.card-container').append(`
        <hr style='margin-top:5px;'>
        <div class="card-item" onclick="$('.modal-adicionar-cartao').css('display','flex')">
            <i class="fa fa-credit-card"></i>
            <label for="">Adicionar cartão</label>
        </div>
        `)
    }
}

function eliminarCartao(ID){
    tbCartoes.splice(ID, 1);
    localStorage.setItem("tbCartoes", JSON.stringify(tbCartoes));
    swal({icon:"success",title:"Cartão excluído."}).then(function(){
        location.reload()
    });
}

//Detalhes para confirmar a encomenda
function buscarListaDeEntregadores(){
    var tipo_de_entrega = $("#tipo_de_entrega").val()
    $.post(`${baseURL}/filtrar_lista_de_entregadores.php`,{
        tipo : tipo_de_entrega,
        latitude : localStorage.getItem("latitude_atual"),
        longitude: localStorage.getItem("longitude_atual")
    },function(response){
        if (response.length == 0) {
            $("#selecionar_entregador").html('<option value>Nenhum entregador foi encontrado</option>')
        }else{
            $("#selecionar_entregador").html("<option value>Selecione o entregador</option>");

            response.map((entregador) =>{
                $("#selecionar_entregador").append(`
                <option value='${entregador.ID}'>${entregador.nome} | ${entregador.tipo_de_veiculo}</option>
                `)
            })
        }
    })
}

function buscarListaDeCartoes(){
    if (tbCartoes.length == 0) {
    } else {
        $('#selecionar-cartao').html("<option value>Selecione o metodo de pagamento</option>")
        for (var i in tbCartoes) {
            var cartao = JSON.parse(tbCartoes[i]);
            $('#selecionar-cartao').append(`
            <option value='${i}'>${cartao.bandeira} ${cartao.CVV}</option>
        `)
        }
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


//Confirmar Encomenda

function buscarPrecoDaCorrida() {
   var origem = localStorage.getItem("origem")
   var destino = localStorage.getItem("destino")
    var id_do_entregador = $("#selecionar_entregador").val();
    var tipo_de_entrega = $("#tipo_de_entrega").val();
    var cartao = $('#selecionar-cartao').val();
    var origem = localStorage.getItem("origem");
    var destino = localStorage.getItem("destino");
    var tipo_de_entrega = $("#tipo_de_entrega").val();
    if (tipo_de_entrega.length == 0 || id_do_entregador.length == 0 || cartao.length == 0) {
        swal({ icon: "info", title: "Por favor verique e tente novamente" })
    } else {
        var latitudeDestino;
        var longitudeDestino;
        var latitudeOrigem;
        var longitudeOrigem;
        $.post(`https://nominatim.openstreetmap.org/search?q=${origem}&format=json`,function(resposta){
            latitudeOrigem = resposta[0].lat;
            longitudeOrigem = resposta[0].lon;
            $.post(`https://nominatim.openstreetmap.org/search?q=${destino}&format=json`, function (response) {
                latitudeDestino = response[0].lat;
                longitudeDestino = response[0].lon;
                $.post(`${baseURL}/buscar_preco_da_corrida.php`,{
                    latitudeOrigem : latitudeOrigem,
                    longitudeOrigem : longitudeOrigem,
                    latitudeDestino : latitudeDestino,
                    longitudeDestino : longitudeDestino
                },function(preco_da_corrida){
                    $('.modal-preco-da-corrida').css("display","flex")
                    $('.valor').html('R$' + numberWithCommas(preco_da_corrida));
                    localStorage.setItem("valor",preco_da_corrida);
                })
            })
        })
    }
}

function confirmarEncomenda(){
    var id_do_entregador = $("#selecionar_entregador").val();
    var tipo_de_entrega = $("#tipo_de_entrega").val();
    var cartao = $('#selecionar-cartao').val();
    var origem = localStorage.getItem("origem");
    var destino = localStorage.getItem("destino");
    var nome = localStorage.getItem("nome");
    var numero = localStorage.getItem("numero");
    var tipo_de_entrega = $("#tipo_de_entrega").val();
    var valor = localStorage.getItem('valor');
    if (tipo_de_entrega.length == 0 || id_do_entregador.length==0 || cartao.length == 0) {
        swal({icon:"info",title:"Por favor verique e tente novamente"})
    }else{
        $(".processamento-container").css("display","flex")
        for (var i in tbCartoes) {
            if (i == cartao) {
                var cartao = JSON.parse(tbCartoes[i]);
                var nome_cartao = cartao.nome;
                var numero_cartao = cartao.numero;
                var data = cartao.data;
                var tipo_de_cartao = cartao.tipo;
                var bandeira = cartao.bandeira;
                var CVV = cartao.CVV;
                $.post(`${baseURL}/confirmar_encomenda.php`,{
                    nome : nome,
                    origem : origem,
                    destino : destino,
                    numero : numero,
                    nome_cartao : nome_cartao,
                    numero_cartao : numero_cartao,
                    data : data,
                    tipo_de_cartao : tipo_de_cartao,
                    bandeira : bandeira,
                    CVV : CVV,
                    id_do_entregador : id_do_entregador,
                    tipo_de_entrega : tipo_de_entrega,
                    valor : valor,
                    ID_do_usuario : localStorage.getItem("ID"),
                    numero_do_remetente : localStorage.getItem("numero_do_remetente"),
                    nome_do_remetente: localStorage.getItem("nome_do_remetente"),
                    tipo: localStorage.getItem("tipo")
                },function(response){
                    if (response[0].mensagem == "sucesso") {
                        swal({ icon: "success", "title": "Sucesso", text: "O seu pedido foi feito com sucesso" }).then(function () {
                            location.replace("dashboard.html");
                        })
                    }else{
                        $(".processamento-container").css("display", "none")
                        swal(response);
                    }
                })
            }
        }
    }
}

//ACOMPANHAMENTO DE ENTREGAS
function buscarEstadoDeCorridas(){
    $.post(`${baseURL}/estado_de_corridas_ativas.php`,{
        ID : localStorage.getItem("ID")
    },function(resposta){
        if (resposta > 0) {
            $('.footer-acompanhar-pedido').css("display","flex")
        }else{
            $('.footer-acompanhar-pedido').css("display", "none")
        }
    })
}
function buscarListaDeCorridasActivas(){
    $.post(`${baseURL}/lista_de_corridas.php`,{
        ID: localStorage.getItem("ID")
    },function(resposta){
        var dados = resposta;
        $('.corridas-box').html(``);
        for (let i = 0; i < dados.length; i++) {
            $('.corridas-box').append(`
                <div class="corrida-item">
                    <span>${dados[i].identificador_da_corrida}</span>
                    <button onclick='acompanharCorrida("${dados[i].identificador_da_corrida}")'>Acompanhar</button>
                </div>
            `)
        }
        $('.modal-lista-de-corridas').css('display','flex')
    })
}

function acompanharCorrida(identificador_da_corrida){
    localStorage.setItem("identificador_da_corrida",identificador_da_corrida)
    location.href = "acompanhar.html";
}

function buscarLocalizacaoDoEntregador(){
    $.post(`${baseURL}/buscar_localizacao_do_entregador.php`,{
        identificador_da_corrida : localStorage.getItem("identificador_da_corrida")
    },function(resposta){
        var latitude = resposta[0].latitude;
        var longitude = resposta[0].longitude;
            map.flyTo([latitude, longitude], 17);
            layerGroup.clearLayers()
            var marker = L.marker([latitude, longitude]).addTo(layerGroup);
            marker.bindPopup("Localização do entregador").openPopup()
    })
}

function buscarInformacoesDoEntregador(){
    $.post(`${baseURL}/buscar_localizacao_do_entregador.php`, {
        identificador_da_corrida: localStorage.getItem("identificador_da_corrida")
    }, function (response) {
        $("#nome").html(response[0].nome)
        $("#imagem").attr("src", response[0].imagem)
        $("#veiculo").html(response[0].tipo_de_veiculo)
        $("#placa").html(response[0].placa_da_mota)
        $("#ligar-entregador").attr("href", `tel:${response[0].celular}`)
        $("#enviar-mensagem-entregador").attr("href", `sms:${response[0].celular}`)
    })
}

//Endereços
function verificarExistenciaDeEndereco(){
    if (localStorage.getItem("Casa") != null) {
        $("#texto-casa").html("Alterar endereço de casa")
    }
    if (localStorage.getItem("localDeTrabalho") != null) {
        $("#texto-local-de-trabalho").html("Alterar endereço do local de trabalho")
    }
}
function definirCasa(){
    var casa = $("#txtCasa").val();
    if (casa.length == 0) {
        swal({icon:"info",title:"Preencha corretamente"})
    }else{
        localStorage.setItem("Casa",casa)
        swal({ icon: "success", title: "Casa definida com sucesso" }).then(() => {
            location.reload();
        })
    }
}

function definirLocalDeTrabalho() {
    var localDetrabalho = $("#txtLocalDeTrabalho").val();
    if (localDetrabalho.length == 0) {
        swal({ icon: "info", title: "Preencha corretamente" })
    } else {
        localStorage.setItem("localDeTrabalho", localDetrabalho)
        swal({icon:"success",title:"Local de trabalho definido com sucesso"}).then(() =>{
            location.reload();
        })

    }
}
var tipoDeEndereco = "";
function mostrarModalDeEnderecos(tipo){
    if (localStorage.getItem("Casa") != null || localStorage.getItem("localDeTrabalho") != null) {
        $("#enderecos").css("display",'flex');
       tipoDeEndereco = tipo
    }
}

function selecionarEnderecoNoModal(tipoEndereco){
  if (tipoDeEndereco == "origem") {
      $("#origem").val((tipoEndereco == "casa") ? localStorage.getItem("Casa") : localStorage.getItem("localDeTrabalho"))
      $("#enderecos").css("display", 'none');
  }else if(tipoDeEndereco == "destino"){
      $("#destino").val((tipoEndereco == "casa") ? localStorage.getItem("Casa") : localStorage.getItem("localDeTrabalho"))
      $("#enderecos").css("display", 'none');
  }
}