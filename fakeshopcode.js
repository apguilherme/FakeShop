
// ----------------------------------------------------------------- //

// FAKESHOP: THIS IS JUST A DEMO TO PRACTICE JAVASCRIPT, CSS, HTML AND BOOTSTRAP...

// ----------------------------------------------------------------- //

// VARIÁVEIS

// ----------------------------------------------------------------- //

// variáveis do Local storage: FakeShop salva os itens em Ctrl+Shift+J > Application > Local storage
var itensStored = JSON.parse(getStuffStored('catalogItens')) || [];
var cartStored = JSON.parse(getStuffStored('cartItens')) || [];
var someone = getStuffStored('role');

// variáveis de campos da página
var moreInfoField = document.querySelector('#moreinfo');
var cardsField = document.querySelector('#products');
var saudacaoField = document.querySelector('#saudacao');
var btnAdminAdd = document.querySelector('#btnadd');
var modalField = document.querySelector('#modalbtn');
var foot = document.querySelector('#foot');
var btnInOut = document.querySelector('#inout');

// ----------------------------------------------------------------- //

// FUNÇÕES

// ----------------------------------------------------------------- //

function refreshCartCounter() {
    // atualiza contador visual do carrinho
    document.querySelector('#cartcount').innerHTML = 'Cart(' + (cartStored.length).toString() + ')';
}

function storeStuff(key, value) {
    // salva par chave/valor no Local storage
    return localStorage.setItem(key, value);
}

function getStuffStored(key) {
    // retorna valor armazenado em alguma chave do Local storage
    return localStorage.getItem(key);
}

function hello(person) {
    // faz saudação baseado em quem fez login
    saudacaoField.innerHTML = 'Welcome, ' + person + '!';
}

function appendNewInfo(htmlElement) {
    // adiciona outras informações ao campo de informação
    moreInfoField.innerHTML += htmlElement;
}

function clearAndAddInfo(htmlElement) {
    // limpa campo de informação e adiciona outra informação
    moreInfoField.innerHTML = htmlElement;
}

function inout(txt) {
    // transforma o botão de login em sair, na navbar
    btnInOut.innerHTML = txt;
}

function btnVisible(someone) {
    // altera a visibilidade de botões de acordo com a 'permissão' de quem faz login
    if (someone === 'admin') {
        modalField.setAttribute("style", "visibility: visible;");
        btnAdminAdd.setAttribute("style", "visibility: visible;");
        var del = document.querySelectorAll('.delete');
        for (var i = 0; i < del.length; i++) {
            del[i].setAttribute("style", "visibility: visible;");
        }
        inout('Quit');
    }
    else if (someone === 'user') {
        modalField.setAttribute("style", "visibility: hidden;");
        btnAdminAdd.setAttribute("style", "visibility: hidden;");
        var del = document.querySelectorAll('.delete');
        for (var i = 0; i < del.length; i++) {
            del[i].setAttribute("style", "visibility: hidden;");
        }
        inout('Quit');
    }
    else {
        modalField.setAttribute("style", "visibility: hidden;");
        btnAdminAdd.setAttribute("style", "visibility: hidden;");
        var del = document.querySelectorAll('.delete');
        for (var i = 0; i < del.length; i++) {
            del[i].setAttribute("style", "visibility: hidden;");
        }
        inout('Login');
    }
}

function rolesView() {
    // ajusta a página para visualização do administrador, usuário ou visitante
    someone = getStuffStored('role');
    if (someone === 'admin') {
        hello(someone);
        btnVisible(someone);
    }
    else if (someone === 'user') {
        hello(someone);
        btnVisible(someone);
    }
    else {
        hello('Visitor');
        btnVisible('visitor');
    }
}

function needRequest() {
    // verifica a necessidade de realizar a request
    if (itensStored.length == 0) { ajaxRequest(); } // se estiver vazio, faz requisição
    else { renderItens(itensStored); } // caso contrário, renderiza o que tem armazenado no Local storage
}

function ajaxRequest() {
    // realiza requisição e salva em 'itens'
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://apguilherme.github.io/JSONforTest/jsontest.json');
    xhr.send(null);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            itensStored = JSON.parse(xhr.responseText);
            renderItens(itensStored);
        }
        else {
            renderError();
        }
    }
}

function renderItens(lista) {
    // mostra os itens presentes na lista passada como parâmetro
    cardsField.innerHTML = '';
    if (lista === itensStored) {
        for (item of lista) {
            cardsField.innerHTML +=
                '<div class="border-primary col-lg-3 col-md-6 col-sm-12" id="cards">' +
                '<div class="card">' +
                '<img class="card-img-top" src=' + item.img + '>' +
                '<div class="card-body">' +
                '<h5 class="card-title">' + item.name + '</h5>' +
                '<p class="card-text">' + item.desc + '<br><span class="badge badge-danger"> $ ' + parseFloat(item.price).toFixed(2) + '</span>' +
                '<span class="badge badge-pill badge-light"><i class="fas fa-tags"></i> ' + item.cat + '</span></p>' +
                '<a class="delete btn btn-primary" onclick=deleteFromCatalog(' + item.id + ') href="#" style="visibility: hidden;">Delete <i class="far fa-trash-alt"></i></a>' +
                '<a onclick=addToCart(' + item.id + ') href="#" class="btn btn-success">Buy <i class="fas fa-shopping-cart"></i></a>' +
                '</div>' +
                '</div>' +
                '</div>';
        }
        foot.innerHTML = '';
    }
    else if (lista === cartStored) {
        var tot = 0; // soma total da compra
        for (item of lista) {
            cardsField.innerHTML +=
                '<div class="d-inline card border-primary cartitem">' +
                '<h5>' + item.name + ' #' + item.id + '</h5>' +
                '<p>' + item.desc + '</p><hr>' +
                '<p>Quantity: ' + item.quantidade + '</p>' +
                '<p>$ ' + (item.price * 1).toFixed(2) + ' x ' + item.quantidade + ' = $ ' + (item.price * item.quantidade).toFixed(2) + '</p><hr>' +
                '<a href="#" onclick="deleteFromCart(' + item.id + ')" class="btn btn-primary">Remove <i class="far fa-trash-alt"></i></a><img src="' + item.img + '"/img>' +
                '</div>';
            tot += (item.price * item.quantidade);
        }
        foot.innerHTML = '<hr><h3>Total: $ ' + tot.toFixed(2).toString() + '</h3><p>Or 10x $ ' + (tot / 10).toFixed(2).toString() + '<hr>';
    }
}

function renderError() {
    // mensagem em caso de erro na requisição
    cardsField.innerHTML = '<div class="alert alert-danger" role="alert">Something went wront with the AJAX requisition.<br>Try to turn AdBlock off and refresh the page.</div>';
}

function addToCatalog() {
    // add produto à lista 'itens'
    if (document.getElementById('name').value.toString() != '') {
        if (document.getElementById('desc').value.toString() != '') {
            if (typeof Number(document.getElementById('price').value) == 'number') {
                if (document.getElementById('cat').value.toString() != 'Cateory...') {
                    if (document.getElementById('img').value.toString() != '') {
                        var prod = {
                            "id": itensStored.length * 10 + 1,
                            "name": document.getElementById('name').value,
                            "desc": document.getElementById('desc').value,
                            "price": document.getElementById('price').value,
                            "cat": document.getElementById('cat').value,
                            "img": document.getElementById('img').value
                        };
                        itensStored.push(prod);
                        resetForm("formAdd");// limpa form
                        storeStuff('catalogItens', JSON.stringify(itensStored));
                        renderItens(itensStored);
                        rolesView();
                        addCartSuccess();
                    } else { addCartError('Link to image'); }
                } else { addCartError('Category'); }
            } else { addCartError('Price'); }
        } else { addCartError('Description'); }
    } else { addCartError('Name'); }
}

function addCartError(field) {
    // mostra uma mensagem de erro se algum campo estiver em branco
    document.querySelector('#errorlog').innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert">Field <b>' + field.toString() + '</b> is necessary.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
}

function addCartSuccess(field) {
    // mostra uma mensagem de erro se algum campo estiver em branco
    document.querySelector('#errorlog').innerHTML = '<div class="alert alert-success alert-dismissible fade show" role="alert">Product added to catalog!<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
}

function addToCart(productId) {
    // retorna o elemento do catálogo (itensStored) com id igual aquele a ser incluído no carrinho
    var toadd = itensStored.filter(function (value) { return value.id == productId });
    toadd = { ...toadd, quantidade: 0 }; // adiciona campo 'quantidade' = 0 ao item

    var existe = 0; // anota que item pode não existir no carrinho

    for (var i=0; i<cartStored.length; i++){
        if (cartStored[i].id === productId){ // se item já existir no carrinho, incrementa sua quantidade e anota sua existência
            cartStored[i].quantidade += 1;
            existe = 1; // anota que item existe no carrinho
        }
    }
    if (cartStored.length === 0 || existe === 0){ // armazena o primeiro item OU o item ainda inexistente (existe=0) no carrinho
        var prod = { "id": toadd[0].id, "name": toadd[0].name, "desc": toadd[0].desc, "price": toadd[0].price, "cat": toadd[0].cat, "img": toadd[0].img, "quantidade": 1 };
        cartStored.push(prod);
    }
    
    storeStuff('cartItens', JSON.stringify(cartStored));
    refreshCartCounter();
    appendNewInfo('<div class="alert alert-success alert-dismissible fade show" role="alert"><b>' + toadd[0].name + '</b> added to cart!<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
}

function deleteFromCatalog(productId) {
    // retorna os elementos com ids diferentes daquele a ser deletado do catálogo
    var prod = itensStored.filter(function (value, index, arr) { return value.id == productId; });
    itensStored = itensStored.filter(function (value, index, arr) { return value.id != productId; });
    appendNewInfo('<div class="alert alert-warning" alert-dismissible fade show"><b>' + prod[0].name + '</b> removed from catalog.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
    storeStuff('catalogItens', JSON.stringify(itensStored));
    renderItens(itensStored);
    rolesView();
}

function deleteFromCart(productId) {
    // retorna os elementos com ids diferentes daquele a ser deletado do carrinho
    var prod = cartStored.filter(function (value, index, arr) { return value.id == productId; });
    cartStored = cartStored.filter(function (value, index, arr) { return value.id != productId; });
    appendNewInfo('<div class="alert alert-warning" alert-dismissible fade show"><b>' + prod[0].name + '</b> removed from cart.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
    storeStuff('cartItens', JSON.stringify(cartStored));
    renderItens(cartStored);
    refreshCartCounter();
}

function resetForm(formId) {
    // limpa o form que tem o id passado
    document.getElementById(formId).reset();
}

function showLogin() {
    // mostra o form de login caso o visitante não tenha logado
    // ou mostra o form de login e uma mensagem que saiu com sucesso (pois nesse caso o texto do botão era Sair)
    foot.innerHTML = '';
    cardsField.innerHTML = '';
    clearAndAddInfo('');
    if (someone === 'user' || someone === 'admin') { // user ou admin, o botão clicado tinha o texto de Sair
        storeStuff('role', 'visitante'); // remove o tipo de usuário do Local storage
        appendNewInfo('<div class="alert alert-warning" alert-dismissible fade show"><b>You logged out.</b><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
        rolesView();
    }
    appendNewInfo('<h1>Login</h1><div id="form"><div class="form-group"><label for="username">User</label><input type="text" class="form-control" id="username" placeholder="Username"></div><div class="form-group"><label for="userpassword">Password</label><input type="password" class="form-control" id="userpassword" placeholder="Password"></div><button class="btn btn-primary" onclick="login()">Login</button></div><div class="alert alert-info" role="info"><b>Attention! Use the following:</b><br>User: admin, Password: 123<br>User: user, Password: 123<br><b><br>This is not a real authentication.</b></div>');
}

function showCart() {
    // mostra a visualização do carrinho
    clearAndAddInfo('<h1>Your cart</h1>');
    renderItens(cartStored);
    rolesView();
    if (someone === 'user') {
        appendNewInfo('<a href="#" class="container btn btn-success" onclick="pay()"><b>Pay</b> <i class="fab fa-bitcoin"></i></a>');
    }
}

function pay() {
    // função chamada quando usuário clica em Pagar dentro da tela do carrinho
    clearAndAddInfo('<h1>Your cart</h1>');
    appendNewInfo('<div class="progress"><div id="mybar" class="progress-bar" role="progressbar" style="width: 1%;" aria-valuenow="1%" aria-valuemin="0" aria-valuemax="100"></div></div>');
    appendNewInfo('<div class="alert alert-primary" role="alert"><b>Thank you!</b></div>');
    loadEffect('#mybar');
}

function loadEffect(id){
    // cria efeito de carregamento em barra de progresso
    var elm = document.querySelector(id);
    var width = 1;
    var id = setInterval(grow, 10);
    function grow() {
        if (width >= 100) {
            clearInterval(id);
        } else {
            width++;
            elm.style.width = width + '%';
        }
    }
}

function showHome() {
    // mostra a página inicial/catálogo
    clearAndAddInfo('<h1>Good shop!</h1>');
    renderItens(itensStored);
    rolesView();
    foot.innerHTML = '';
}

function login() {
    // faz autenticação consultando o role armazenado em Local storage
    var rol = document.getElementById('username').value; // recupera usuário e senha
    var pass = document.getElementById('userpassword').value;

    storeStuff('role', rol); // atualiza o role no Local storage
    rol = getStuffStored('role');

    if (rol === 'admin' && pass === '123') {
        hello('Admin');
        showHome();
    }
    else if (rol === 'user' && pass === '123') {
        hello('User');
        showHome();
    }
    else {
        clearAndAddInfo('<div class="alert alert-danger">User not found. try again.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div></div>');
        appendNewInfo('<h1>Login</h1><div id="form"><div class="form-group"><label for="username">User</label><input type="text" class="form-control" id="username" placeholder="Username"></div><div class="form-group"><label for="userpassword">Password</label><input type="password" class="form-control" id="userpassword" placeholder="Password"></div><button class="btn btn-primary" onclick="login()">Login</button></div><div class="alert alert-info" role="info"><b>Attention! Use the following:</b><br>User: admin, Password: 123<br>User: user, Password: 123<br><b><br>This is not a real authentication.</b></div>');
    }
}

// ----------------------------------------------------------------- //

// CHAMADA INICIAL DE FUNÇÕES

// ----------------------------------------------------------------- //

needRequest();
rolesView();
clearAndAddInfo('<h1>Good shop!</h1>');
refreshCartCounter();
showHome();

// ----------------------------------------------------------------- //

