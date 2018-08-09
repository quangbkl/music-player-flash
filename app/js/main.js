const $loaded = $('.loaded');
const $played = $('.played');
const $range_load = $('.range_load');
const $src_music = $('#src_music');
const $play_arrow = $('.play_arrow');
const $pause = $('.pause');
const $skip_previous = $('.skip_previous');
const $skip_next = $('.skip_next');

const handleChangeRange = () => {
    const inputValue = $range_load.val();
    const inputMax = $range_load[0].max;

    $played.css({
        width: inputValue * 100 / inputMax + '%'
    });
}

const handleClickPlay = () => {
    console.log("Play");
    $src_music[0].play();
    $pause.show();
    $play_arrow.hide();
}

const handleClickPause = () => {
    console.log("pause");
    $src_music[0].pause();
    $pause.hide();
    $play_arrow.show();
}

$play_arrow.click(handleClickPlay);
$pause.click(handleClickPause);

$range_load.on({
    'input': handleChangeRange
});



//Bottom menu
var menuIndex = 2;
showMenu(menuIndex);

function plusSlides(n) {
    showMenu(menuIndex += n);
}

function currentSlide(n) {
    showMenu(menuIndex = n);
}

function showMenu(n) {
    var i;
    var slides = document.getElementsByClassName("item");
    var buttonItem = document.getElementsByClassName("material-icons");
    if (n > slides.length) { menuIndex = 1 }
    if (n < 1) { menuIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < buttonItem.length; i++) {
        buttonItem[i].className = buttonItem[i].className.replace(" active", "");
    }
    slides[menuIndex - 1].style.display = "block";
    buttonItem[menuIndex - 1].className += " active";
}
//Bottom menu   