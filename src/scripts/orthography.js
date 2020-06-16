const ready = () => {

    // эта функция получает наш результат проверки орфографии
    // eslint-disable-next-line no-undef
    fix_spell = (data) => {
        data.forEach( (elem) => {

        // она находит наше поле ввода по имени
        // вместо textContent было value - можно доработать
        document.getElementById('editor').innerHTML = document.getElementById('editor').innerHTML.replace(
            elem['word'],
            elem['s'][0] || elem['word']
            );

            // и меняет всё на правильные слова без ошибок
            
        });
    }
}

document.addEventListener("DOMContentLoaded", ready);

function createCaretPlacer(atStart) { // https://stackoverflow.com/questions/4233265/contenteditable-set-caret-at-the-end-of-the-text-cross-browser
    return function(el) {
        el.focus();
        if (typeof window.getSelection != "undefined"
                && typeof document.createRange != "undefined") {
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(atStart);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (typeof document.body.createTextRange != "undefined") {
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(atStart);
            textRange.select();
        }
    };
}

// var placeCaretAtStart = createCaretPlacer(true);
var placeCaretAtEnd = createCaretPlacer(false);

const myFun = () => {
    placeCaretAtEnd(document.getElementById('editor'));
};

const loadScript = (src, cb) => {
    let js_script = document.createElement('script');
    js_script.type = "text/javascript";
    js_script.src = src;
    js_script.async = true;
    document.getElementsByTagName('head')[0].appendChild(js_script);

    js_script.onload = () => cb();
    setTimeout(() => js_script.remove(), 10000);

  }


// обработчик нажатия на клавиши
document.addEventListener('keydown', (e) => {

    // если нажат пробел или энтер
    if ( (e.keyCode == 32) || (e.keyCode == 13) ) {

        if ( document.getElementById('editor') ) {

            // делим текст на строки
            let lines = document.getElementById('editor').innerHTML.replace(/\r\n|\n\r|\n|\r/g, "\n").split("\n");
            
            // и обрабатываем каждую строчку:
            lines.forEach( (line) => {
                if (line.length) {
                    
                    // отправляем строку со словами на проверку в Спеллер, результат сразу отправляется в функцию fix_spell
                    //   $.getScript('http://speller.yandex.net/services/spellservice.json/checkText?text=' + line + '&callback=fix_spell');
                    
                // loadScript(`http://speller.yandex.net/services/spellservice.json/checkText?text=${line}&callback=fix_spell`, myFun)

                    
                        
                        let js_script = document.createElement('script');
                        js_script.type = "text/javascript";
                        js_script.src = 'http://speller.yandex.net/services/spellservice.json/checkText?text=' + line + '&callback=fix_spell';
                        js_script.async = true;
                        document.getElementsByTagName('head')[0].appendChild(js_script);
                        
                        setTimeout(() => js_script.remove(), 10000);

                        setTimeout(() => placeCaretAtEnd(document.getElementById('editor')), 1000); 
                    
                }
            });
        }
        
        // setTimeout(() => placeCaretAtEnd(document.getElementById('editor')), 1000);
    }
});
