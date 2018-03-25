/*
 * Copyright (c) 2016 Samsung Electronics Co., Ltd. All rights reserved.
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
    var DAY_SECONDS = 86400,
        HOUR_SECONDS = 3600,
        MIN_SECONDS = 60;


    /**
     * Removes all child nodes.
     * @private
     * @param {string} id - id for removing child nodes
     */
    function removeChildren(id) {
        var target = document.querySelector(id);

        while (target.hasChildNodes()) {
            target.removeChild(target.firstChild);
        }
    }

    /**
     * Posts the simple notification.
     * @private
     */
    function postNotification() {
        var notification,
            notificationDict;

        try {
            // Sets notification dictionary.
            notificationDict = {
                content: "Hello Tizen!",
                iconPath: "../icon.png",
            };
            // Creates notification object.
            notification = new tizen.StatusNotification("SIMPLE", "Notification Manager", notificationDict);

            // Posts notification.
            tizen.notification.post(notification);
        } catch (err) {
            console.log(err.name + ": " + err.message);
        }
    }

    /**
     * Creates and Returns DIV object.
     * @private
     * @param {string} className - class name for creating DIV object
     */
    function createDiv(className) {
        var div = document.createElement("div");

        div.className = className;

        return div;
    }

    /**
     * Returns the time string about difference of the posted time and current time.
     * @private
     * @param {object} date - the Date object about posted time of notification.
     */
    function getTimeString(date) {
        var currentDate = tizen.time.getCurrentDateTime(),
            postedDate = new tizen.TZDate(date),
            seconds = Math.floor(currentDate.difference(postedDate).length / 1000),
            str = "";

        if (seconds > DAY_SECONDS) {
            // If difference is bigger than a day(86400 seconds)
            str += Math.floor(seconds / DAY_SECONDS) + "d ";
        } else if (seconds > HOUR_SECONDS) {
            // If difference is bigger than a hour(3600 seconds)
            str += Math.floor(seconds / HOUR_SECONDS) + "h ";
        } else if (seconds > MIN_SECONDS) {
            // If difference is bigger than a minute(60 seconds)
            str += Math.floor(seconds / MIN_SECONDS) + "m ";
        } else {
            str += seconds + "s ";
        }
        str += "ago";

        return str;
    }

    /**
     * Resets detail page and displays informations(title, posted time, content) about notification.
     * @private
     * @param {object} notification - the notification object
     */
    function setNotificationDetail(notification) {
        // Removes texts of title, time, content.
        removeChildren("#detail-title");
        removeChildren("#detail-time");
        removeChildren("#detail-content");

        // Sets texts about notification's title, time, content.
        document.querySelector("#detail-title").appendChild(document.createTextNode(notification.title));
        document.querySelector("#detail-time").appendChild(document.createTextNode(notification.postedTime.toUTCString()));
        document.querySelector("#detail-content").appendChild(document.createTextNode(notification.content));

        // Changes active page.
        document.querySelector("#page-notification-detail").classList.toggle("active");
        document.querySelector("#page-notification").classList.toggle("active");
    }

    /**
     * Creates notification list item and appends to list.
     * @private
     * @param {object} notification - the notification object
     */
    function addNotificationItem(notification) {
        /**
         * timerWorker - Web Worker object.
         * notificationList - The notification item list container
         * listItem - The DIV element about timer list item
         * itemContainerLeft - The DIV element about left container in item
         * itemContainerRight - The DIV element about right container in item
         * itemTitle - The DIV element about item title
         * itemTime - The DIV element about item time
         * itemRemoveBtn - The DIV element about remove button
         */
        var notificationList = document.querySelector("#notification-list"),
            listItem,
            itemContainerLeft,
            itemContainerRight,
            itemTitle,
            itemTime,
            itemRemoveBtn;

        // Creates list item DIV object.
        listItem = createDiv("list-item");

        // Creates left container DIV object.
        itemContainerLeft = createDiv("item-container-left");

        // Creates title, time DIV object and appends to left container.
        itemTitle = createDiv("item-title");
        itemTitle.appendChild(document.createTextNode(notification.title));
        itemTime = createDiv("item-time");
        itemTime.appendChild(document.createTextNode(getTimeString(notification.postedTime)));
        itemContainerLeft.appendChild(itemTitle);
        itemContainerLeft.appendChild(itemTime);
        listItem.appendChild(itemContainerLeft);

        // Creates right container DIV object.
        itemContainerRight = createDiv("item-container-right");

        // Creates remove button DIV object and appends to left container.
        itemRemoveBtn = createDiv("item-remove-btn");
        itemContainerRight.appendChild(itemRemoveBtn);
        listItem.appendChild(itemContainerRight);

        // Binds click event of remove button.
        itemRemoveBtn.addEventListener("click", function(e) {
            e.stopPropagation();
            tizen.notification.remove(notification.id);
            notificationList.removeChild(listItem);
            if (notificationList.childNodes.length === 0) {
                // If notification list is empty, change active page.
                document.querySelector("#page-main").classList.toggle("active");
                document.querySelector("#page-notification").classList.toggle("active");
            }
        });

        // Binds click event of list item.
        listItem.addEventListener("click", function() {
            setNotificationDetail(notification);
        });

        notificationList.appendChild(listItem);
    }

    /**
     * Gets all notifications and makes notification list.
     * @private
     */
    function showNotifications() {
        var notifications,
            i;

        // Removes child nodes of notification list.
        removeChildren("#notification-list");

        notifications = tizen.notification.getAll();

        if (notifications.length === 0) {
            // If there is no notification, shows "No notification" message.
            document.querySelector("#no-notification").style.display = "table-cell";
            document.querySelector("#notification-list").style.display = "none";
            document.querySelector("#remove-all-btn").style.display = "none";
        } else {
            for (i = 0; i < notifications.length; i++) {
                addNotificationItem(notifications[i]);
            }
            document.querySelector("#no-notification").style.display = "none";
            document.querySelector("#notification-list").style.display = "block";
            document.querySelector("#remove-all-btn").style.display = "table-cell";
        }
    }

    /**
     * Binds Back Key Events.
     * @private
     */
    function bindBackKeyEvents() {
        document.addEventListener('tizenhwkey', function keyEventHandler(ev) {
            var page = document.getElementsByClassName("active")[0],
                pageId = page ? page.id : "";

            if (ev.keyName === "back") {
                if (pageId === "page-main") {
                    try {
                        tizen.application.getCurrentApplication().exit();
                    } catch (ignore) {}
                } else if (pageId === "page-notification-detail") {
                    document.querySelector("#page-notification").classList.toggle("active");
                    page.classList.toggle("active");
                } else {
                    document.querySelector("#page-main").classList.toggle("active");
                    page.classList.toggle("active");
                }
            }
        });
    }

    /**
     * Binds Button events.
     * @private
     */
    function bindButtonEvents() {
        document.querySelector("#notification-post-btn").addEventListener("click", postNotification);

        document.querySelector("#notification-get-btn").addEventListener("click", function() {
            document.querySelector("#page-main").classList.toggle("active");
            document.querySelector("#page-notification").classList.toggle("active");
            showNotifications();
        });

        document.querySelector("#remove-all-btn").addEventListener("click", function() {
            tizen.notification.removeAll();
            removeChildren("#notification-list");
            document.querySelector("#page-main").classList.toggle("active");
            document.querySelector("#page-notification").classList.toggle("active");
        });
    }

    /**
     * Binds Default Events.
     * @private
     */
    function bindDefaultEvents() {
        bindBackKeyEvents();
        bindButtonEvents();
    }

    /**
     * Initiates the application.
     * @private
     */
    function init() {
        bindDefaultEvents();
    }

    window.onload = init;
}());