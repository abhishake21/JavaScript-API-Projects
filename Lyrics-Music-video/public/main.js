const songInput = document.querySelector('.song-input');
const artistInput = document.querySelector('.artist-input');
const submitBtn = document.querySelector('.btn');
const musicVideo = document.querySelector('.music-video');
const lyricsBox = document.querySelector('.lyrics');
const loader = document.querySelector('.loader');


submitBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    if (songInput.value.length===0 || artistInput.value.length===0){
        alert('Enter Song and Artist name');
    } else {
        const songName = songInput.value;
        const artistName = artistInput.value;
        
        musicVideo.innerHTML = '';
        lyricsBox.innerHTML = '';

        loader.classList.remove('d-none');
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
        loader.className += ' d-none';
    } else {
        const formatLyrics = lyrics => lyrics.split("\n").join("<br>");
        const lyrics =  formatLyrics(data.lyrics).replace(/<br><br>/g,"<br>");
        loader.className += ' d-none';

        let output = `
        <h2>Lyrics</h2>
        <p>${lyrics}</p>
        `
        getYtVideo(songName, artistName);
        lyricsBox.innerHTML = output;
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
        musicVideo.innerHTML = output;
        musicVideo.className += ' video-position';
    } catch {
        alert("Something went wrong.");
        loader.className += ' d-none';
    }
}
