import { MessageEmbed } from 'discord.js';
import { Command } from '../interface';

export const command:Command = {
    name: 'help',
    description: 'instruction of bot',
    group: [],
    run: async(client,message,args) => {
        
        const Embed = new MessageEmbed()
        .setTitle('**Help**')
        .setDescription('Some instruction of commands')
        .setColor('#560e78')
        .setTimestamp();

        for (const child of client.commands) {
            const { name,description: desc } = child[1];
            Embed.addField(name,desc,true);
        }

        message.channel.send(Embed);

    }
}