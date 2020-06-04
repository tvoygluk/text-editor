import '../styles/styles.scss';
// import $ from "jquery";
import '../../node_modules/bootstrap/dist/js/bootstrap.bundle';

const editor = document.getElementById('editor');

// если в нашем хранилище уже что-то есть…
if (localStorage.getItem('text_in_editor') !== null) {
    // …то отображаем его содержимое в нашем редакторе
    editor.innerHTML = localStorage.getItem('text_in_editor');
}
  
// отслеживаем каждое нажатие клавиши и при каждом нажатии выполняем команду
editor.addEventListener('keyup', function() {
    console.log(editor.innerHTML);
    // записываем содержимое нашего редактора в хранилище
    localStorage.setItem('text_in_editor', editor.innerHTML);
});