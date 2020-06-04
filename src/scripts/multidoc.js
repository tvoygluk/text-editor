import * as $ from 'jquery';


/*
const editor = document.getElementById('editor');

// если в нашем хранилище уже что-то есть…
if (localStorage.getItem('text_in_editor') !== null) {
    // …то отображаем его содержимое в нашем редакторе
    editor.innerHTML = localStorage.getItem('text_in_editor');
}
  
// отслеживаем каждое нажатие клавиши и при каждом нажатии выполняем команду
$(editor).on('keyup', function() {
    console.log(editor.innerHTML);
    // записываем содержимое нашего редактора в хранилище
    localStorage.setItem('text_in_editor', editor.innerHTML);
});
*/

// заводим переменные под наши задачи
let List = $('#tdlApp ul');
let Mask = 'tdl_';
// тут будем хранить внутренний номер документа, чтобы связать список и текст в редакторе
let N_store = 0;
const editor = document.getElementById('editor');

$(editor).on('keyup', function() {
    // записываем содержимое нашего редактора в хранилище, при этом ячейка связана с текущим документом

    localStorage.setItem(N_store + 'text_in_editor', editor.innerHTML);

} );

(function () {
    editor.style.display = 'none';
    let Storage_size = localStorage.length;
    // если в хранилище что-то есть…

    if (Storage_size > 0) {
        // то берём и добавляем это в список документов 
        for (var i = 0; i < Storage_size; i++) {

            var key = localStorage.key(i);
            if(key.indexOf(Mask) == 0) {

                // запоминаем внутренний номер документа, чтобы правильно показать текст в редакторе

                N_store = key[4];
                // делаем содержимое хранилища элементами списка

                $('<li></li>').addClass('tdItem')
                .attr('data-itemid', key)
                .text(localStorage.getItem(key))
                .appendTo(List);
            }
        }
    }
})();

$('#tdlApp input').on('keyup',function(e) {

    if(e.keyCode != 13) return;
    let str = e.target.value;
    e.target.value = "";
    // если в поле ввода было что-то написано — начинаем обрабатывать

    if(str.length > 0) {
        let number_Id = 0;

        List.children().each(function(index, el) {
            let element_Id = $(el).attr('data-itemid').slice(4);
            if (element_Id > number_Id) number_Id = element_Id;
        })
        number_Id++;
          // отправляем новый документ сразу в память
        localStorage.setItem(Mask+number_Id,str);
        // готовим для него новое поле редактора

        // берём текущий внутренний номер документа

        N_store = number_Id;

        // отправляем в память 

        localStorage.setItem(N_store + 'text_in_editor','');
        editor.innerHTML = '';
        editor.style.display = "block";

        // добавляем название документа в конец списка

        $('<li></li>').addClass('tdItem')
        .attr('data-itemid', Mask+number_Id)
        .text(str).appendTo(List);
        // меняем заголовок редактора

        document.getElementById('h1_name').innerHTML = localStorage.getItem('tdl_' + N_store);
    }
});


// при клике на названии документа — делаем его активным и даём с ним работать

$(document).on('click','.tdItem', function(e) {
    // находим документ, по которому кликнули

    let jet = $(e.target);

    // если при клике был нажат Atl

    if (event.altKey) {

        // то убираем документ из памяти

        localStorage.removeItem(jet.attr('data-itemid'));

        localStorage.removeItem(jet.attr('data-itemid')[4] + 'text_in_editor');
        editor.innerHTML = '';
        editor.style.display = "none";
        // меняем заголовок редактора
        document.getElementById('h1_name').innerHTML = 'Текстовый редактор с автосохранением';
        // и убираем документ из списка
        jet.remove();
        // выходим из функции, чтобы не обрабатывать обычный клик
        return true;
    }

    // обрабатываем обычный клик — делаем документ активным
    // получаем внутренний номер документа
    N_store = jet.attr('data-itemid')[4];
    // делаем окно редактора видимым и заполняем его содержимым из памяти
    editor.style.display = "block";
    editor.innerHTML = localStorage.getItem(N_store + 'text_in_editor');
    // меняем заголовок редактора
    document.getElementById('h1_name').innerHTML = localStorage.getItem('tdl_' + N_store);
});





