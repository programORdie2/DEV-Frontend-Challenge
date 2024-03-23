document.addEventListener("DOMContentLoaded", () => {
    // Get DOM elements
    const section = document.getElementById('camp-activities-inquiry');
    const form = section.querySelector('form');
    const submit = form.querySelector('button');
    const allergy = form.querySelector('#food-allergies');
    const additional = form.querySelector('#additional-info');
    const activity = form.querySelector('#activity-select');
    const sectionChilds = form.childNodes;

    // Set form attributes
    form.action = '/';
    form.method = 'GET';

    // Function to handle form changes
    function formChanged(event) {
        event.preventDefault();
        if (activity.value !== '') {
            submit.classList.add('isok');
        } else {
            submit.classList.remove('isok');
        }
    }

    // Function to show activity required message
    function showActivityRequired() {
        const required = document.createElement('p');
        required.classList.add('required');
        required.innerText = 'This field is required!';
        activity.parentElement.insertBefore(required, activity.nextSibling);

        setTimeout(() => {
            required.remove();
            submit.disabled = false;
        }, 4000);
    }

    // Function to finish voting process
    async function finishVote(activity) {
        vote(activity).then((data) => {
            closePopup(document.querySelector('._popup'));
            showMessage('Success!', 'Your choice has been saved and our team will review your vote.<br> You can view the statistics using the button below.<br> Note that possible food allergies or extra info is not included in it for privacy reasons.', '<br>', 'View statistics', viewStats, data);
        });
    }

    // Function to create a message popup
    function makeMessage(html, showClose, callback = false, callbackData = null) {
        const message = document.createElement("div");
        message.className = "_popup notReady";
        message.innerHTML = '<div>' + html + '</div>';
        if (showClose) {
            message.addEventListener('click', (e) => {
                if (e.target === message) {
                    closePopup(message);
                    if (callback !== false) {
                        callback(callbackData);
                    }
                }
            });
        }
        document.body.appendChild(message);
        setTimeout(() => {
            message.classList.remove("notReady");
        }, 0)
    }

    // Function to close a popup
    function closePopup(popup) {
        popup.classList.add('notReady');
        setTimeout(() => {
            popup.remove();
        }, 200);
    }

    // Function to show a message
    function showMessage(title, text, html, showClose = false, callback = false, callbackData = null) {
        let extraButton = '';
        if (showClose !== false) {
            extraButton = '<a title="' + showClose + '" class="closeMessage">' + showClose + '</a>';
        }
        let htmlData = '<h1>' + title + '</h1><p>' + text + '</p>' + html + '<div class="flex">' + extraButton + '</div>';
        makeMessage(htmlData, showClose, callback, callbackData);
        if (showClose) {
            const closes = document.querySelectorAll('.closeMessage');
            const close = closes[closes.length - 1];
            close.style.overflow = 'hidden';
            close.style.position = 'relative';
            close.addEventListener('click', (e) => {
                setTimeout(() => {
                    closePopup(close.parentElement.parentElement.parentElement);
                    if (callback !== false) {
                        callback(callbackData);
                    }
                }, 350);
                const rect = close.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                const circle = document.createElement('span');
                circle.classList.add('circle');
                circle.style.setProperty('--top', mouseY + 'px');
                circle.style.setProperty('--left', mouseX + 'px');

                close.appendChild(circle);
                setTimeout(() => {
                    circle.remove();
                }, 500);
            });
        }
    }

    // Function to view statistics
    function viewStats(rawData) {
        console.log(rawData);
        const names = Object.keys(rawData);
        const values = Object.values(rawData);

        form.classList.add('formFadeout');
        section.querySelector('h1').innerText = section.querySelector('h1').innerText + ' Results';
        const chartElement = document.createElement('div');
        chartElement.id = 'chart';
        makeChart(values, names, element = chartElement);
        section.appendChild(chartElement);
    }

    // Event listener for submit button click
    submit.addEventListener('click', (e) => {
        if (!submit.classList.contains('isok')) {
            return;
        }
        const rect = submit.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const circle = document.createElement('span');
        circle.classList.add('circle');
        circle.style.setProperty('--top', mouseY + 'px');
        circle.style.setProperty('--left', mouseX + 'px');

        submit.appendChild(circle);
        setTimeout(() => {
            circle.remove();
        }, 500);
    });

    // Event listener for form submission
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!submit.classList.contains('isok')) {
            submit.disabled = true;
            showActivityRequired();
            return false;
        }

        setTimeout(() => {
            Confetti(400);
            showMessage('Loading ...', '', '<span class="loading"></span>');

            finishVote(activity.value);
        }, 350);
    });

    // Event listeners for form changes
    form.addEventListener('change', formChanged);
    form.addEventListener('keyup', formChanged);

    // Hide form children initially
    sectionChilds.forEach((child) => {
        try {
            child.classList.add('invisible');
        } catch (error) { }
    });

    // Show form children gradually
    setTimeout(() => {
        let wait = 0;
        sectionChilds.forEach((child) => {
            setTimeout(() => {
                try {
                    child.classList.remove('invisible');
                } catch (error) { }
            }, wait);
            wait += 50;
        });
    }, 0);
});