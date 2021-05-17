import { Command } from '../interface';
import { MessageEmbed } from 'discord.js';

const args = new MessageEmbed()
.setTitle('set price')
.setDescription('set price args\n `command` + `product name`[string] + `price`[int]')
.setTimestamp();

export const command: Command = {
    name: 'setprice',
    description: 'set product\'s price.',
    group: ['admin','useronly'],
    run: async(client,message,args) => {
        const name: string = args[0];
        const price: number = parseInt(args[1]);

        const data = await client.prisma.product.findUnique({where:{name}});

        if (!data || !price) {
            return message.channel.send(args);
        }

        await client.prisma.product.update({
            data:{
                price
            },
            where:{
                name
            }
        })
        .then(() => {
            message.channel.send('Done.');
        })
        .catch(error => {
            message.channel.send('Failed to update price.');
            console.log(error);
        })
    }
}