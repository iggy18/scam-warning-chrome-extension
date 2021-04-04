function saveTheDate() {
  date = Date.now()
  localStorage.setItem('lastseen', date)
}

function warningHasBeenSeenInLastTwoHours() {
  now = Date.now()
  lastVisitTimer = parseInt(localStorage.getItem('lastseen')) + 7200000
  if (now <= lastVisitTimer) {
    return true;
  } else {
    return false;
  }
}

function warnUserPopUp() {
  const warningBox = toDOM(`
    <section id="warning-container">
        <strong>Your Scam Stopper Chrome extension would like you to take a moment and learn about common scam tactics. This site is sometimes utilized in tech support and refund scams. Click this box to learn more.</strong>
    </section>
    `);
  document.body.appendChild(warningBox)

  warningBox.addEventListener('click', () => {
    document.body.removeChild(warningBox)
    let clickCounter = 15
    const warningMessage = toDOM(`
            <section id="warning-message">
                <h6 id="bigger" >STOP</h6>
                <h6 id="alert">NEVER LOG INTO YOUR BANK, EMAIL, OR AMAZON ACCOUNT</h6> 
                <h6 id="alert">WHILE USING REMOTE ACCESS SOFTWARE.</h6>
                <h6 id="alert">NEVER...</h6>
                <h6 id="alert">Never trust a call you weren't expecting.</h6>
                <h6 id="bigger">Below are common scam tactics used in remote scams. Is any of this happening to you?</h6>
                <h6 id="alert">You have been instructed to ignore this message. You're speaking to a scammer.</h6>
                <h6 id="alert">You have been informed you're due for a refund from tech support. This is a scam.</h6>
                <h6 id="alert">You called a number from a popup on your computer claiming something is wrong with you computer. This is a scam.</h6>
                <h6 id="alert">Someone called you claiming your computer or account has been hacked. This is a scam.</h6>
                <h6 id="alert">You are asked to log into a bank account while using remote access software. This is a scam.</h6>
                <h6 id="alert">You recive a refund but the amount refunded is "accidentaly" too much. This is a scam.</h6>
                <h6 id="alert">You are asked to pay back the extra refunded amount. This is a scam.</h6>
                <h6 id="alert">You are asked to purchase gift cards for payment or mail cash. This is a scam.</h6>
                <h6 id="bigger">if you are ever asked to purchase gift cards for payment you're being scammed.</h6>
                <h6 id="alert">Learn more on about common scam tactics at the <a href="https://www.consumer.ftc.gov/articles/how-spot-avoid-and-report-tech-support-scams" target="_blank" rel="noopener noreferrer">Federal Trade Commission website</a></h6>
                <h6 id="alert">To clear this warning you have to click anywhere and wait for <span class="time-left">${clickCounter}</span> seconds.</h6>
            </section>
        `)
    document.body.appendChild(warningMessage)
    let interval = null;
    warningMessage.addEventListener('mousedown', () => {
      let start = +new Date()
      interval = setInterval(() => {
        const timeLeft = clickCounter - (+new Date() - start) / 1000;
        if (timeLeft < 0) {
          setEnabled(false)
          saveTheDate()
          document.body.removeChild(warningMessage)
          clearInterval(interval)
        } else {
          document.querySelector('.time-left').textContent = timeLeft.toFixed(0)
        }
      }, 1000);
    })
    warningMessage.addEventListener('mouseup', () => {
      clearInterval(interval)
    })
  })
}

function checkIfWarningAlreadySeen() {
  if (warningHasBeenSeenInLastTwoHours() === true) {
    console.log('Warning already seen')
  } else {
    window.localStorage.removeItem('lastseen')
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

    ; (function poll() {
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
