const $loaded = $('.loaded');
const $played = $('.played');
const $range_load = $('.range_load');

const handleChangeRange = () => {
    const inputValue = $range_load.val();
    const inputMax = $range_load[0].max;

    $played.css({
        width: inputValue * 100 / inputMax + '%'
    });
}

$range_load.on({
    'input': handleChangeRange
});

