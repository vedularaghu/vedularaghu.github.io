var currentMovieImage = 0;
var currentTVImage = 0;
const movie_images = [];
const tv_images = [];
const movie_text = [];
const tv_text = [];
var p_there = false;
const movie_genre = {}
const tv_genre = {}
var details = {}
var reviews = {}
var credits = {}

function initMovieSlideshow() {
    setMovieImage(0);
    setInterval(function() {
        nextMovieImage();
    }, 2000);
}

function initTVSlideshow() {
    setTVImage(0);
    setInterval(function() {
        nextTVImage();
    }, 2500);
}

function nextMovieImage() {
    if (movie_images.length === currentMovieImage + 1) {
        currentMovieImage = 0;
    } else {
        currentMovieImage++;
    }
    setMovieImage(currentMovieImage);
}

function nextTVImage() {
    if (tv_images.length === currentTVImage + 1) {
        currentTVImage = 0;
    } else {
        currentTVImage++;
    }
    setTVImage(currentTVImage);
}

function setMovieImage(loc) {
    document.querySelectorAll('.movieslide')[0].src = movie_images[loc];
    document.getElementById("moviedetails").innerHTML = movie_text[loc]
}

function setTVImage(loc) {
    document.querySelectorAll('.tvshowslide')[0].src = tv_images[loc];
    document.getElementById("tvdetails").innerHTML = tv_text[loc]
}


window.onload = function get_trending() {
    document.getElementById("homepage").click();
    fetch('https://searchmovieworld1.azurewebsites.net/gettrending')
        .then(response => response.json())
        .then(data => {
            var i = 0
            const myPath = "https://image.tmdb.org/t/p/w780/";
            for (const [key, value] of Object.entries(data[0])) {

                movie_images.push(myPath + value[0])
                movie_text.push(key + " " + "(" + value[1].substring(0, 4) + ")")

            }
            for (const [key, value] of Object.entries(data[1])) {

                tv_images.push(myPath + value[0])
                tv_text.push(key + " " + "(" + value[1].substring(0, 4) + ")")
            }
            document.querySelectorAll('.movieslide')[0].src = movie_images[0];
            document.getElementById("moviedetails").innerHTML = movie_text[0];
            document.querySelectorAll('.tvshowslide')[0].src = tv_images[0];
            document.getElementById("tvdetails").innerHTML = tv_text[0];
        });
    initMovieSlideshow();
    initTVSlideshow();
    getGenre();
}

function toggle_content(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
    if (evt.currentTarget.id == "homepage") {
        document.getElementById("searchunderline").style.visibility = "hidden";
        document.getElementById("homeunderline").style.visibility = "visible";
    } else {
        document.getElementById("searchunderline").style.visibility = "visible";
        document.getElementById("homeunderline").style.visibility = "hidden";
    }

}

function popup() {
    var wordempty = document.forms["keywordsearch"]["word"].value;
    var criteriaempty = document.forms["keywordsearch"]["keywordcategory"].value;
    if (wordempty == "" || criteriaempty == "") {
        alert("Please enter valid values.");
    }
}

function getGenre() {
    fetch('https://searchmovieworld1.azurewebsites.net/moviegenre')
        .then(response => response.json())
        .then(data => {
            for (const [key, value] of Object.entries(data)) {
                movie_genre[key] = value
            }
        })
    fetch('https://searchmovieworld1.azurewebsites.net/tvgenre')
        .then(response => response.json())
        .then(data => {
            for (const [key, value] of Object.entries(data)) {
                tv_genre[key] = value
            }
        })
}

function getBackendData(param) {
    var cat = param.substring(0, 6)
    var id = param.substring(6, param.length)
    console.log(param, cat, id);

    if (cat == "movies") {
        var urlDetails = new URL('https://searchmovieworld1.azurewebsites.net/moviedetails');
        urlDetails.searchParams.append('id', id);
        var urlCredits = new URL('https://searchmovieworld1.azurewebsites.net/moviecredits');
        urlCredits.searchParams.append('id', id);
        var urlReview = new URL('https://searchmovieworld1.azurewebsites.net/moviereview')
        urlReview.searchParams.append('id', id);

    } else {
        var urlDetails = new URL('https://searchmovieworld1.azurewebsites.net/tvshowdetails');
        urlDetails.searchParams.append('id', id);
        var urlCredits = new URL('https://searchmovieworld1.azurewebsites.net/tvcredits');
        urlCredits.searchParams.append('id', id);
        var urlReview = new URL('https://searchmovieworld1.azurewebsites.net/tvreview');
        urlReview.searchParams.append('id', id);
    }

    fetch(urlDetails)
        .then(response => response.json())
        .then(data => {
            for (const [key, value] of Object.entries(data)) {
                details[key] = value
            }
        })
    fetch(urlCredits)
        .then(response => response.json())
        .then(data => {
            for (const [key, value] of Object.entries(data)) {
                credits[key] = value
            }
        })
    fetch(urlReview)
        .then(response => response.json())
        .then(data => {
            for (const [key, value] of Object.entries(data)) {
                reviews[key] = value
            }
        })
}


function showDetails(param) {


    var cat = param.substring(0, 6)
    var id = param.substring(6, param.length)
    console.log(param, cat, id);

    var disp = document.getElementsByClassName("displayresults")[0]
    var modal = document.createElement("div")
    modal.setAttribute("id", "myModal");
    modal.classList.add("modal")
    modal.style.display = "block";


    var head = document.createElement("div")
    head.classList.add("modal-content")

    var sp = document.createElement("span")
    sp.classList.add("close")
    sp.innerHTML = "&times"
    sp.onclick = function() {
        modal.style.display = "none";
    }
    head.appendChild(sp)


    if (cat == "movies") {
        var urlDetails = new URL('https://searchmovieworld1.azurewebsites.net/moviedetails');
        urlDetails.searchParams.append('id', id);
        var urlCredits = new URL('https://searchmovieworld1.azurewebsites.net/moviecredits');
        urlCredits.searchParams.append('id', id);
        var urlReview = new URL('https://searchmovieworld1.azurewebsites.net/moviereview')
        urlReview.searchParams.append('id', id);

    } else {
        var urlDetails = new URL('https://searchmovieworld1.azurewebsites.net/tvshowdetails');
        urlDetails.searchParams.append('id', id);
        var urlCredits = new URL('https://searchmovieworld1.azurewebsites.net/tvcredits');
        urlCredits.searchParams.append('id', id);
        var urlReview = new URL('https://searchmovieworld1.azurewebsites.net/tvreview');
        urlReview.searchParams.append('id', id);
    }

    var imgdiv = document.createElement("div")

    var img = document.createElement("img")
    var modaldetails = document.createElement("div")
    modaldetails.classList.add("modaldetails")
    var p1 = document.createElement("p")
    p1.classList.add("modalcontentname")

    var a1 = document.createElement("a")
    a1.classList.add("modali")
    a1.target = "_blank"
    if (cat == "movies")
        a1.href = "https://www.themoviedb.org/movie" + "/" + id;
    else
        a1.href = "https://www.themoviedb.org/tv" + "/" + id
    var bold = document.createElement("b")
    bold.innerHTML = "&nbsp;" + "&nbsp;" + "&#9432;"
    a1.appendChild(bold)

    var p2 = document.createElement("p")
    p2.classList.add("contenttype")

    var p3 = document.createElement("p")
    p3.classList.add("vote_average")
    var sp1 = document.createElement("span")
    sp1.classList.add("ratingnumber")



    var p4 = document.createElement("p")
    p4.classList.add("modalcontentdesc")
    p4.classList.add("ellipse")

    var p5 = document.createElement("p")
    p5.classList.add("spoken")
    p5.innerHTML = "Spoken languages: "

    var castdiv1 = document.createElement("div")
    var castdiv2 = document.createElement("div")
    castdiv2.classList.add("cast2div")

    var reviewDiv = document.createElement("div")

    fetch(urlDetails)
        .then(response => response.json())
        .then(data => {
            if (data["backdrop_path"] != null) {
                img.src = "https://image.tmdb.org/t/p/w780" + data["backdrop_path"]
            } else {
                img.src = "../static/images/movie-poster-placeholder.jpg"
            }
            var ptext = document.createTextNode(data["title"])
            p1.appendChild(ptext)
            p1.appendChild(a1)

            if (data["release_date"])
                p2.innerHTML = data["release_date"].substring(0, 4) + " | ";
            else
                p2.innerHTML = "N/A | ";

            if (data["genres"].length) {
                for (var i = 0; i < data["genres"].length; i++) {
                    if (i < data["genres"].length - 1)
                        p2.innerHTML += data["genres"][i]["name"] + "," + "&nbsp;";
                    else
                        p2.innerHTML += data["genres"][i]["name"];
                }
            } else {
                p2.innerHTML += "N/A"
            }
            if (data["vote_average"]) {
                sp1.innerHTML = "★" + "&nbsp;" + "&nbsp;" + data["vote_average"] + "&nbsp;" + "&nbsp;";
                p3.appendChild(sp1)
                var sp2 = document.createElement("span")
                sp2.classList.add("vote_average")
                sp2.innerHTML = (String(data["vote_count"]) + " votes").sup()
                p3.appendChild(sp2)
            }

            p4.innerHTML = data["overview"]

            for (var i = 0; i < data["spoken_languages"].length; i++) {
                if (i < data["spoken_languages"].length - 1)
                    p5.innerHTML += data["spoken_languages"][i]["english_name"] + "," + "&nbsp;";
                else
                    p5.innerHTML += data["spoken_languages"][i]["english_name"];
            }

        })


    fetch(urlCredits)
        .then(response => response.json())
        .then(data => {
            for (var x in data) {
                console.log(x, data[x]);
                var imgdiv = document.createElement("div")
                if (x == 0 || x == 4) {
                    imgdiv.classList.add("firstclass")
                    imgdiv.classList.add("ellipse")
                } else
                    imgdiv.classList.add("restclass")
                var img = document.createElement("img")
                if (data[x]["profile_path"] != null)
                    img.src = "https://image.tmdb.org/t/p/w185" + data[x]["profile_path"]
                else
                    img.src = "../static/images/person-placeholder.png"
                var textdiv = document.createElement("div")
                textdiv.classList.add("textdiv")
                var p6 = document.createElement("p")
                var p7 = document.createElement("p")
                var p8 = document.createElement("p")
                p6.classList.add("ellipse1")
                p8.classList.add("ellipse1")
                p6.style.margin = "0"
                p6.style.fontWeight = "bold"
                p6.innerHTML = data[x]["name"]
                if (data[x]["character"]) {
                    p7.style.margin = "0"
                    p7.innerHTML = "AS"
                }
                p8.style.margin = 0
                p8.innerHTML = data[x]["character"]
                textdiv.appendChild(p6)
                textdiv.appendChild(p7)
                textdiv.appendChild(p8)
                imgdiv.appendChild(img)
                imgdiv.appendChild(textdiv)
                if (x < 4)
                    castdiv1.append(imgdiv)
                else
                    castdiv2.append(imgdiv)
            }
        })

    fetch(urlReview)
        .then(response => response.json())
        .then(data => {
            var h1 = document.createElement("h2")
            h1.innerHTML = "Reviews"
            if (data[0])
                reviewDiv.appendChild(h1)
            else {
                h1.innerHTML = "Reviews: N/A"
                reviewDiv.appendChild(h1)
            }
            for (var x in data) {
                var rd = document.createElement("div")
                var p1 = document.createElement("p")
                var b1 = document.createElement("b")
                var p_r = document.createElement("p")
                p_r.classList.add("ratings")
                var sp2 = document.createElement("span")
                sp2.classList.add("ratingnumber")
                b1.innerHTML = (data[x]["username"]).bold()
                    // console.log(Date(data[x]["created_at"]));
                var txt = document.createTextNode(" on " + data[x]["created_at"].substring(5, 7) + "/" + data[x]["created_at"].substring(8, 10) + "/" + data[x]["created_at"].substring(0, 4));
                p1.appendChild(b1)
                p1.appendChild(txt)
                if (data[x]["rating"])
                    sp2.innerHTML = "&#9733;  " + data[x]["rating"] + "/5"
                p_r.appendChild(sp2)
                var p_c = document.createElement("p")
                p_c.innerHTML = data[x]["content"]
                p_c.classList.add("reviewtex")
                var hr1 = document.createElement("hr")
                hr1.classList.add("review_hr")
                rd.appendChild(p1)
                rd.appendChild(p_r)
                rd.appendChild(p_c)
                rd.appendChild(hr1)
                reviewDiv.appendChild(rd)
            }
        })

    var h = document.createElement("h3")
    var br = document.createElement("br")
    h.innerHTML = "Cast"
    modaldetails.appendChild(p1)
    modaldetails.appendChild(p2)
    modaldetails.appendChild(p3)
    modaldetails.appendChild(p4)
    modaldetails.appendChild(p5)
    modaldetails.appendChild(br)
    modaldetails.appendChild(h)
    modaldetails.appendChild(castdiv1)
    modaldetails.appendChild(castdiv2)
    modaldetails.appendChild(br)
    modaldetails.appendChild(reviewDiv)

    imgdiv.classList.add("ModalImage")
    imgdiv.appendChild(img)
    head.appendChild(imgdiv)
    head.append(modaldetails)
    modal.appendChild(head)
    disp.appendChild(modal)

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function fetchData() {

    var query = document.getElementById("searchquery").value
    var category = document.getElementById("category").value
    if (category == "movies") {
        var url = new URL('http://localhost:5002/movie')
        url.searchParams.append('query', query)
    } else if (category == "tvshow") {
        var url = new URL('https://searchmovieworld1.azurewebsites.net/tvshow')
        url.searchParams.append('query', query)
    } else if (category == "bothmt") {
        var url = new URL('https://searchmovieworld1.azurewebsites.net/multisearch')
        url.searchParams.append('query', query)
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (JSON.stringify(data) == '{}') {
                var disp = document.getElementsByClassName("displayresults")[0]
                var d = document.createElement("div")
                d.classList.add("noresclass")
                var p = document.createElement("p")
                p.innerHTML = "No results."
                p.style.color = "white"
                d.appendChild(p)
                disp.appendChild(d)

            } else {
                console.log(data);
                var disp = document.getElementsByClassName("displayresults")[0]

                if (p_there == false) {
                    var h = document.createElement("p")
                    h.innerHTML = "Showing results..."
                    h.classList.add("resultshead")
                    disp.appendChild(h)
                }

                for (const [key, value] of Object.entries(data)) {
                    var disp = document.getElementsByClassName("displayresults")[0]

                    var head = document.createElement("div")
                    head.classList.add("showcontent")

                    var imgdiv = document.createElement("div")
                    var img = document.createElement("img")
                    if (value["poster_path"] != null) {
                        img.src = "https://image.tmdb.org/t/p/w185" + value["poster_path"]
                    } else {
                        img.src = "../static/images/movie_placeholder.png"
                    }
                    imgdiv.classList.add("poster")
                    imgdiv.appendChild(img)
                    head.appendChild(imgdiv)

                    var content = document.createElement("div")
                    content.classList.add("displaycontent")

                    var p1 = document.createElement("p")
                    p1.classList.add("contentheader")
                    p1.innerHTML = value["title"]

                    var p2 = document.createElement("p")
                    p2.classList.add("contenttype")

                    if (value["release_date"])
                        p2.innerHTML = value["release_date"].substring(0, 4) + " | ";
                    else
                        p2.innerHTML = "N/A |";

                    if (value["genre_ids"].length) {
                        for (var i = 0; i < value["genre_ids"].length; i++) {
                            if (i < value["genre_ids"].length - 1) {
                                if (category == "movies")
                                    p2.innerHTML += movie_genre[value["genre_ids"][i]] + "," + "&nbsp;"
                                else if (category == "tvshow")
                                    p2.innerHTML += tv_genre[value["genre_ids"][i]] + "," + "&nbsp;"
                                else {
                                    if (value["media_type"] == "movies")
                                        p2.innerHTML += movie_genre[value["genre_ids"][i]] + "," + "&nbsp;"
                                    else
                                        p2.innerHTML += tv_genre[value["genre_ids"][i]] + "," + "&nbsp;"
                                }
                            } else {
                                if (category == "movies")
                                    p2.innerHTML += movie_genre[value["genre_ids"][i]];
                                else if (category == "tvshow")
                                    p2.innerHTML += tv_genre[value["genre_ids"][i]];
                                else {
                                    if (value["media_type"] == "movies")
                                        p2.innerHTML += movie_genre[value["genre_ids"][i]];
                                    else
                                        p2.innerHTML += tv_genre[value["genre_ids"][i]];
                                }
                            }

                        }
                    } else {
                        p2.innerHTML += " N/A"
                    }

                    var p3 = document.createElement("p")
                    p3.classList.add("ratings")
                    var sp1 = document.createElement("span")
                    sp1.classList.add("ratingnumber")
                    if (value["vote_average"]) {
                        sp1.innerHTML = "&#9733;" + "&nbsp;" + "&nbsp;" + value["vote_average"] + "&nbsp;" + "&nbsp;";
                        p3.appendChild(sp1)
                        var sp2 = document.createElement("span")
                        sp2.classList.add("votecount")
                        sp2.innerHTML = (String(value["vote_count"]) + " votes").sup()
                        p3.appendChild(sp2)
                    } else {
                        sp1.innerHTML = "&#9733;" + "   N/A  ";
                        p3.appendChild(sp1)
                        var sp2 = document.createElement("span")
                        sp2.classList.add("votecount")
                        sp2.innerHTML = ("N/A" + " votes").sup()
                        p3.appendChild(sp2)
                    }

                    var p4 = document.createElement("p")
                    p4.classList.add("contentdesc")
                    p4.classList.add("ellipse")
                    p4.innerHTML = value["overview"]

                    var b = document.createElement("button")
                        // b.classList.add("showmore")
                    b.onclick = () => {
                        if (category == "movies" || category == "tvshow") {
                            showDetails(category + key);
                            // showDetails();
                        } else {
                            showDetails(value["media_type"] + key);
                            // showDetails();
                        }
                    };
                    b.classList.add("button1")
                    b.innerHTML = "Show More"

                    content.appendChild(p1)
                    content.appendChild(p2)
                    content.appendChild(p3)
                    content.appendChild(p4)
                    content.appendChild(b)
                    head.appendChild(content)
                    disp.appendChild(head)
                }
            }
        })
}

function clearprev() {

    var d1 = document.getElementsByClassName("resultshead")
    while (d1[0]) {
        d1[0].parentNode.removeChild(d1[0])
    }

    var d = document.getElementsByClassName("showcontent")
    if (d[0]) {
        p_there = true
        while (d[0]) {
            d[0].parentNode.removeChild(d[0])
        }
    }
    var searchval = document.getElementById("searchquery").value
    var typeval = document.getElementById("category").value
    if (searchval == "" || typeval == "") {
        alert("Please enter valid values.")
    } else {
        fetchData();
    }
}

function cleardivs() {
    p_there = false;
    document.getElementById("searchquery").value = "";
    document.getElementById("category").value = "";
    var d1 = document.getElementsByClassName("resultshead")
    while (d1[0]) {
        d1[0].parentNode.removeChild(d1[0])
    }

    var d = document.getElementsByClassName("showcontent")
    while (d[0]) {
        d[0].parentNode.removeChild(d[0])
    }

    var d = document.getElementsByClassName("showcontent")
    while (d[0]) {
        d[0].parentNode.removeChild(d[0])
    }

    var d = document.getElementsByClassName("noresclass")
    while (d[0]) {
        d[0].parentNode.removeChild(d[0])
    }
}