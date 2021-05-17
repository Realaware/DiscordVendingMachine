import { Client, Collection } from 'discord.js';
import * as fs from 'fs';
import * as ConfigJson from '../Config.json';
import { Command, Config, Event } from '../interface';
import { PrismaClient } from '@prisma/client';
import * as path from 'path';
import Storage from '../others/storage.manager';
import { setstock } from '../others/stock.db';

class BotClient extends Client {

    public prisma:PrismaClient = new PrismaClient();
    public commands: Collection<string,Command> = new Collection();
    public events: Collection<string,Event> = new Collection();
    public Config: Config = ConfigJson;
    public group: Collection<string,Command> = new Collection();
    public FileManager: Storage = new Storage();
    public setStock = setstock;

    public async init() {
        this.login(this.Config.token);


        // Commands
        const commandPath = path.join(__dirname, "../Commands");
        fs.readdirSync(commandPath).forEach(async file => {
            const { command } = await import(`${commandPath}/${file}`);

            this.commands.set(command.name,command);
            this.on(command.name, command.run.bind(null,this));

            if (command?.group.length !== 0) {
                command.group.forEach(child => {
                    this.group.set(child,command);
                })
            }
        })

        // Events
        const eventPath = path.join(__dirname, "../Events");
        fs.readdirSync(eventPath).forEach(async file => {
            const { event } = await import(`${eventPath}/${file}`);

            this.events.set(event.name,event);
            this.on(event.name, event.run.bind(null,this));
        })
    }

}

export default BotClient;