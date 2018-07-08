$(document).ready(function() {
    var cycleDelta = {
        value: 1000,
        delta: 0,
        type: ''
    };

    var anomalyObject = {
        hours: new Date().getHours(),
        minutes: new Date().getMinutes(),
        seconds: new Date().getSeconds()
    };

    var timeouts = [];

    var currentMode = 'stop';

    var navMusic = new Audio("audio/tick.wav");

    var sound = true;

    $(".navigation .btn").click(function(event) {
        stopAllTimeouts();
        refreshInitObjects();
    });

    $(".volume_off").click(function(event) {
        sound = false;
        $(".volume_off").hide();
        $(".volume_on").show();

    });

    $(".volume_on").click(function(event) {
        $(".volume_on").hide();
        $(".volume_off").show();
        sound = true;
    });


    $(".static_speed").click(function(event) {
        stopAllTimeouts();
        currentMode = 'static_speed';

        var previousSpeed = cycleDelta.value;

        cycleDelta.value = previousSpeed;
        cycleDelta.delta = 0;

        makeSpeedStatic();

        hideStaticButton();
    });

    $("div.constructor_form .btn.init_anomaly").click(function() {
        stopAllTimeouts();
        refreshInitObjects();

        var speedValue = $('.constructor_form #clock_speed').val();
        var deltaValue = $('.constructor_form #clock_speed_step').val();

        cycleDelta.value = Number(speedValue);
        cycleDelta.delta = Number(deltaValue);

        if (currentMode === 'slower') {
            makeSecondsSlower();
        }

        if (currentMode === 'faster') {
            makeSecondsFaster();
        }

        showStaticButton();
        hideConstructorForm();
    });

    function showConstructorForm() {
        $('.constructor_form').show()
        $('.constructor_form #clock_speed').val(cycleDelta.value);
        $('.constructor_form #clock_speed_step').val(cycleDelta.delta);
    }

    function hideConstructorForm() {
        $('.constructor_form').hide()
    }


    function hideStaticButton() {
        $('.static_speed').hide()
    }

    function showStaticButton() {
        $('.static_speed').show()
    }

    // Form fields

    $(".slower").click(function() {
        currentMode = 'slower';
        hideAnotherButtons();
        showConstructorForm();
        $(".button_clock_anomaly_name").html("замедление");
        $(".clock_anomaly_name").html("замедление");
    });

    $(".faster").click(function() {
        currentMode = 'faster';
        hideAnotherButtons();
        showConstructorForm();
        $(".button_clock_anomaly_name").html("ускорение");
        $(".clock_anomaly_name").html("ускорение");
    });

    $(".random").click(function() {
        currentMode = 'random';
        hideAnotherButtons();
        makeSecondsRandom();
    });

    // Operation buttons

    $(".normal").click(function() {
        triggerNormalCycleIfAllowed();
        currentMode = 'normal';
        hideConstructorForm
    });

    $(".stop").click(function() {
        currentMode = 'stop';
        hideAnotherButtons();
        triggerNormalCycleIfAllowed();
        hideConstructorForm();
    });


    function refreshInitObjects() {
        cycleDelta = {
            value: 1000,
            delta: 0,
            type: ''
        };
        anomalyObject = {
            hours: new Date().getHours(),
            minutes: new Date().getMinutes(),
            seconds: new Date().getSeconds()
        };
    }

    function hideAnotherButtons() {
        navButtons = $('.navigation .btn');
        for (var i = 0; i < navButtons.length; i++) {
            var button = $(navButtons[i]);
            if (currentMode === 'stop' || currentMode === 'static_speed') {
                button.css('visibility', 'visible');
            } else {
                if (!button.hasClass('stop') && !button.hasClass('static_speed')) {
                    button.css('visibility', 'hidden');
                }
            }
        }
    }

    function anomalyTimeIncreaser() {
        updateAnomalyObject();
        cycleDelta.value = (cycleDelta.type === 'random') ? updateRandomValue() : (cycleDelta.value + cycleDelta.delta);
        if (currentMode === 'faster' && cycleDelta.value < 0) {
            cycleDelta.value = 0;
        }
        timeouts.push(setTimeout(anomalyTimeIncreaser, cycleDelta.value));
    }

    function makeSecondsSlower() {
        cycleDelta.value = cycleDelta.value;
        cycleDelta.delta = cycleDelta.delta;
        anomalyTimeIncreaser();
    }

    function makeSecondsFaster() {
        cycleDelta.value = cycleDelta.value;
        cycleDelta.delta = -cycleDelta.delta;
        anomalyTimeIncreaser();
    }

    function makeSpeedStatic() {
        cycleDelta.delta = 0;
        anomalyTimeIncreaser();
    }

    function makeSecondsRandom() {
        cycleDelta.value = 1000;
        cycleDelta.delta = 1000;
        cycleDelta.type = 'random'
        anomalyTimeIncreaser();
    }

    function updateRandomValue() {
        return Math.floor(Math.random() * 3000) + 1;
    }

    function stopAllTimeouts() {
        for (var i = 0; i < timeouts.length; i++) {
            clearTimeout(timeouts[i]);
        }
        timeouts = [];
    }

    function updateAnomalyObject() {
        updateSeconds(anomalyObject.seconds);
        updateMinutes(anomalyObject.hours, anomalyObject.minutes);
        updateHours(anomalyObject.minutes);
        if (anomalyObject.seconds == 60) {
            anomalyObject.seconds = 1;
            anomalyObject.minutes += 1;
            if (anomalyObject.minutes == 60) {
                anomalyObject.minutes = 1;
                anomalyObject.hours += 1;
            } else {
                anomalyObject.minutes += 1;
            }
        } else {
            anomalyObject.seconds += 1;
        }
    }

    function updateSeconds(value) {
        var seconds = value ? value : new Date().getSeconds();
        var sdegree = seconds * 6;
        var srotate = "rotate(" + sdegree + "deg)";
        $("#sec").css({
            "-moz-transform": srotate,
            "-webkit-transform": srotate
        });

        if (sound) {
            navMusic.pause();
            navMusic.play();
        } else {
            navMusic.pause();
        }


        $(".change_speed").html(cycleDelta.value.toString());
        $(".change_step").html(cycleDelta.delta.toString());
    }

    function updateMinutes(hours, mins) {
        var hours = hours ? hours : new Date().getHours();
        var mins = mins ? mins : new Date().getMinutes();
        var hdegree = hours * 30 + (mins / 2);
        var hrotate = "rotate(" + hdegree + "deg)";
        $("#hour").css({
            "-moz-transform": hrotate,
            "-webkit-transform": hrotate
        });
    }

    function updateHours(mins) {
        var mins = mins ? mins : new Date().getMinutes();
        var mdegree = mins * 6;
        var mrotate = "rotate(" + mdegree + "deg)";
        $("#min").css({
            "-moz-transform": mrotate,
            "-webkit-transform": mrotate
        });
    }

    function triggerNormalCycleIfAllowed() {
        updateHours();
        updateMinutes();
        updateSeconds();
        timeouts.push(setTimeout(triggerNormalCycleIfAllowed, 1000));
    }

    triggerNormalCycleIfAllowed();
});