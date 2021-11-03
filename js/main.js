const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn= wrapper.querySelector(".play-pause"),
prevBtn= wrapper.querySelector("#prev"),
nextBtn= wrapper.querySelector("#next"),
progressArea= wrapper.querySelector(".progress-area"),
progressBar= wrapper.querySelector(".progress-bar"),
musicList= wrapper.querySelector(".music-list"),
showMoreBtn= wrapper.querySelector("#more-music"),
hideMusicBtn= musicList.querySelector("#close");


let volume_show =document.querySelector('#volume_show');
let recent_volume =document.querySelector('#volume');

let musicIndex = Math.floor((Math.random()*allMusic.length)+1);



// call music function when window loaded
window.addEventListener("load", ()=>{
    loadMusic(musicIndex);
    playingNow();
})
// load music function
function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `./images/${allMusic[indexNumb-1].img}.jpg`;
    mainAudio.src = `./songs/${allMusic[indexNumb-1].src}.mp3`;
}

// play music function
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText="pause";
    mainAudio.play();
}
// pause music function
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText="play_arrow";
    mainAudio.pause();
}

//next music function
function nextMusic(){
    //just increment of index 1
    musicIndex++;
    //if music index > length of array music list then return index =1
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex=musicIndex ;
    loadMusic(musicIndex);
    playMusic();
    playingNow()
}

//prev music function
function prevMusic(){
    //just increment of index 1
    musicIndex--;
    //if music index > length of array music list then return index =1
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex=musicIndex ;
    loadMusic(musicIndex);
    playMusic();
    playingNow()
}

// play or music button event
playPauseBtn.addEventListener("click", () =>{
    const isMusicPaused = wrapper.classList.contains("paused");
    // if isMusicPaused is true then call pauseMusic else call playMusic
    isMusicPaused ? pauseMusic(): playMusic();
    playingNow()
});

// next music btn event
nextBtn.addEventListener("click", ()=>{
    nextMusic(); //call next music function
});
// prev music btn event
prevBtn.addEventListener("click", ()=>{
    prevMusic(); //call prev music function
});

// update progress bar width according to music current
mainAudio.addEventListener("timeupdate", (e)=>{
    const currentTime = e.target.currentTime; // getting current time of song
    const duration = e.target.duration; // getting total duration of song
    let progressWidth=(currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;
    let musicCurrentTime = wrapper.querySelector(".current"),
        musicDuration = wrapper.querySelector(".duration");
    mainAudio.addEventListener("loadeddata", ()=>{
        // update song total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration /60);
        let totalSec = Math.floor(audioDuration %60);
        if(totalSec < 10)//if sec<10 inner 0
        {
            totalSec=`0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });
    // update playing song current time
    let currentMin = Math.floor(currentTime /60);
    let currentSec = Math.floor(currentTime %60);
    if(currentSec < 10)//if sec<10 inner 0
    {
        currentSec=`0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// update playing song current time on according to the progress bar width
progressArea.addEventListener("click",(e)=>{
    let progressWidthval = progressArea.clientWidth;//getting width of progress bar
    let clickedOffSetX = e.offsetX;// getting offset x value
    let songDuration = mainAudio.duration; // getting song total duration

    mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
    playMusic();//if user click on the progress bar then music will play
});

// repeat and shuffle icon

const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", ()=>{
    //first we get the inner text of the icon then we will change accordingly
    let getText = repeatBtn.innerText;//getting inner tex of icon
    //let is go different changes on different icon click using switch
    switch(getText){
        case "repeat":// if icon repeat then change it to repeat_one
        repeatBtn.innerText="repeat_one";
        repeatBtn.setAttribute("title","Song looped");
        break;
        case "repeat_one":// if icon repeat_one then change it to shuffle
        repeatBtn.innerText="shuffle";
        repeatBtn.setAttribute("title","Playback shuffle");
        break;
        case "shuffle":// if icon shuffle then change it to repeat
        repeatBtn.innerText="repeat";
        repeatBtn.setAttribute("title","Playlist looped");
        break;
    }
});

// above we just changed the icon now work on what to do
// after the song ended

mainAudio.addEventListener("ended", ()=>{
    //if user set icon loop
    let getText=repeatBtn.innerText;
    switch(getText){
        case "repeat":// if icon repeat then change it to repeat_one
        nextMusic();
        break;
        case "repeat_one":// if icon repeat_one then change it to shuffle
        mainAudio.currentTime = 0;
        loadMusic(musicIndex);
        playMusic();
        break;
        case "shuffle":// if icon shuffle then change it to repeat
        // create random index song
        let randIndex = Math.floor((Math.random()*allMusic.length)+1);
        do{
             randIndex = Math.floor((Math.random()*allMusic.length)+1);

        }while(musicIndex == randIndex);
        musicIndex=randIndex;
        loadMusic(musicIndex);
        playMusic();
        playingNow()
        break;
    }
});

showMoreBtn.addEventListener("click" , ()=>{
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click" , ()=>{
    showMoreBtn.click();
});

const ulTag= wrapper.querySelector("ul");

for(let i = 0;i < allMusic.length ; i++){
    let liTag = ` <li li-index="${i + 1}">
                <div class="row">
                    <span>${allMusic[i].name}</span>
                    <p>${allMusic[i].artist}</p>
                </div>
            <audio class="${allMusic[i].src}" src="./songs/${allMusic[i].src}.mp3"></audio>
                <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
            </li> `; 
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
    liAudioTag.addEventListener("loadeddata",()=>{
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration /60);
        let totalSec = Math.floor(audioDuration %60);
        if(totalSec < 10)//if sec<10 inner 0
        {
            totalSec=`0${totalSec}`;
        }
       liAudioDuration.innerText = `${totalMin}:${totalSec}`;
       liAudioDuration.setAttribute("t-duration" , `${totalMin}:${totalSec}`);
    });
}
//play particular song on click
const allLiTags = ulTag.querySelectorAll("li");
function playingNow(){
    for(let j=0; j<allLiTags.length;j++){
        let audioTag = allLiTags[j].querySelector(".audio-duration");
        // if there is an li tag which li-index is equal to musicIndex
        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }
        // then this music is playing now and we will style it
        if(allLiTags[j].getAttribute("li-index") == musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "playing";
        }
    
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    } 
}

// play music when click  li tag
function clicked(element){
    //getting li index of particular clicked li tag
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

function mute_sound(){
    mainAudio.volume=0;
    volume.value=0;
    volume_show.innerHTML=0;
}
function volume_change(){
    volume_show.innerHTML= recent_volume.value;
    mainAudio.volume= recent_volume.value /100;
}