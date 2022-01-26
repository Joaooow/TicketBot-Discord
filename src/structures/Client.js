const { Client } = require('discord.js')
const { readdirSync } = require('fs')
const { join } = require('path')
module.exports = class extends Client {
    constructor (option) {
        super(option)

        this.commands = []
        this.loadCommands()
        this.loadEvents()
    }

    registryCommands() {
        this.guilds.cache.get(this.config.id_servidor).commands.set(this.commands)
    }


    loadCommands(path = 'src/commands') {
        const categories = readdirSync(path)

        for (const category of categories) {
            const commands = readdirSync(`${path}/${category}`)

            for (const command of commands) {
                const commandClass = require(join(process.cwd(), `${path}/${category}/${command}`))
                const cmd = new (commandClass)(this)

                this.commands.push(cmd)
                console.log(`Comando: ${cmd.name} carregado!`)
            }
        }
    }

    loadEvents(path = 'src/events') {
        const categories = readdirSync(path)

        for (const category of categories) {
            const events = readdirSync(`${path}/${category}`)

            for (const event of events) {
                const eventClass = require(join(process.cwd(), `${path}/${category}/${event}`))
                const evt = new (eventClass)(this)

                this.on(evt.name, evt.run)
                console.log(`Evento: ${evt.name} carregado!`)
            }
        }
    }
}