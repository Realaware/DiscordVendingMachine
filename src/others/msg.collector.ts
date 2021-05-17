import { AwaitMessagesOptions, Message } from 'discord.js';

export const collector = (message: Message, config: AwaitMessagesOptions = {time: 60000}) => {
    
    const filter = msg => msg.author.id === message.author.id;


    return message.channel.awaitMessages(filter,config);
}