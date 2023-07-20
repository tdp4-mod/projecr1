$(document).ready(() => {
    var audioElement = document.createElement('audio');
    var CurrentSong: Types.Song = {}
    var Queue: Types.Song[] = []
    var loop = false
    var TodaySong = Songs[TodaySongID-1]

    function nextSong() {
        let data = Songs[Math.floor(Math.random() * Songs.length)]
        audioElement.setAttribute('src', data.url);
        CurrentSong = data
        toast(CurrentSong.name + " by " + CurrentSong.author+" has been added to queue")
        audioElement.play();
    }

    nextSong()

    audioElement.addEventListener('ended', async function () {
        if(loop){
            audioElement.play();
            toast("Started playing " + CurrentSong.name + " by " + CurrentSong.author)
            return
        }else if(Queue[0]){
            audioElement.setAttribute('src', Queue[0].url);
            CurrentSong = Queue[0]
            Queue.shift()
        }else nextSong()
        audioElement.play();
        toast("Started playing " + CurrentSong.name + " by " + CurrentSong.author)
        QueueEvent()
    }, false);

    function toast(text) {
        $('#snackbar').text(text)
        var x = document.getElementById("snackbar");
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }

    audioElement.autoplay = true

    audioElement.addEventListener("canplay", function () {
        $("#songName").text(CurrentSong.name);
        $("#songAuthor").text("By "+CurrentSong.author);
        $("#songStatus").text("Status: Ready to play")
        $('#songDuration').text("Duration: " + Math.round(audioElement.duration) + " seconds")
        $('#songStatusBar').attr("data-value", "1")
        $('#songStatusBar').attr("data-total", Math.round(audioElement.duration).toString())
        $("#songCurrentSecond").text("Not Playing, Press play!")
        QueueEvent()
    });

    audioElement.addEventListener("timeupdate", function () {
        $("#songName").text(CurrentSong.name);
        $("#songAuthor").text("By "+CurrentSong.author);
        $("#songStatus").text("Status: Playing")
        $('#songDuration').text("Duration: " + Math.round(audioElement.duration) + " seconds")
        $('#songStatusBar').attr("data-value", Math.round(audioElement.currentTime))
        //@ts-ignore because this is semantic ui method
        $('#songStatusBar').progress({
            total: Math.round(audioElement.duration),
            value: Math.round(audioElement.currentTime)
        })
        $('#songStatusBar').attr("data-total", Math.round(audioElement.duration).toString())
        $("#songCurrentSecond").text("Current Second: "+Math.round(audioElement.currentTime))
    });

    function triggerLoop(){
        if(loop === false)loop = true
        else loop = false
        $("#songLoop").text(loop?"Loop: Enabled":"Loop: Disabled")
        toast(loop?"Loop has been successfully Enabled":"Loop has been successfully Disabled")
    }

    Songs.forEach((song, index) => {
        $("#SongsListArea").append("<tr><td class='center aligned'>"+(index+1)+"</td><td class='center aligned'>"+song.name+"</td><td class='center aligned'>"+song.author+"</td></tr>")
    })

    $("#TodaySongList").append("<tr><td class='center aligned'>"+(TodaySongID)+"</td><td class='center aligned'>"+TodaySong.name+"</td><td class='center aligned'>"+TodaySong.author+"</td></tr>")

    // Button Click Events
    $("#playButton").click(function (){
        audioElement.play();
        $("#songStatus").text("Status: Playing")
        toast("Started Playing!")
    })

    $("#pauseButton").click(function (){
        audioElement.pause();
        $("#songStatus").text("Status: Paused");
        toast("Paused the music!")
    })

    $("#restartButton").click(function(){
        audioElement.currentTime = 0;
        toast("Current song has been successfully restarted!")
    })

    $("#VolumeControl").on('input', (data) => {
        let volume = parseInt($("#VolumeControl").val().toString())
        if(volume === 1)volume = 0.1
        else if(volume === 2)volume = 0.2
        else if(volume === 3)volume = 0.3
        else if(volume === 4)volume = 0.4
        else if(volume === 5)volume = 0.5
        else if(volume === 6)volume = 0.6
        else if(volume === 7)volume = 0.7
        else if(volume === 8)volume = 0.8
        else if(volume === 9)volume = 0.9
        else if(volume === 10)volume = 1.0
        else volume = 0.0
        audioElement.volume = volume
    })

    $("#loopButton").click(function (){
        triggerLoop()
    })

    $("#songsListButton").click(function (){
        //@ts-ignore because this is semantic ui method
        $('#SongsListModel').modal('show');
    })

    $("#todaySongButton").click(function (){
        //@ts-ignore because this is semantic ui method
        $('#TodaySongModel').modal('show');
    })

    $("#TodaySongPlay").click(() => {
        let data = TodaySong
        audioElement.setAttribute('src', data.url);
        CurrentSong = data
        toast(CurrentSong.name + " by " + CurrentSong.author+" has been started playing")
        audioElement.play();
    })

    $("#nextButton").click(function (){
        if(Queue[0]){
            let data = Queue[0]
            audioElement.setAttribute('src', data.url);
            CurrentSong = data
            toast(CurrentSong.name + " by " + CurrentSong.author+" has been added to queue")
            audioElement.play();
            Queue.shift()
            QueueEvent()
        }else nextSong()
    })

    //Custom Play/Queue
    $("#CustomPlayButton").click(function (){
        let SongID = $("#customSongInput").val().toString()
        if(!SongID)return toast("Song ID not provided")
        else if(!SongID.length)return toast("Song ID not provided")
        else if(SongID.length < 0)return toast("Song ID not provided")
        else if(!parseInt(SongID))return toast("Song ID is not a number")
        else {
            let xd = Songs[parseInt(SongID)-1]
            if(!xd)return toast("Song not found!")
            else {
                CurrentSong = xd
                audioElement.setAttribute('src', CurrentSong.url);
                audioElement.play();
                toast("Started playing " + CurrentSong.name + " by " + CurrentSong.author)   
            }
        }
    })

    $("#CustomQueueButton").click(function(){
        let SongID = $("#customSongInput").val().toString()
        if(!SongID)return toast("Song ID not provided")
        else if(!SongID.length)return toast("Song ID not provided")
        else if(SongID.length < 0)return toast("Song ID not provided")
        else if(!parseInt(SongID))return toast("Song ID is not a number")
        else {
            let xd = Songs[parseInt(SongID)-1]
            if(!xd)return toast("Song not found!")
            else {
                Queue.push(xd)
                toast(xd.name+" has been added to queue")
                QueueEvent()
            }
        }
    })

    QueueEvent()

    $("#SongSearchInput").on("input", () => {
        let value = $("#SongSearchInput").val()
        let findIndex = (n: string) => Songs.findIndex(a => a.name.toLowerCase() === n.toLowerCase())
        let Suggestions = Songs.filter(x => new RegExp(`^${value}`, "i").test(x.name) || new RegExp(`^${value}`, "i").test(x.author)).map((song) => "<tr><td class='center aligned'>"+(findIndex(song.name)+1)+"</td><td class='center aligned'>"+song.name+"</td><td class='center aligned'>"+song.author+"</td></tr>")
        $("#SongsListArea").html(Suggestions.join("\n"))
    })

    async function QueueEvent(){
        if(Queue.length > 0){
            $("#AllSongsQueue").html(Queue.map(a => '<div class="ui centered card"><div class="content"><div class="header">'+a.name+'</div><div class="meta">by '+a.author+'</div></div></div>').join("\n"))
        }else if(Queue.length <= 0){
            $("#AllSongsQueue").html('<div class="ui centered card"><div class="content"><div class="header">Empty Queue</div><div class="meta">No Songs to play next, So it choose a random song next!</div></div></div>')
        }
    }

    $("#DiscordButton").click(function(){
        window.open("https://discord.gg/JZjbCTWjqM")
    })

    $("#YouTubeButton").click(function(){
        window.open("https://www.youtube.com/channel/UCe21_ExA95OMEQZXco8dPmQ?sub_confirmation=1")
    })

    $("#GithubButton").click(function(){
        window.open("https://github.com/GreenTreeTeam/ChillingMusic")
    })
})