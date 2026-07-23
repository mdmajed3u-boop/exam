let timeInSeconds = 30 * 60; // 30 mins
const timerElement = document.getElementById('timer');

const countdown = setInterval(() => {
    let minutes = Math.floor(timeInSeconds / 60);
    let seconds = timeInSeconds % 60;

    seconds = seconds < 10 ? '0' + seconds : seconds;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    timerElement.textContent = `${minutes}:${seconds}`;

    if (timeInSeconds <= 0) {
        clearInterval(countdown);
        alert("সময় শেষ! আপনার উত্তরপত্র স্বয়ংক্রিয়ভাবে জমা হয়ে যাবে।");
        submitExam();
    }
    timeInSeconds--;
}, 1000);

function submitExam() {
    const form = document.getElementById('examForm');
    const formData = new FormData(form);
    
    const answers = {};
    for (let [key, value] of formData.entries()) {
        const id = key.replace('answers[', '').replace(']', '');
        answers[id] = value;
    }

    fetch('/submit-exam', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answers })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            alert(`পরীক্ষা সফলভাবে জমা হয়েছে!\nআপনার স্কোর: ${data.score} / ${data.total}`);
            window.location.href = '/';
        }
    })
    .catch(err => {
        console.error("Error submitting exam:", err);
    });
}
