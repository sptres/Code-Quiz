function renderScores() {
    var scores = JSON.parse(window.localStorage.getItem('scores')) || [];

    scores.sort(function (a, b) {
        return b.score - a.score;
    });

    for (var i = 0; i < scores.length; i += 1) {
        var list = document.createElement('li');
        list.textContent = scores[i].initials + ' - ' + scores[i].score;

        var scoresEl = document.getElementById('scores');
        scoresEl.appendChild(list);
    }
}

function clearAllScores() {
    window.localStorage.removeItem('scores');
    window.location.reload();
}

document.getElementById('clear').onclick = clearAllScores;

renderScores();