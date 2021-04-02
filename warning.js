function warnUser(){
    const warningBox = toDOM(`
    <section class="warning-container">
        <strong>If you can see this bar it's because you're on a website commonly used in scams. click here to prevent yourself from being scamed.</strong>
    </section>
    `);
    document.body.appendChild(warningBox)

    warningBox.addEventListener('click',()=> {
        
        let clickCounter = 30
        const warningMessage = toDOM(`
            <section id="warning-message">
                <h1>!!STOP!!</h1>
                <h2>NEVER LOG INTO YOUR BANK ACOUNT WHILE USING REMOTE ACCESS SOFTWARE</h2>
                <h1>NEVER!</h1>
                <h3>if you find yourself in ANY of the following situations while using the remote access software you've been asked to download, hang up the phone. you could become the victim of a scam. call a tech-savy friend or family member and explain to them what is happening to you.</h3>
                <h4>... you have been instructed to ignore this message</h4>
                <h4>... you have been informed you're due for a refund from tech support</h4>
                <h4>... you are asked to log into a bank account while using this software</h4>
                <h4>... you recive a refund but the amount refunded is "accidentaly" too much</h4>
                <h4>... you are asked to pay back the extra refunded amount</h4>
                <h4>... you are asked to purchase gift cards for payment or mail cash</h4>

                <p>to clear this warning you have to click and hold for <span class="time-left">${clickCounter}</span> seconds.</p>
            </section>
        `)
        document.body.appendChild(warningMessage)
        let interval = null;
        warningMessage.addEventListener('mousedown', () => {
            let start = +new Date()
            interval = setInterval(() => {
                const timeLeft = clickCounter - (+new Date() - start) / 1000;
                if(timeLeft < 0 ){
                    setEnabled(false)
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

warnUser()

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

function enableFeedOnPathsOtherThan(blockedPaths) {
  addPathChangeListener((path) => {
    if (blockedPaths.includes(path)) {
      setEnabled(true)
    } else {
      setEnabled(false)
    }
  })
}

function toDOM(str) {
  const container = document.createElement("div")
  container.innerHTML = str
  return container.firstElementChild
}