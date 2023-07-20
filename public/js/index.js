const questionBlock = document.querySelector(".question-block");
let counter = document.querySelector(".counter");
let number = document.querySelector(".number");
const categoryList = document.querySelectorAll(".one.category a");
const levelList = document.querySelectorAll(".one.level a");
const startButton = document.querySelector(".startBtn");
const selector = document.querySelector(".selector");
const section = document.querySelector("section");
//const catBtn = document.querySelector(".one.category h4");
//const levBtn = document.querySelector(".one.level h4");
let  alertQ = new Audio('https://cdn.discordapp.com/attachments/725101478712180808/1078766890635231342/Alert.mp3');
let  sad = new Audio('https://cdn.discordapp.com/attachments/725101478712180808/1078766891658641528/Sad.mp3');
let  tada = new Audio('https://cdn.discordapp.com/attachments/725101478712180808/1078766891012739153/TaDa.mp3');
 let stream =  new Audio("http://65.108.101.89:26064/stream")
let currentPage = 0;
let totalRight = 0;
console.log(totalRight)
let moveOn = false;
let idCategory = "";
let level = "";
let allowNext = false;
let nameCategory = "";
let levelText = "";
let data;
let dataInfo;
let maxPage = 10;
let socketId = ""
let pf = ""
let userId = ""
checkId(categoryList);
checkId(levelList);
//catBtn.addEventListener("click", checkId);
//levBtn.addEventListener("click", checkLevel);
const socket =  io();

socket.on('connect', () => {
    console.log(socket.id); // an alphanumeric id...
    socketId = socket.id
    socket.emit('message', {event: 'connected', data: {socketId: socket.id,userId: userId}});

 });
 
  socket.on('musics', (data) => {
     //  console.log(data)
 if(data.status){
     if ( stream.src != data.link){
     stream.src = data.link;
     }
    ///console.log(stream.src);

                 console.log(stream.currentTime)
                        if (stream.currentTime > 0 && !stream.paused){ 
                         return;                  
                            }else{
                             stream.currentTime = 0;
                             stream.load()
                        stream.play();
                      }
 }else{
      stream.currentTime = 0;
      stream.pause();
 }
  })

    socket.on('update slide', (html) => {
      document.querySelector('#slide').innerHTML = html;
    });

     socket.on('console', (html) => {
        $("#tt1").text(html)
        
    });

     socket.on('disconnect', (html) => {
       console.log("SERVER CRASHED!")
        
    });

    socket.on('WINNER', (data) => {
    console.log(data)
            tada.play()

       $("#myq").text(`${data.msg}! You win ${data.cash} Cash`)

    });

     socket.on('FAIL', (data) => {
        sad.play()

    console.log(data)
       

    });

    
     socket.on('StatusCount', (data) => {
    console.log(data.current+"/"+data.total)
       

    });

 socket.on('shutdown', (data) => {
    
       resetGame()

    });


  socket.on('SHOW ANSWER', (data) => {
    console.log(data)
    $(`#mcq_${data.answer}`).attr('style', 'background-color: green !important')
    $(`#mq0`).text(data.mq1) 
        $(`#mq1`).text(data.mq2) 
    $(`#mq2`).text(data.mq3) 
    $(`#mq3`).text(data.mq4) 

     $(`#mcq_${data.answer}`).append("<span class='progress-bar-fill' style='width: 60%;'></span>")
    });

     socket.on('START QUEST', (data) => {
       console.log(data)
 $("#tt1").text("Winning and fun is now active. Invite your friends to join and win prizes")
    })

    socket.on('SEND REWARD', (data) => {
console.log(data)
  $("#myq").empty();
     $("#ul_q").empty();
  $("#countdown").hide();
  $("#question-rewars").text("Prize delivery");

              data.forEach((song, index) => {
        $("#ul_q").append("<li id=mcq_"+(index)+"><span>"+(song.username)+" </span><i class='material-icons radio'>radio_button_unchecked</i></li>")
    })

    })

     socket.on('RECIVE QUEST', (data) => {
              alertQ.play()

       console.log(data)
                      $("#myq").empty();
                      $("#ul_q").empty();

       $("#myq").text (data.q)
              data.mcq.forEach((song, index) => {
        $("#ul_q").append("<li id=mcq_"+(index)+"><span>"+(song)+" </span><i class='material-icons radio'>radio_button_unchecked</i><span id=mq"+(index)+" style='float: right;'></span></li>")
    })
               $("#onq").empty();
                   selector.style.display = "none";
section.style.display = "flex";


   
     
    /*
        const pQuestion = document.createElement("p");
        const ul = document.createElement("ul");
                pQuestion.innerHTML = data.q;

        questionBlock.appendChild(pQuestion);
        questionBlock.appendChild(ul);

      for (let k = 0; k < data.mcq.length; k++) {
            const li = document.createElement("li");
            const spanLi = document.createElement("span")
            const checkBtn = document.createElement("i");
            checkBtn.className = "material-icons radio";
            checkBtn.textContent = "radio_button_unchecked";
            ul.appendChild(li);
            li.appendChild(spanLi);
            spanLi.innerHTML = data.mcq[k];
            li.appendChild(checkBtn);
        }
        */
        StartCount()

      seleceltanswer()
      
    });




    


function checkId(input) {
console.log(input)
    for (let i = 0; i < input.length; i++) {
        let eachOption = input[i];
        //eachOption.style.display = "block";   
        console.log(eachOption)

        if (input === categoryList){
            eachOption.addEventListener("click", function () {

                for (let j = 0; j < input.length; j++) {
                    let eachO = input[j];
                    eachO.className = "";
                }
    
                idCategory = input[i].id;
                eachOption.className = "active";
                console.log(idCategory)
                pf = idCategory
                nameCategory = input[i].textContent;
                joinGame(userId,pf);
    
            });
        }

        if (input === levelList){
            eachOption.addEventListener("click", function () {

                for (let k = 0; k < input.length; k++) {
                    let eachL = input[k];
                    eachL.className = "";
                }
    
                levelText = input[i].textContent;
                level = levelText.toLowerCase();
                eachOption.className = "active";
                console.log(level)
    
            });
        }

       

        /*catBtn.addEventListener("click", function(){
            if (eachOption.style.display === "none"){
                eachOption.style.display = "block";  
            } else {
                eachOption.style.display = "none";  
            }
            
        }); */
    }
}



startButton.addEventListener("click", function () {

    selector.style.display = "none";
    getInfo()
    .then(render);

})


function getInfo() { //getting all the data from API
    return axios.get("https://opentdb.com/api.php?amount=" + maxPage + "&category=" + idCategory + "&difficulty=" + level + "&type=multiple")
        .then(function (response) {
            // handle success
            dataInfo = response.data.results;
            console.log(dataInfo);
            //render(dataInfo);
            /*for (let i = currentPage; i < currentPage+1; i++){
                data = dataInfo[i];
                render(data); // rendering the array to the DOM
            }*/
            return dataInfo;
        })
        .catch( () => {
            alert("Server is not available! Try again in a few moment.")
        })
}

// render the data from API
function render(info) {
console.log("DATA: ",info)
    section.style.display = "flex";
    console.log(totalRight)

    if (currentPage <= maxPage - 1) {
        

        //data = dataInfo[i];

       
        let eachData = info[currentPage];
        console.log(eachData);

        const gameInfoCat = document.querySelector(".game-info1");
        const gameInfoLev = document.querySelector(".game-info2");
       
       /// const nextBtn = document.createElement("button");
       /// nextBtn.className = "nextBtn";
        ///const cancelBtn = document.createElement("button");
       /// cancelBtn.classList = "reset";
       // nextBtn.textContent = "Next Question";
       // cancelBtn.textContent = "Reset Game";

        gameInfoCat.textContent = nameCategory;
        gameInfoLev.textContent = levelText;
  
       // questionBlock.appendChild(cancelBtn);
       // questionBlock.appendChild(nextBtn);

        //new array with first data in the array is the correct answer API
        let answers = [eachData.correct_answer];

        //pushing new data to the array with incorrect answer from the API
        for (let j = 0; j < eachData.incorrect_answers.length; j++) {
            answers.push(eachData.incorrect_answers[j]);
        }

        // shuffle the answers array
        answers = shuffle(answers);

        //looping through the answers array to print out the list of answers to the DOM
        // all the wrong anwers
     
        if (moveOn === false) {
            selectAnswers()
        }
/*
        nextBtn.addEventListener("click", function () {

            if (allowNext === true) {
                currentPage++;
                checkAnswer(eachData)
                render(dataInfo);
                //getInfo();
                moveOn = false;
                allowNext = false;
            }
        })

        cancelBtn.addEventListener("click", resetGame);
*/
    }

    if (currentPage === maxPage - 1) {
        selectAnswers();
        checkAnswer(info);
        let cancelBtn = document.querySelector(".question-block button.reset");
        cancelBtn.style.display = "none";
        finalPage();
    }

}


//getInfo();

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }

    return array;
}


function selectAnswers() {

    let answersLi = document.querySelectorAll("li");
    let answersLiIcon = document.querySelectorAll("i");
    console.log(answersLi);

    for (let j = 0; j < answersLi.length; j++) {
        let eachAnswerBtn = answersLi[j];
        let eachAnswerIcon = answersLiIcon[j];
        //eachAnswerBtn.childNodes[1].textContent = "radio_button_unchecked";

        eachAnswerBtn.addEventListener("click", function () {

            for (let k = 0; k < answersLi.length; k++) {
                let eachAnswerBtn = answersLi[k];
                let eachAnswerIcon = answersLiIcon[k];
                eachAnswerIcon.textContent = "radio_button_unchecked";
                eachAnswerIcon.style.color = "rgb(128, 97, 57)";
                eachAnswerBtn.className = "";
              

            }
            eachAnswerIcon.textContent = "radio_button_checked";
            eachAnswerBtn.className = "active";
            eachAnswerIcon.style.color = "rgb(128, 97, 57)";
            allowNext = true;
        })
    }
}

function checkAnswer(info) {

    let answersLi = document.querySelectorAll("li span");
    let answersLiIcon = document.querySelectorAll("i");
    //console.log(answersLi);

    for (let j = 0; j < answersLi.length; j++) {
        let eachAnswer = answersLi[j]
        let eachAnswerIcon = answersLiIcon[j];
        console.log(eachAnswer.textContent)
        if (eachAnswerIcon.textContent === "radio_button_checked") {
            if (eachAnswer.textContent === info.correct_answer) {
                totalRight++;
            }
        }
    }

}

function finalPage() {
    let p = document.querySelector(".question-block p");
    let finalBtn = document.querySelector(".question-block button.nextBtn")
    let ul = document.querySelector("ul");
    
    let li = document.querySelector("li");
    finalBtn.textContent = "Check your answers!";

    finalBtn.addEventListener("click", function () {
        let section = document.querySelector("section");
        section.style.flexFlow = "column wrap";
        let questionBlock = document.querySelector(".question-block");
        questionBlock.style.padding = "30px 40px 20px 40px";
        //if (allowNext === true){
        let p1 = document.createElement("p");
        p1.className = "score-num";
        let p2 = document.createElement("p");
        p2.className = "score-text";
        questionBlock.appendChild(p1);
        questionBlock.appendChild(p2);
        
        p.style.display = "none"
        questionBlock.removeChild(ul)
        ul.removeChild(li);
        let sectionH3 = document.querySelector("section h3");
        sectionH3.textContent = "Result"
        p1.textContent = totalRight;
        p2.textContent = "correct answers";
        finalBtn.style.display = "none";
        counter.style.display = "none";

        let resetBtn = document.createElement("button");
        resetBtn.textContent = "Play Again!";
        resetBtn.className = "endButton"
        questionBlock.appendChild(resetBtn);

        resetBtn.addEventListener("click", resetGame);
        allowNext = false;
        moveOn = true;
        //}

    })
}

function resetGame() {
    location.reload();
}


function seleceltanswer() {
  
$('[id^="mcq_"]').click(function() {
   // do something
   console.log($(this)[0])

let myans = ($(this)[0].id)
 axios.get(`/api/client-ans?id=${socketId}&myans=${myans}`)
    .then(function (res) {
        var response = res.data;
        if(response.result == 'ERROR') {
//return showToast("error","User not exist")
return console.log("ERROR")
        }else{
    $(`#${myans}`).attr('style', 'background-color: orange !important');
   

     return console.log("OK")

        }
    })
    .catch(function (error) {});
   

});

}



 
function consoleShowAnswer(ans) {

   // do something
    
 
}

/* Common Frontend JS */

/* NEW VERSION JS */
function searchUser(e) {
 userId = e.value
}


function joinGame(uid,pf) {
  if (!uid ||!pf) return;
       if(uid.length >= 2) {
        axios.get('/funandwin/join/'+uid+"/"+pf+"/"+socketId)
        .then(function (res) {
            var response = res.data;
            if (response.result == "OK"){
                $('#nickname').html(response.username);
  $(".startBtn").show();

            }else{
            $('#nickname').html(response.message);
  $(".startBtn").hide();

            }
           
        })
        .catch(function (error) {});
    }
}
 
function StartCount() {

var timeleft = 10;
var downloadTimer = setInterval(function(){
  if(timeleft <= 0){
    clearInterval(downloadTimer);
    document.getElementById("countdown").innerHTML = "Times Up!";
  } else {
    document.getElementById("countdown").innerHTML = timeleft + " seconds remaining";
  }
  timeleft -= 1;
}, 1000);

}

