const songInput = document.querySelector('.song-input');
const artistInput = document.querySelector('.artist-input');
const submitBtn = document.querySelector('.btn');


submitBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    if (songInput.value.length===0 || artistInput.value.length===0){
        alert('Enter Song and Artist name');
    } else {
        const songName = songInput.value;
        const artistName = artistInput.value;
        
        getLyrics(songName, artistName);
    }
});

async function getLyrics(songName, artistName) {
    let url = `https://api.lyrics.ovh/v1/${artistName}/${songName}`
    const response = await fetch(url);
    const data = await response.json();

    
    if (data.error){
        alert('Oops, lyrics not availale to this song.');
        songInput.value = '';
        artistInput.value = '';
    } else {
        const formatLyrics = lyrics => lyrics.split("\n").join("<br>");
        const lyrics =  formatLyrics(data.lyrics).replace(/<br><br>/g,"<br>");

        let output = `
        <h2>Lyrics</h2>
        <p>${lyrics}</p>
        `
        getYtVideo(songName, artistName);
        document.querySelector('.lyrics').innerHTML = output;
        songInput.value = '';
        artistInput.value = '';
    }
}

async function getYtVideo(songName, artistName) {
    try {
        let url = `/video?part=snippet&type=video&q=${artistName}+${songName}`;
        const response = await fetch(url);
        const data = await response.json();
        const videoID = data.items[0].id.videoId;
        let output = `
        <iframe id="ytplayer" src="https://www.youtube.com/embed/${videoID}?enablejsapi=1" allowfullscreen></iframe>
        `
        document.querySelector('.music-video').innerHTML = output;
        document.querySelector('.music-video').className += ' video-position';
    } catch {
        alert("Something went wrong.");
    }
}
