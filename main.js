var songData = [];
var favSongData = [];
var index;
var trackId ;
var trackIdAdded = [];
var unFavTrue = false;
function search() {
    var url = 'https://itunes.apple.com/search?term=' + document.getElementById('songName').value + '&media=music&entity=song'
    fetch(url).then(function (response) {


        response.json().then(function (data) {
          //  console.log(data.results[0]);
            unFavTrue = false;
            songData = [];
            var table = document.getElementById("myTable");
            table.innerHTML = "";
            data.results.forEach(function (element) {

                var newSongData = {
                    songName: element.collectionCensoredName,
                    albumName: element.collectionName,
                    artistName: element.artistName,
                    songDuration: element.trackTimeMillis,
                    trackId: element.trackId,
                    collectionPrice: element.collectionPrice
                };

                songData.push(newSongData);
                var duration = millisToMinutesAndSeconds(element.trackTimeMillis);
                
                creatRows(table, element.collectionCensoredName, element.collectionName, element.artistName, duration, false);
              
              
            })
            creatRows(table, "Song Name", "Album Name", "Artist Name", "Duration", true);
           


        })
    }).then(function (res) {
        console.log(res.status, res.data.title)
    });
    $('#myTable').on('click', 'tr', function () {
        if (unFavTrue) {
            index = (favSongData.length) - ($(this).index());
            trackId = favSongData[index].trackId;
        }
        else {
            index = (songData.length) - ($(this).index());
            trackId = songData[index].trackId;
        }
      //  console.log(index);

        var lookupUrl = 'https://itunes.apple.com/lookup?id=' + trackId;
       
        fetch(lookupUrl).then(function (response) {

            response.json().then(function (data) {
                var str = data.results[0].artworkUrl60;
                str = str.replace("60x60bb", "600x600bb");
               
                document.getElementById("divSetvisibility").style.visibility = 'visible';
                document.getElementById("Td1").innerHTML = "<b>" + songData[index].songName.toString() + "</b>";
                document.getElementById("Td2").innerHTML = songData[index].albumName.toString();
                document.getElementById("Td3").innerHTML = songData[index].artistName.toString();
                document.getElementById("Td4").innerHTML = "<b> Release year:" + data.results[0].releaseDate.toString().substring(0,4) + "</b>";
                document.getElementById("Td5").innerHTML = "<img src=" + str + " " + "width=\"300px\" height=\"250px\">";
                document.getElementById("Td6").innerHTML = "Pricce:" + songData[index].collectionPrice.toString();
                //document.getElementById("Td7").innerHTML = "<b>" + songData[index].songDuration.toString() + "</b>";
                var sts = checkExist(trackId);
               
                if (unFavTrue) {
                    document.getElementById("btnId").innerHTML = "<button type=butto onclick='deleteFav()'>Del</button>";
                    //console.log('true');
                }

                else if (sts === true) {
                    document.getElementById("btnId").innerHTML = "Added";

                }
                else {
                    document.getElementById("btnId").innerHTML = "<button type=button onclick='addToFav()'>Fav</button>";
                   // console.log('false');
                }


            })
        });

    });

}

function addToFav() {
    favSongData.push(songData[index]);
    songData[index].isAded = true;
    trackIdAdded.push(trackId);
    document.getElementById("btnId").innerHTML = "Added";
   // console.log(favSongData[0]);

    // alert(index);
}
function checkExist(id) {
    var status = false;
    for (var i = 0; i < trackIdAdded.length; i++) {
        if (id == trackIdAdded[i]) {
            status = true;
          //  console.log("ststus" + status);
            return status;
            break;
        }
    }
   
    return status;
}
function displayFav() {
    unFavTrue = true;
    var table = document.getElementById("myTable");
    table.innerHTML = "";
    document.getElementById("divSetvisibility").style.visibility = 'hidden';
    for (var i = 0; i < favSongData.length; i++) {

        creatRows(table, favSongData[i].songName, favSongData[i].albumName, favSongData[i].artistName, favSongData[i].songDuration,false)

    }
    creatRows(table, "Song Name", "Album Name", "Artist Name", "Duration", true);
}

function deleteFav() {

    favSongData.splice(index, 1);
    removeA(trackIdAdded, trackId);
    document.getElementById("divSetvisibility").style.visibility = 'hidden'

    displayFav();

}

function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax = arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

function setStyle(cell) {
    cell.style.color = 'white';
    cell.style.backgroundColor = '#4CAF50';
}

function creatRows(tb, str1, str2, str3, str4, isHeader) {

    var row = tb.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    if (isHeader) {
        setStyle(cell1);
        setStyle(cell2);
        setStyle(cell3);
        setStyle(cell4);
    }
    cell1.innerHTML = str1;
    cell2.innerHTML = str2;
    cell3.innerHTML = str3;
    cell4.innerHTML = str4;

}

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}
