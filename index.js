const { app, globalShortcut } = require('electron')
const { exec, execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const userDataPath = app.getPath('userData')
console.log(userDataPath);
const pathToCommands = path.join(userDataPath, 'commands.json')

if (!fs.existsSync(pathToCommands)) {
    const defaultLinks = {
        "i": "open https://github.com/dperyel/shortcuts/blob/master/README.md",
    };
    fs.writeFileSync(pathToCommands, JSON.stringify(defaultLinks), { recursive: true, })
}

const commandsRow = fs.readFileSync(pathToCommands)
const commands = JSON.parse(commandsRow)

let waitingForSecondCommandTimer;

app.whenReady().then(() => {
    console.log("Now you can press Command+D then a number of preset")

    const ret = globalShortcut.register('Command+D', () => {
        console.log('Command+D is pressed')

        iterateCommands((shortcut, commands) => {
            const tmpEvent = globalShortcut.register(shortcut, () => {
                globalShortcut.unregister(shortcut)
                if (Array.isArray(commands)) {
                    commands.forEach(command => execSync(command))
                } else {
                    exec(commands)
                }
            })

            if (tmpEvent) console.log(`${shortcut} is registered`)
        }) 

        waitingForSecondCommandTimer = setTimeout(() => {
            iterateCommands(shortcut => {
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

function iterateCommands(fn) {
    for (const command of Object.keys(commands)) {
        fn(command, commands[command]);
    }
}
