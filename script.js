// script.js
document.addEventListener("DOMContentLoaded", function() {
    var toggler = document.getElementsByClassName("caret");
    for (var i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function() {
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("caret-down");
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    initializeSGDAnimation();
});

let scatterChart; // Global variable to hold the chart instance

function initializeSGDAnimation() {
    const ctx = document.getElementById('graph-container').getContext('2d');

    if (scatterChart) {
        scatterChart.destroy();
    }

    let data = {
        datasets: [{
            label: 'Gradient Descent Path',
            data: [],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            showLine: true
        }]
    };

    let config = {
        type: 'scatter',
        data: data,
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: 0, // Start from iteration 0
                    max: 100, // Assuming a max of 200 iterations
                    title: {
                        display: true,
                        text: 'Iteration'
                    }
                },
                y: {
                    min: -100,
                    max:   1000,
                    title: {
                        display: true,
                        text: 'Loss'
                    }
                }
            }
        }
    };

    scatterChart = new Chart(ctx, config);

    let currentX = -25; 
    let iterationCount = 0; // New variable to track iterations
    let learningRate = 0.01; 

    function loss(x) {
        return Math.pow(x - 5, 2);
    }

    function lossDerivative(x) {
        return 2 * (x - 5);
    }

    function stochasticGradientDescent() {
        noiseLevel = noiseLevel * 0.975; // Decrease noise level
        let gradient = lossDerivative(currentX);
        currentX -= learningRate * gradient; 
    
        let newY = loss(currentX) + ((Math.random() - 0.5) * 2 * noiseLevel); 

        data.datasets[0].data.push({x: iterationCount, y: newY}); // Use iterationCount for x-axis
    
        scatterChart.update();
        iterationCount++; // Increment iteration count
    }
    
    let noiseLevel = 200; 
    let intervalId = setInterval(stochasticGradientDescent, 50); 
    
    setTimeout(() => {
        clearInterval(intervalId);
    }, 5000); // 5 seconds
}

function adjustCanvasAspectRatio() {
    var canvas = document.getElementById('graph-container');
    var width = canvas.offsetWidth;
    var aspectRatio = 16 / 9; // You can change this to your desired aspect ratio
    var height = width / aspectRatio;
    canvas.style.height = height + 'px';
}

// Adjust the canvas size on load and on window resize
window.onload = adjustCanvasAspectRatio;
window.onresize = adjustCanvasAspectRatio;

function copyEmailToClipboard() {
    const email = 'davidrhidary@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
        // Show the message
        const messageElement = document.getElementById('copyMessage');
        messageElement.style.display = 'block';

        // Optional: Hide the message after a few seconds
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 3000);
    }).catch(err => {
        console.error('Failed to copy email: ', err);
    });
}

function graduallyReduceNoise(elementId) {
    const originalText = "I like to train deep neural nets on large datasets 🧠🤖💥";
    let currentText = addMaxNoise(originalText); // Starting with maximum noise
    document.getElementById(elementId).innerHTML = `<h2>${currentText}</h2>`;

    let intervalCount = 0;
    const maxIntervals = 100; // 10 seconds / 100 ms

    const interval = setInterval(() => {
        intervalCount++;
        currentText = reduceNoise(currentText, originalText, intervalCount, maxIntervals);
        document.getElementById(elementId).innerHTML = `<h2>${currentText}</h2>`;

        if (intervalCount >= maxIntervals) {
            clearInterval(interval);
            document.getElementById(elementId).innerHTML = `<h2>${originalText}</h2>`; // Restore original text
        }
    }, 100);
}

function addMaxNoise(text) {
    // Replace characters with random symbols and letters
    return text.split('').map(c => {
        if (Math.random() < 0.5) {
            const randomChar = String.fromCharCode(Math.floor(Math.random() * 94) + 33);
            return randomChar !== c ? randomChar : c;
        }
        return c;
    }).join('');
}

function reduceNoise(noisyText, originalText, currentStep, totalSteps) {
    // Gradually restores characters to their original form
    return noisyText.split('').map((c, i) => {
        if (Math.random() < currentStep / totalSteps) {
            return originalText.charAt(i);
        }
        return c;
    }).join('');
}

graduallyReduceNoise("noise");
