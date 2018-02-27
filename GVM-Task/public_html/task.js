document.addEventListener('DOMContentLoaded', function () {
    var elm = document.getElementById('scrollContent');
    elm.addEventListener('scroll', callFuntion);
    var array = ['<div class="col-lg-3" style="background-color: red;height: 200px">5</div><div class="col-lg-2" style="background-color: royalblue;height: 200px">5</div><div class="col-lg-2" style="background-color: #23527c;height: 200px">5</div><div class="col-lg-2" style="background-color: window;height: 200px">5</div><div class="col-lg-3" style="background-color: tomato;height: 200px">5</div>', '<div class="col-lg-4" style="background-color: bisque;height: 200px">3</div><div class="col-lg-4" style="background-color: #204d74;height: 200px">3</div><div class="col-lg-4" style="background-color: #faf2cc;height: 200px">3</div>', '<div class="col-lg-6" style="background-color: white;height: 200px">2</div><div class="col-lg-6" style="background-color: blueviolet;height: 200px">2</div>'];
    var arrayBefore;

    function callFuntion() {
        var scrollHeight = elm.scrollHeight;
        var scrollTop = elm.scrollTop;
        var clientHeight = elm.clientHeight;
        arrayBefore = array;
        if (scrollHeight >= clientHeight) {
            array = shuffleArray(array);
            while (arrayBefore[0] == array[2]) {
                array = shuffleArray(array);
            }
            elm.innerHTML += array[0] + array[1] + array[2];
        }
    }
    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
});