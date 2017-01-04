var list;
var iconBase = 'images/';
var imageRoot = 'images/';
var $ = jQuery;
var markerList = [];

        /*
        * All map contents are created in here
        * */

        function readThai(){
            readTextFile('content_thai.txt');
        }
        // function createMarker(map, lat, lon, title, icon) {
var createMarker = function(arr) {
            $.each(arr, function(index, value) {
                console.log(index + " :: " + value);
            });
            // var marker = new google.maps.Marker({
            //     position: {lat: lat, lng: lon},
            //     map: map,
            //     title: title,
            //     icon: icon
            // })

            // return marker;
        }
        function initMap() {

          //  var scg = {lat: 13.918111, lng: 100.545001};
            var bounds = new google.maps.LatLngBounds();

            var infowindow = new google.maps.InfoWindow();
            var map = new google.maps.Map(document.getElementById('map'), {
          //      zoom: 10,
         //       center: scg,
                mapTypeControl: false
            });

            /*
            * Add new marker icon here
            */
            var icons = {
                firstMarker : {
                url: iconBase + "marker.png" // url
            //  origin: new google.maps.Point(0, 0), // origin
            //  anchor: new google.maps.Point(0, 0) // anchor
                }
            };


            /*
            * Create each marker from the content
            * */

            for (line in list) {

                try {
                    /* Pre-process data*/
                    var eachLocation = list[line].split(',');
                    var name = eachLocation[0];
                    var coordinate = {lat: parseFloat(eachLocation[1]), lng: parseFloat(eachLocation[2])};

                    /* Get cookie value */
                    var check = checkCookies(eachLocation[3]);

                  //  console.log(eachLocation[5]);
                    /* Set InfoWindow text */
                    var title = '<p class="pop_title">' + eachLocation[0] + '</p>';
                    var image = '<div class="pop_content"><p class="pop_img"><IMG BORDER="0" height="200" ALIGN="Left" SRC="' + imageRoot + eachLocation[4] + '"/></p> ';
                    var content = '<p class="pop_txt">' + eachLocation[3] + '</p></div>';

                    var next = '<p class="pop_next" onclick= clickNext(' + eachLocation[5].trim() + ')><IMG SRC="'+imageRoot+'/btn_next01.png"/></p>';
                    var previous = '<p class="pop_prev" onclick= clickNext(' +(line-1)+')><IMG SRC="'+imageRoot+'/btn_prev01.png"/></p>';


                    var firstChunk = title+image+content;
                    var secondChunk = next+previous;
                    var cookieValue = eachLocation[3];

                    // var contentString =
                    //         /* Title */
                    //         '<p class="pop_title">' + eachLocation[0] + '</p>' +
                    //         /* Image */
                    //         '<div class="pop_content"><p class="pop_img"><IMG BORDER="0" ALIGN="Left" SRC="' + 'image/' + eachLocation[4] + '"/></p> ' +
                    //         /* Content */
                    //         '<p class="pop_txt">' + eachLocation[3] + '</p></div>' +
                    //         /* CheckBox */
                    //         '<p class="pop_check"><input type="checkbox" ' +
                    //         'name="' + eachLocation[3] + '" ' +
                    //         'value="' + eachLocation[3] + '" ' +
                    //         'onclick=handleClick(this); ' +
                    //         check + " >ฉันเคยไปที่นี่แล้ว</input></p>" +
                    //         /* Next Button */
                    //         '<p class="pop_next" onclick= clickNext(' + eachLocation[5].trim() + ')><IMG SRC="image/btn_next01.png"/></p>' +
                    //         '<button onclick = clickPrevious('+(line-1)+') >Previous</button>'
                    //     ;

                    /* create marker */
                    var marker = new google.maps.Marker({
                        icon: icons['firstMarker'],
                        position: coordinate,
                        map: map,
                        title: name
                    });


                    /* extend the view by this marker position */
                    bounds.extend(marker.getPosition());



                    /* make the infoWindow pops up when click on the marker */
                    google.maps.event.addListener(marker, 'click', (function (marker, firstChunk,cookieValue, secondChunk, infowindow) {
                        return function () {

                            var content = firstChunk+
                                '<p class="pop_check"><input type="checkbox" ' +
                                'name="' + cookieValue + '" ' +
                                'value="' + cookieValue + '" ' +
                                'onclick=handleClick(this); ' +
                                checkCookies(cookieValue) + " >ฉันเคยไปที่นี่แล้ว</input></p>" +
                                secondChunk
                            infowindow.setContent(content);
                            infowindow.open(map, marker);
                            bounds.extend(infowindow);
                            map.fitBounds(bounds);

                                }
                        }
                    )(marker, firstChunk,cookieValue,secondChunk, infowindow));

                    /* if the user have been here before, return checked in the checkbox*/
                    function checkCookies(name) {
                        if (getCookie(name) == "true") {
                            return "checked";
                        }
                        else return "";
                    }

                    markerList.push(marker);
                }
                catch(er){}
                map.fitBounds(bounds);

            }
        }

        function clickNext(line) {
            google.maps.event.trigger(markerList[(line)%list.length], 'click');
        }

        function clickPrevious(line) {
            //alert(markerList);
            if(line==-1)
                line = list.length-1;
                console.log('Prev ' +line);
            google.maps.event.trigger(markerList[(line)%list.length], 'click');
            //var next =  markerList[(line+1)%list.length];
            //next.click();
        }

        /* set cookie when the checkboxes are clicked */
        function handleClick(cb) {
            setCookie(cb.name, cb.checked)
            cookies();
        }
        function setCookie(cname, cvalue) {
            document.cookie = cname + "=" + cvalue + ";path=/";
        }

        /* get cookie from the name */
        function getCookie(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }

var getStoriesData = function(callback) {
            var stories;
            $.ajax({
                url: '/data',
                method: 'GET',
                datatype: 'json',
                beforeSend: function(err) {
                    console.log('retrieve stories data');
                }
            }).done(function(data) {
                console.log('retrieve stories data success');
                callback(data);
            }).fail(function(jqXHR, textStatus) {
                console.log('retrieve stories data failed')
            });
        }

        function readTextFile(file) {
            var allText;
            var rawFile = new XMLHttpRequest();

            var boolean = false;
                rawFile.open("GET", file, true);
                rawFile.onreadystatechange = function () {
                    if (rawFile.readyState === 4) {
                        if (rawFile.status === 200 || rawFile.status == 0) {
                            allText = rawFile.responseText;
                            list = allText.split("\n");
                            initMap();
                            cookies();
                            boolean = true;
                        }
                    }
                }
                rawFile.send(null);
        }