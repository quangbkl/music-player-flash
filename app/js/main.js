const baseUrl = 'http://localhost/API/music';

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
const $list_music = $('.list-music');

let list_lyrics = [];

const changeStyleRange = () => {
    const inputValue = $range_load.val();
    const inputMax = $range_load[0].max;

    $played.css({
        width: inputValue * 100 / inputMax + '%'
    });
}

const scrollLyric = (scroll) => {
    $lyrics.animate({
        scrollTop: $lyrics[0].scrollTop + scroll + 'px'
    }, 500, "swing");
}

const setSrcAudio = (srcAudio) => {
    $src_music[0].pause();
    setTimeout(() => {
        $src_music[0].src = srcAudio;
    }, 5);
}

let previousTime = 0;
const changeActiveList = () => {
    const currentTime = $src_music[0].currentTime;
    // console.log(currentTime);
    let lengthScroll = 0;
    let eActiveLyric = null;

    list_lyrics.map(lyric => {
        const timeLyrics = parseFloat(lyric.start, 10);

        if (currentTime >= timeLyrics && timeLyrics > previousTime) {
            $('li').removeClass('active-lyrics');
            let activeLyric = lyric.start.replace('.', '_');
            eActiveLyric = $('#' + activeLyric);
            // $lyrics[0].scrollTop = 0;
            // console.log($('#' + activeLyric).offset().top);
            lengthScroll = $('#' + activeLyric).offset().top;
            // scrollLyric($('#' + activeLyric).offset().top - 200);

            // console.log(lyric);
            // console.log(currentTime, timeLyrics, previousTime);
            previousTime = timeLyrics;
        }
    });
    // console.log(lengthScroll);
    if (eActiveLyric !== null) {
        eActiveLyric.addClass("active-lyrics");
        // console.log("Active");
    }

    if (lengthScroll !== 0) {
        scrollLyric(lengthScroll);
    }
    // console.log(currentTime);
}

const setCurrentTime = (newTime) => () => {
    $src_music[0].currentTime = newTime;
    previousTime = 0;
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
    changeActiveList();
}

const handleChangeRange = () => {
    $src_music[0].currentTime = $range_load.val();
    previousTime = $range_load.val();
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
// $lyrics[0].scrollTop = $active_lyrics.offset().top;
// $lyrics[0].animate({
//     scrollTop: $active_lyrics.offset().top
//   }, 5000, function() {
//     // Animation complete.
//   });
//Scroll lyrics

//List music
const setMusic = (id) => () => {
    getMusic(id);
}

const setListMusic = (listMusic) => {
    if (listMusic.hasOwnProperty('success') && listMusic.success === true) {
        // $list_music.remove('LI');

        listMusic.data.map(music => {
            createItemMusic(music);
        })
    }
    // console.log(listMusic);
}

function createItemMusic(data_music) {
    // console.log(data_music.name);
    const itemMusic = document.createElement("LI");
    itemMusic.innerHTML = data_music.name;
    itemMusic.onclick = setMusic(data_music.id);
    $list_music.append(itemMusic);
}

const createLyric = (lyric) => {
    const itemLyric = document.createElement("LI");

    itemLyric.id = lyric.start.replace('.', '_');
    itemLyric.innerHTML = `<p>${lyric.english}</p>\
    <small>\
        <p>${lyric.vietnamese}</p>\
    </small>`;

    itemLyric.onclick = setCurrentTime(lyric.start);

    $lyrics.append(itemLyric);
}

const createLyrics = (lyrics) => {
    if (lyrics.hasOwnProperty('success') && lyrics.success === true) {
        $(".lyrics li").remove();
        lyrics.data[0].lyrics.map(lyric => {
            createLyric(lyric);
        })
    }
}
//List music

//Services

getListMusic();
// getMusic('BKL');

function getListMusic() {
    $.get(baseUrl + "/list-musics.php", function (result) {
        setListMusic(result);
    })
}

function getMusic(id) {
    const data_music = {
        id,
    }

    $.post(baseUrl + "/music.php", data_music, function (result) {
        // list_lyrics = result.data[0].lyrics;
        createLyrics(result);
        setSrcAudio(result.data[0].src);
    })
}
//Services