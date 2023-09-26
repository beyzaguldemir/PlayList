/*Elementlere ulasma -obje olusturma*/ 
const prevButton=document.getElementById('prev')
const nextButton=document.getElementById('next')
const repeatButton=document.getElementById('repeat')
const shuffleButton=document.getElementById('shuffle')
const audio=document.getElementById('audio')
const songImage=document.getElementById('song-image')
const songName=document.getElementById('song-name')
const songArtist=document.getElementById('song-artist')
const pauseButton=document.getElementById('pause')
const playButton=document.getElementById('play')
const playListButton=document.getElementById('playlist')

const maxDuration=document.getElementById('max-duration')
const currentTimeRef=document.getElementById('current-time')

const progressBar=document.getElementById('progress-bar')
const playListContainer=document.getElementById('playlist-container')
const closeButton=document.getElementById('close-button')
const playListSongs=document.getElementById('playlist-songs')

const currentProgress=document.getElementById('current-progress')

//indis
let index
//tekrarı
let loop
//decode veya parse
const songList=[
    {
        name:"Jest Oldu",
        link:"assets/jestOldu.mp3",
        artist:"Anneke Van Gierbersen",
        image:"assets/anneke.jpg"
    },
    {
        name:"Middle of the Night",
        link:"assets/middleOf.mp3",
        artist:"Elley Duhe",
        image:"assets/elleyduhe.jpg"
    },
    {
        name:"Dayan Kalbim",
        link:"assets/dayanKalbim.mp3",
        artist:"Anneke Van Gierbersen",
        image:"assets/gokhankirdar.jpg"
    },
    {
        name:"Die for Me",
        link:"assets/dieforMe.mp3",
        artist:"Post Malone",
        image:"assets/postmalone.jpg"
    },
    {
        name:"Belki Ustumuzden Bir Kus Gecer",
        link:"assets/belki.mp3",
        artist:"Yuksek Sadakat",
        image:"assets/yukseksadakat.jpg"
    }

]

//Olaylar Objesi
let events={
    mouse:{
        click:"click"
    },
    touch:{
        click:"touchstart"

    }
}
let deviceType=""
const isTouchDevice=()=>{
    try {
        document.createEvent('TouchEvent')
        deviceType="touch"
         return true
    } catch (error) {
        deviceType="mouse"
        return false
        
    }
}

//zaman formatlama
const timeFormatter=(timeInput)=>{
    let minute=Math.floor(timeInput/60)
    minute=minute<10 ? "0"+ minute : minute
    let second=Math.floor(timeInput%60)
    second=second<10 ? "0"+ second : second
    return `${minute}:${second}`
}

//set song
const setSong=(arrayIndex)=>{
    //tum ozellikler
    console.log(arrayIndex)
    let{name,link,artist,image}=songList[arrayIndex]
    audio.src=link
    songName.innerHTML=name
    songArtist.innerHTML=artist
    songImage.src=image

    //sureyi goster
    audio.onloadedmetadata=()=>{
        maxDuration.innerText=timeFormatter(audio.duration)
    }
    playListContainer.classList.add("hide")
    playAudio()
}

//sarkiyi oynat
const playAudio=()=>{
    audio.play()
    pauseButton.classList.remove('hide')
    playButton.classList.add('hide')
}

//sarkiyi tekrar
repeatButton.addEventListener('click',()=>{
    if(repeatButton.classList.contains('active')){
        repeatButton.classList.remove('active')
        audio.loop=false
        console.log('tekrar kapatildi')
    }else{
        repeatButton.classList.add('active')
        audio.loop=true
        console.log('tekrar acik')
    }
})

//sonraki sarkiya git
const nextSong=()=>{
    //eger dongu acik caliyorsa
    if(loop){
        if(index==(songList.length-1)){
            //sondaysa basa sar
            index=0
        }else{
            index+=1
        }
        setSong(index)
        
    }else{
        let randIndex=Math.floor(Math.random()*songList.length)
        console.log(randIndex)
        setSong(randIndex)
    }
    playAudio()
}

//sarkiyi durdur
const pauseAudio=()=>{
    audio.pause()
    pauseButton.classList.add('hide')
    playButton.classList.remove('hide')
}

//onceki sarki
const previousSong=()=>{
    if(index>0){
        pauseAudio()
        index-=1

    }else{
        index=songList.length-1
    }
    setSong(index)
    playAudio()
}

//siradakine gec
audio.onended=()=>{
    nextSong()
}


//sarkilari karistir
shuffleButton.addEventListener('click',()=>{
    if(shuffleButton.classList.contains('active')){
        shuffleButton.classList.remove('active')
        loop=true
        console.log('karistirma kapali')
    }else{
        shuffleButton.classList.add('active')
        loop=false
        console.log('karistirma acik')
    }
})

//play button
playButton.addEventListener('click',playAudio)

//next button
nextButton.addEventListener('click',nextSong)

//pause button
pauseButton.addEventListener('click',pauseAudio)

//prev button
prevButton.addEventListener('click',previousSong)

isTouchDevice()
progressBar.addEventListener("click", (event)=>{
    //progress bari baslat
    let coordStart=progressBar.getBoundingClientRect().left

    //fare ile dokunarak
    let coordEnd= event.clientX
    let progress=(coordEnd-coordStart)/progressBar.offsetWidth

    //genisligi ata
    currentProgress.style.width=progress*100+"%"

    //zamani ata
    audio.currentTime=progress*audio.duration

    //oynat
    audio.play()
    pauseButton.classList.remove('hide')
    playButton.classList.add('hide')

})

//zaman aktikca guncelle
setInterval(() => {
    currentTimeRef.innerHTML=timeFormatter(audio.currentTime)
    currentProgress.style.width=(audio.currentTime/audio.duration.toFixed(3))*100+"%"
},1000);

//zaman guncellemsi
audio.addEventListener('timeupdate',()=>{
    currentTimeRef.innerText=timeFormatter(audio.currentTime)
})

window.onload=()=>{
    index=0
    setSong(index)
    initPlayList()
}
const initPlayList=()=>{
    for(let i in songList){
        playListSongs.innerHTML+=`<li class="playlistSong" onclick="setSong(${i})">
        <div class="playlist-image-container">
            <img src="${songList[i].image}"/>
        </div>
        <div class="playlist-song-details">
            <span id="playlist-song-name">
                ${songList[i].name}
            </span>
            <span id="playlist-song-album">
            ${songList[i].artist}
            </span>

        </div>
        </li>
        `
    }
}

//sarki listesini goster
playListButton.addEventListener('click',()=>{
    playListContainer.classList.remove('hide')
})

//sarki listesini kapat
closeButton.addEventListener('click',()=>{
    playListContainer.classList.add('hide')
})
