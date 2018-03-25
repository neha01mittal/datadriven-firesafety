/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function() {
    /**
     * rotateStatus - current rotating status
     * deg - rotating degree
     * initialTime - rotating initial time
     */
    var rotateStatus = false,
        deg = 0,
        initialTime = 0;

    /**
     * Rotates the arrow image.
     * @param {string} rotaryDirection
     * @private
     */
    function rotateArrow(rotaryDirection) {
        var interval,
        direction = document.querySelector('#direction');

        // If there is click event and rotateStatus is false,
        if (rotateStatus === false) {
            // 'initialTime' will set random number (100 ~ 150)
            initialTime = (Math.random() * 50) + 100;
            rotateStatus = true;

            // Each 0.075 second, run interval timer
            interval = setInterval(function() {
                // If initialTime smaller than 0, clear timer.
                if ((initialTime--) < 0) {
                    clearInterval(interval);
                    rotateStatus = false;
                }

                // If direction is "CW", then rotate clock wise direction
                if (rotaryDirection === "CW") {
                    deg = deg + initialTime;
                }
                // If not, then rotate counter clock wise direction
                else {
                    deg = deg - initialTime;
                }
                direction.style.transform = 'rotate(' + deg + 'deg)';
            }, 75);
        }

    }

    /**
     * Bind events. (back, click and rotary events)
     * @private
     */
    function bindEvents() {
        // Handle hardware back key event
        document.addEventListener('tizenhwkey', function(e) {
            if (e.keyName === 'back') {
                try {
                    tizen.application.getCurrentApplication().exit();
                } catch (ignore) {}
            }
        });

        document.getElementById('direction').addEventListener('click',
                function() {
        			document.getElementById('direction2').style.display = 'block'
                    document.getElementById('direction').style.display = 'none'
                    
                    document.getElementById('text2').style.display = 'block'
                    document.getElementById('text').style.display = 'none'
                },
                false);
        
        document.getElementById('direction2').addEventListener('click',
                function() {
        			document.getElementById('direction3').style.display = 'block'
                    document.getElementById('direction2').style.display = 'none'
                    	
                    document.getElementById('text3').style.display = 'block'
                    document.getElementById('text2').style.display = 'none'                   
                },
                false);
        document.getElementById('direction3').addEventListener('click',
                function() {
        			document.getElementById('direction').style.display = 'block'
                    document.getElementById('direction3').style.display = 'none'
                    	
                    document.getElementById('text').style.display = 'block'
                    document.getElementById('text3').style.display = 'none'
                  
                },
                false);
        
        // Handle click event of direction-button element
        document.getElementById('direction-button').addEventListener('click',
            function() {
                rotateArrow("CW");
            },
            false);

        // Handle rotarydetent event
        document.addEventListener('rotarydetent', function(ev) {
            var direction = ev.detail.direction;

            rotateArrow(direction);
        });
    }

    function errorCallback(response) {
        console.log('The following error occurred: ' + response.name);
    }

    function notificationCallback(message) {
        console.log('New push message: ' + message.alertMessage + ', date: ' + message.date + ', data: ' + message.appData);
    }

    /* Since Tizen 3.0, you must provide PushRegistrationStateChangeCallback */
    /* Define the state change callback */

    function stateChangeCallback(state) {
        console.log('The state is changed to: ' + state);
    }
    /* Method to be called when the notification message arrives */
    function notificationCallback(message) {
        console.log('New push message: ' + message.alertMessage + ', date: ' + message.date + ', data: ' + message.appData);
    }

    /**
     * Initiates the application.
     * @private
     */
    function init() {
        document.getElementById('direction2').style.display = 'none'
        document.getElementById('direction3').style.display = 'none'
            document.getElementById('text2').style.display = 'none'
                document.getElementById('text3').style.display = 'none'
        bindEvents();
        tizen.push.connectService(notificationCallback, errorCallback);
        tizen.push.getUnreadNotifications();

    }

    window.onload = init();
    
}());