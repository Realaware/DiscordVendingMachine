import { Command } from '../interface';
import { MessageEmbed } from 'discord.js';
import axios from 'axios';

const setstockArgs = new MessageEmbed()
.setTitle('set Stock')
.setDescription('set Stock args\n `command` + `name`[string] + ```some text\nof\nreward```[field | file]')
.setTimestamp();

export const command: Command = {
    name: 'setstock',
    description: 'set reward that one who bought product receive.',
    group: ['admin','useronly'],
    run: async(client,message,args) => {
        const name: string = args[0];
        const field: string = args[1];
        const data = await client.prisma.product.findUnique({where:{name}});

        if (data) {
            if (message.attachments.size > 0) {
                const { name:subname, url } = message.attachments.first();

                if (subname.split('.').lastIndexOf('txt') != -1) {

                    axios.get(url)
                    .then(async response => {

                        const length = response.data.split('\n').length;

                        client.FileManager.EditFile(name,response.data);
                        client.setStock(name,length);

                        message.channel.send('Done.');
                    })
                    .catch(() => {
                        message.channel.send('Failed to fetch data from url.');
                    })

                    return;
                }
                
                message.channel.send('Invalid type of extension.');
                return;
            }

            const rawField = field.split('```')[1].toString().split('```')[0].trimStart().trimEnd();
            
            if (!rawField) {
                return message.channel.send(setstockArgs);
            }
            client.FileManager.EditFile(name,rawField);
            client.setStock(name,rawField.split('\n').length);

            message.channel.send('Done.');
            return;
        }
        await message.channel.send(setstockArgs);
    }
}