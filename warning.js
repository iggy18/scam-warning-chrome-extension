function saveTheDate(){
  date = Date.now()
  localStorage.setItem('lastseen', date)
}

function warningHasBeenSeenInLastTwoHours(){
  now = Date.now()
  lastVisitTimer = parseInt(localStorage.getItem('lastseen')) + 7200000
  if(now <= lastVisitTimer){
    return true;
  } else {
    return false;
  }
}

function warnUserPopUp(){
    const warningBox = toDOM(`
    <section id="warning-container">
        <strong>Your Scam Stopper Chrome extension would like you to take a moment and learn about common scam tactics. This site is sometimes utilized in tech support and refund scams. Click this box to learn more.</strong>
    </section>
    `);
    document.body.appendChild(warningBox)

    warningBox.addEventListener('click',()=> {
        document.body.removeChild(warningBox)
        let clickCounter = 15
        const warningMessage = toDOM(`
            <div id="warning-message">
                <h1 id="alert" >STOP</h1>
                <h1 id="alert">NEVER LOG INTO YOUR BANK ACOUNT OR EMAIL</h1> 
                <h1 id="alert">WHILE USING REMOTE ACCESS SOFTWARE.</h1>
                <h1 id="alert">NEVER...</h1>
                <h3 id="alert">Never trust a call you weren't expecting.</h3>
                <h4 id="alert">If any of the following applies to you, hang up the phone. call a tech savy friend or family member and tell them what is happening to you.</h4>
                <h4 id="alert">Hang up the phone if you have been instructed to ignore this message.</h4>
                <h4 id="alert">Hang up the phone if you have been informed you're due for a refund from tech support.</h4>
                <h4 id="alert">Hang up the phone if you called a number from a popup on your computer claiming something is wrong with you computer.</h4>
                <h4 id="alert"><strong>Hang up the phone if you are asked to log into a bank account while using this software.</strong></h4>
                <h4 id="alert">Hang up the phone if you recive a refund but the amount refunded is "accidentaly" too much. this is how the scam works.</h4>
                <h4 id="alert">Hang up the phone if you are asked to pay back the extra refunded amount.</h4>

                <h4 id="alert"><strong>Hang up the phone if you are asked to purchase gift cards for payment or mail cash.</strong></h4>

                <h4 id="alert">Learn more on about common scam tactics at the <a href="https://www.consumer.ftc.gov/articles/how-avoid-scam" target="_blank" rel="noopener noreferrer">Federal Trade Commission website</a></h4>

                <p id="alert">To clear this warning you have to click anywhere and wait for <span class="time-left">${clickCounter}</span> seconds.</p>
            </div>
        `)
        document.body.appendChild(warningMessage)
        let interval = null;
        warningMessage.addEventListener('mousedown', () => {
            let start = +new Date()
            interval = setInterval(() => {
                const timeLeft = clickCounter - (+new Date() - start) / 1000;
                if(timeLeft < 0 ){
                    setEnabled(false)
                    saveTheDate()
                    document.body.removeChild(warningMessage)
                    clearInterval(interval)
                } else {
                    document.querySelector('.time-left').textContent = timeLeft.toFixed(0)
                }
            }, 1000);
        })
        warningMessage.addEventListener('mouseup', () =>{
            clearInterval(interval)
        })
    })
}

function checkIfWarningAlreadySeen(){
  if (warningHasBeenSeenInLastTwoHours() === true){
    console.log('Warning already seen')
  } else {
    window.localStorage.removeItem('lastseen');
    warnUserPopUp()
  }
}

checkIfWarningAlreadySeen()

function addPathChangeListener(callback) {
    let lastPathName = null
    function checkURL() {
        let pathName = window.location.pathname
        if (pathName === lastPathName) {
            return
        }
    lastPathName = window.location.pathname
    callback(lastPathName)
    }

checkURL()
    let frameRequest = null
    function beginPolling() {
      const start = +new Date()
      if (frameRequest != null) {
        return
      }

    ;(function poll() {
      checkURL()
      if ((+new Date()) - start < 2 * 1000) {
        frameRequest = requestAnimationFrame(poll)
      } else {
        frameRequest = null
      }
    })()
  }

  window.addEventListener("mousedown", beginPolling, true)
  window.addEventListener("keydown", beginPolling, true)
  window.addEventListener("popstate", beginPolling, true)
}

const disableClassName = "disable-warning"

function setEnabled(enabled) {
  if (enabled) {
    document.body.classList.remove(disableClassName)
  } else {
    document.body.classList.add(disableClassName)
  }
}

function toDOM(str) {
  const container = document.createElement("div")
  container.innerHTML = str
  return container.firstElementChild
}
