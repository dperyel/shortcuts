# Shortcuts

Simplifies a way to run some often used commands.

First press `Command+D` it'll register all sub-commands from `store/commands.json`. During the next 3 seconds you can press a registered shortcut to run a command. After 3 seconds all sub-commands will be unregistered.

`~/Library/Application\ Support/shortcuts-combination/commands.json` contains a map of a shortcut to a commands. The format of JSON should look like this:
```json
{
    "t": "open -a Firefox https://translate.google.com/#view=home&op=translate&sl=en&tl=ru",
    "n": [
        "open -a Firefox https://news.ycombinator.com/",
        "open -a Firefox https://nltimes.nl/"
    ]
}
```
first you specify a command then provide a string with a command to run or provide a list of commands which will run synchronously.

To build runnable app, use `yarn dist`. You'll get a `dmg` file in dist folder.

Run `yarn start` from console, better to use screen do not close it accidentally.
So far the list is hardcoded but might be collected in a file on application path level.
