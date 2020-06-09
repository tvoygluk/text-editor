import * as $ from 'jquery';

// const myNumber = 42

// console.log(localStorage.getItem('number'))

// localStorage.setItem('number', myNumber);
// console.log(localStorage.getItem('number'))
// localStorage.removeItem('1text_in_editor')
// console.log(localStorage.getItem('number'))


// const myObj = {
//     name: 'Max',
//     age: '30'
// }

// localStorage.setItem('person', JSON.stringify(myObj))

// const raw = localStorage.getItem('person')
// console.log(JSON.parse(raw))

// window.addEventListener('storage', event => {
//     console.log(event)
// })
/*

*/


// заводим переменные под наши задачи
let list = $('#tdlApp ul');
let mask = 'tdl_';
// тут будем хранить внутренний номер документа, чтобы связать список и текст в редакторе
let n_store = 0;
const editor = document.getElementById('editor');

$(editor).on('keyup', function() {
    // записываем содержимое нашего редактора в хранилище, при этом ячейка связана с текущим документом

    localStorage.setItem(n_store.toString() + 'text_in_editor', editor.innerHTML);

} );

(function () {
    editor.style.display = 'none';
    let storage_size = localStorage.length; 
    // если в хранилище что-то есть…

    if (storage_size > 0) {
        // то берём и добавляем это в список документов 
        for (let i = 0; i < storage_size; i++) { // перебор элементов локал сторадж

            let key = localStorage.key(i); // i-тый ключ локального хранилища
/*
            console.log(`${key} - ключ при вызове вызов ${i} раза`)
            console.log('')
            console.log(`${key.indexOf('l_')} что это?`)
            console.log('')
*/
            if ( key.indexOf(mask) == 0 ) { // находим некий i-й ключ в котором есть подстрока 'tdl_'
/*
            console.log(`${key.indexOf(mask)} - это ${i} индекс - срабатывание key.indexOf(mask)=0 для переменной ${mask}`)
            console.log('')
*/
                // запоминаем внутренний номер документа, чтобы правильно показать текст в редакторе

                n_store = key.slice(4).toString(); // мы берём номер после подстроки 'tdl_' и запоминаем его на будущее
// console.log(n_store)
/*
                console.log(`Переменная n_store ${n_store}`)
                console.log('')
*/
                // делаем содержимое хранилища элементами списка

                $('<li></li>').addClass('tdItem')
                .attr('data-itemid', key)
                .text(localStorage.getItem(key))
                .appendTo(list);
                // вот какой элемент получается
                /*
                <ul class="list list-unstyled">
                    <!-- тут появятся наши названия документов, когда мы их добавим -->
                    <li class="tdItem" data-itemid="tdl_1">newDoc</li>
                </ul>
                */
            }
        }
    }
})(); // сразу вызываем при открытии страницы - вдруг в хранилище что-то есть?

$('#tdlApp input').on('keyup',function(e) { // событие кейап в инпуте
    // console.log(e.target.value)
    if ( e.keyCode != 13 ) {
        return; // если НЕ ентер - выйти сразу
    }
    let str = e.target.value; //но если нажал ENTER - сохранённая строка перемещается в переменную str
/*
console.log(e.target.value)
console.log(str)
console.log('')
*/
    e.target.value = "";
    // если в поле ввода было что-то написано — начинаем обрабатывать

    if ( str.length > 0 ) { // если в сохранённой строке что-то есть
        let number_Id = 0; // некоему ай-ди задаём ноль

        list.children().each( function(index, el) { // пройтись по всем детям UL 
            let element_Id = $(el).attr('data-itemid').slice(4); // с 5го элемента взять и посмотреть номер data-itemid="tdl_1" (т.е. цифру)
            if ( Number(element_Id) > Number(number_Id) ) { // если этот номер больше некоего ай-ди
                number_Id = element_Id; // то перезаписываем некий ай-ди
            }
        })
        number_Id = Number(number_Id) + 1; // увеличиваем некий ай-ди на единицу
          // отправляем новый документ сразу в память
        localStorage.setItem( mask + number_Id, str ); // для ключа "tdl_" + "1" записываемзначение из переменной str
        // готовим для него новое поле редактора

        // берём текущий внутренний номер документа

        n_store = number_Id;
// console.log(n_store + 'n_store')
        // отправляем в память 

        localStorage.setItem(n_store + 'text_in_editor','');
        editor.innerHTML = '';
        editor.style.display = "block";

        // добавляем название документа в конец списка

        $('<li></li>').addClass('tdItem')
        .attr('data-itemid', mask + n_store)
        .text(str).appendTo(list);
        // меняем заголовок редактора

// console.log(n_store)
// console.log(document.querySelector(`[data-itemid="tdl_${n_store}"]`).textContent)
        document.getElementById('h1_name').innerHTML = document.querySelector(`[data-itemid="tdl_${n_store}"]`).textContent;
        // localStorage.getItem('tdl_' + n_store);
    }
});


// при клике на названии документа — делаем его активным и даём с ним работать

$(document).on('click','.tdItem', function(e) {
    // находим документ, по которому кликнули

// console.log(n_store)
// console.log(document.querySelector(`[data-itemid="tdl_${n_store}"]`))

    let jet = $(e.target);

    // если при клике был нажат Atl

    if (event.altKey) {

        // то убираем документ из памяти

        localStorage.removeItem(jet.attr('data-itemid'));

        localStorage.removeItem(jet.attr('data-itemid').slice(4) + 'text_in_editor');
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
    n_store = jet.attr('data-itemid').slice(4);

// console.log(jet.attr('data-itemid').slice(4));

    // делаем окно редактора видимым и заполняем его содержимым из памяти
    editor.style.display = "block";
    editor.innerHTML = localStorage.getItem(n_store + 'text_in_editor');
    // меняем заголовок редактора
    document.getElementById('h1_name').innerHTML = document.querySelector(`[data-itemid="tdl_${n_store}"]`).textContent;
});





