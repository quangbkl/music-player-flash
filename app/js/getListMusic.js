const baseUrl = 'https://rankgroupqd.000webhostapp.com/list-musics';

const $loaded = $('.loaded');
const $played = $('.played');
const $range_load = $('.range_load');
// const $src_music = $('#src_music');
const $play_arrow = $('.play_arrow');
const $pause = $('.pause');
const $skip_previous = $('.skip_previous');
const $skip_next = $('.skip_next');
const $time_played = $('.time_played');
const $full_time = $('.full_time');
const $lyrics = $('.lyrics');
const $englishLyrics = $('.english-lyrics');
const $active_lyrics = $('.active-lyrics');
const $list_music = $('.list-music');

let list_lyrics = [];

const ghostAudio = {
    currentTime: 0,
    duration: 3600,
    isPlay: false
}

// function autoUpdateTime () {
//     if (ghostAudio.isPlay) {
//         ghostAudio.currentTime += 0.01;
//         timeUpdateAudio();
//     }

//     runtimeAudio();
// }

function autoUpdateTime(time) {
    if (ghostAudio.isPlay) {
        ghostAudio.currentTime = Math.round(ghostAudio.currentTime * 10 + time) / 10;
        // console.log("Timer");

        console.log(ghostAudio.currentTime);
        timeUpdateAudio();
    }

    // console.log("AAAA");

    // runtimeAudio();
}

// function runtimeAudio() {
//     setTimeout(autoUpdateTime, 100);
// }
// runtimeAudio();

var lastUpdate = new Date().getTime();

setInterval(function () {
    var thisUpdate = new Date().getTime();
    var diff = (thisUpdate - lastUpdate);
    diff = Math.round(diff / 100);
    autoUpdateTime(diff);
    lastUpdate = thisUpdate;
}, 100);

// setInterval(autoUpdateTime, 10);

const scrollLyric = (scroll) => {
    $lyrics.animate({
        scrollTop: $lyrics[0].scrollTop + scroll + 'px'
    }, 500, "swing");
}

let previousTime = 0;
const changeActiveList = () => {
    const currentTime = ghostAudio.currentTime;
    let lengthScroll = 0;
    let eActiveLyric = null;

    list_lyrics.map(lyric => {
        const timeLyrics = parseFloat(lyric.start, 10);

        if (currentTime >= timeLyrics && timeLyrics > previousTime) {
            $('li').removeClass('active-lyrics');
            let activeLyric = lyric.start.replace('.', '_');
            eActiveLyric = $('#' + activeLyric);
            lengthScroll = $('#' + activeLyric).offset().top;
            previousTime = timeLyrics;
        }
    });

    if (eActiveLyric !== null) {
        eActiveLyric.addClass("active-lyrics");
    }

    if (lengthScroll !== 0) {
        scrollLyric(lengthScroll);
    }
}

const setCurrentTime = (newTime) => () => {
    const time = parseFloat(newTime);
    const roundTime = Math.round(time * 100) / 100;
    ghostAudio.currentTime = roundTime;
    previousTime = 0;
    timeUpdateAudio();
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
    ghostAudio.isPlay = true;
    onPlayAudio();
}

const handleClickPause = () => {
    ghostAudio.isPlay = false;
    onPauseAudio();
}

const timeUpdateAudio = () => {
    let currentTime = ghostAudio.currentTime;

    $time_played.text(formatTime(currentTime));

    changeActiveList();
}

$play_arrow.click(handleClickPlay);
$pause.click(handleClickPause);
$skip_previous.click(() => {
    ghostAudio.currentTime -= 10;
    if (ghostAudio.currentTime < 0) ghostAudio.currentTime = 0;
    timeUpdateAudio();
})
$skip_next.click(() => {
    ghostAudio.currentTime += 10;
    timeUpdateAudio();
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

//List music
const setMusic = (id) => () => {
    getMusic(id);
}

const setListMusic = (listMusic) => {
    if (listMusic.hasOwnProperty('success') && listMusic.success === true) {
        listMusic.data.map(music => {
            createItemMusic(music);
        })
    }
}

function createItemMusic(data_music) {
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
        list_lyrics = result.data[0].lyrics;
        createLyrics(result);
    })
}
//Services