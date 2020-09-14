const { app, globalShortcut } = require('electron')
const { exec } = require('child_process');

let waitingForSecondCommandTimer;

const eventsMap = new Map();
eventsMap.set('t', 'open -a "Firefox" "https://translate.google.com/\#view\=home\&op\=translate\&sl\=en\&tl\=ru"')

app.whenReady().then(() => {
    console.log("Now you can press Command+D then a number of preset")

    const ret = globalShortcut.register('Command+D+D', () => {
        console.log('Command+D is pressed')

        eventsMap.forEach((command, shortcut) => {
            const tmpEvent = globalShortcut.register(shortcut, () => {
                exec(command)
                globalShortcut.unregister(shortcut)
            })

            if (tmpEvent) console.log(`${shortcut} is registered`)
        })

        waitingForSecondCommandTimer = setTimeout(() => {
            eventsMap.forEach((command, shortcut) => {
                globalShortcut.unregister(shortcut)
                console.log(`Unregistered shortcut ${shortcut}`)
            })
        }, 3000);
        
    })

    if (!ret) {
        console.log('registration failed')
    }

    console.log(globalShortcut.isRegistered('Command+D'))
})

app.on('will-quit', () => {
    clearTimeout(waitingForSecondCommandTimer);
    globalShortcut.unregister('Command+D')
    globalShortcut.unregisterAll()
})
