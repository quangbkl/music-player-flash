const $loaded = $('.loaded');
const $played = $('.played');
const $range_load = $('.range_load');
const $src_music = $('#src_music');
const $play_arrow = $('.play_arrow');
const $pause = $('.pause');
const $skip_previous = $('.skip_previous');
const $skip_next = $('.skip_next');
const $time_played = $('.time_played');
const $full_time = $('.full_time');
const $lyrics = $('.lyrics');
const $active_lyrics = $('.active-lyrics');

const changeStyleRange = () => {
    const inputValue = $range_load.val();
    const inputMax = $range_load[0].max;

    $played.css({
        width: inputValue * 100 / inputMax + '%'
    });
}

const onPauseAudio = () => {
    $pause.hide();
    $play_arrow.show();
}

const onPlayAudio = () => {
    $pause.show();
    $play_arrow.hide();
}

const handleClickPlay = () => {
    $src_music[0].play();
}

const handleClickPause = () => {
    $src_music[0].pause();
}

const timeUpdateAudio = () => {
    let currentTime = $src_music[0].currentTime;
    let duration = $src_music[0].duration;

    $range_load[0].max = duration;
    $range_load[0].value = currentTime;

    $time_played.text(formatTime(currentTime));

    changeStyleRange();
}

const handleChangeRange = () => {
    $src_music[0].currentTime = $range_load.val();
    changeStyleRange();
}

const handleLoadedData = () => {
    const duration = $src_music[0].duration;
    $range_load[0].max = duration;
    $full_time.text(formatTime(duration));
}

const progressAudio = () => {
    const buffered = $src_music[0].buffered;
    // console.log(buffered);
    const duration = $src_music[0].duration;
    const currentTime = $src_music[0].currentTime;
    let maxBuffered = currentTime;

    for (let i = 0; i < buffered.length; i++) {
        if (buffered.start(i) <= currentTime && currentTime <= buffered.end(i) && buffered.end(i) > maxBuffered) {
            maxBuffered = buffered.end(i);
        }
    }

    $loaded.css({
        width: maxBuffered * 100 / duration + '%'
    });
}

$play_arrow.click(handleClickPlay);
$pause.click(handleClickPause);

$range_load.on({
    'input': handleChangeRange
});

$src_music.on({
    'timeupdate': timeUpdateAudio,
    'loadeddata': handleLoadedData,
    'progress': progressAudio,
    'pause': onPauseAudio,
    'play': onPlayAudio
})

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

//Format time
function formatTime(time) {
    const secconds = parseInt(time % 60);
    const minute = parseInt(time / 60);

    return (minute < 10 ? '0' : '') + minute + (secconds < 10 ? ':0' : ':') + secconds;
}
//Format time

//Scroll lyrics
$lyrics[0].scrollTop = $active_lyrics.offset().top;
//Scroll lyrics