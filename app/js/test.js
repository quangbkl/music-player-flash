let listSub = [];

$subtitles = $('#subtitles-container span');

$subtitles.map(item => {
    let sub = {
        'start': $subtitles[item].dataset.start
    }

    let child = $subtitles[item].getElementsByTagName('small')[0];
    sub.vietnamese = child.innerText.trim();

    $subtitles[item].removeChild(child);
    
    sub.english = $subtitles[item].innerText.trim();

    listSub.push(sub);
});

$subtitles.remove();

$('#text')[0].innerText = JSON.stringify(listSub);

console.log(listSub);

// console.log($subtitles[0].dataset.start);

// console.log($subtitles);