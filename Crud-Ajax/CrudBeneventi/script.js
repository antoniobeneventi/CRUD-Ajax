function chiamata(url) {
    $.ajax({
        url: url,
        dataType: 'json', //restituisce un oggetto JSON
        success: function (responsedata) {
            response = responsedata;
            console.log(response);
            displayTable(response["_embedded"]["employees"]);
        }
    });
}
function page() {
    var pag = response["page"]["number"];

    console.log(pag);
    if (pag == 0) {
        $("#prima").hide();
        $("#prece").hide();

    }
    if (pag == 1) {
        $("#prima").show();
        $("#prece").show();
    }

    if (pag + 1 == response["page"]["totalPages"]) {
        $("#prece").show();
        $("#prima").show();
        $("#ult").hide();
        $("#succ").hide();
    }
    else {

        $("#ult").show();
        $("#succ").show();
    }
}


var id;
var nextId = 10006;
var btnModifica = "<button class='btn btn-primary ms-5 modifica' data-bs-toggle='modal' data-bs-target='#modal-modify'>Modifica</button>";
var btnElimina = "<button class='btn btn-danger elimina'>Elimina</button>";
var response = null;

var url = 'http://localhost:8080/employees';



$(document).ready(

    chiamata(url),
    //displayTable(),
);

function displayTable(data) {
    var dipendente;

    $("tbody").html("");

    $.each(data, function (i, value) {
        dipendente += '<tr>';
        dipendente += '<th scope="row">' + value.id + '</th>';
        dipendente += '<td>' + value.firstName + '</td>';
        dipendente += '<td>' + value.lastName + '</td>';
        dipendente += '<td data-id=' + value.id + '>' + btnElimina + btnModifica + '</td>';
        dipendente += '</tr>';

        $("#pag").html(response["page"]["number"] + 1);// per far visiualizzare il numero di pagine
        page();

    });
    $("tbody").append(dipendente);

    $(".modifica").click(function () {
        id = $(this).parent().data("id");

        for (var i = 0; i < data.length; i++) {
            if (id == data[i].id) {
                $("#nome-m").val(data[i].firstName);
                $("#cognome-m").val(data[i].lastName);
            }
        }
    });

    $("#modifica").click(function () {
        var nome = $("#nome-m").val();
        var cognome = $("#cognome-m").val();

        console.log(id);

        $.get(url + "/" + id, function (data) {
            console.log(data);
            data.firstName = nome;
            data.lastName = cognome;
            $.ajax({
                type: "PUT", //aggiornare 
                url: url + '/' + id,
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "JSON",
                success: function (data) { displayTable(url + "?page=" + dati['page']['number'] + "&size=20"); }//e se ha successo(significa che è stata cancellata) si da la url all display table
            })
        })

    });

    $(".elimina").click(function () {
        $(this).parents("tr").fadeOut("fast");

        var id = $(this).parent().data("id");//si prende id dell'utente selezionato

        $.ajax({
            url: url + '/' + id,
            type: "delete",
            success: function (data) { displayTable(url + "?page=" + dati['page']['number'] + "&size=20"); }//e se ha successo(significa che è stata cancellata) si da la url all display table
        })

    });
}



$('#succ').click(function () {
    var next = response["_links"]["next"]["href"];
    console.log(next);
    chiamata(next);

});

$('#prima').click(function () {
    var next = response["_links"]["first"]["href"];
    console.log(next);
    chiamata(next);
});

$('#ult').click(function () {
    var next = response["_links"]["last"]["href"];
    console.log(next);
    chiamata(next);
});

$('#prece').click(function () {
    var next = response["_links"]["prev"]["href"];
    console.log(next);
    chiamata(next);
});

$("#aggiungi").click(function () {
    var nome = $("#nome").val();
    var cognome = $("#cognome").val();

    $("#nome").val("");
    $("#cognome").val("");


    $.ajax({
        type: "POST",
        url: url,

        data: JSON.stringify({
            birthDate: "",
            firstName: nome,
            gender: "M",
            hireDate: "",
            lastName: cognome
        }),

        contentType: "application/json",
        dataType: 'json',

        success: function () {
            var last = response["_links"]["last"]["href"];
            chiamata(last);
        }
    });
    //creo un nuovo oggetto
    var dipendente = {
        "id": "",
        "birthDate": "",
        "firstName": nome,
        "lastName": cognome,
        "gender": "",
        "hireDate": "",
    }
    displayTable();
});