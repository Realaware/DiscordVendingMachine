import { Command } from '../interface';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
    name: 'register',
    description: 'register user into db',
    group: [],
    run: async(client,message,args) => {
        const { id:_id } = message.author;
        const id = parseInt(_id);

        const data = await client.prisma.user.findUnique({
            where:{
                id
            }
        })

        if (!data) {
            await client.prisma.user.create({
                data:{
                    id
                }
            })
            
            const Embed = new MessageEmbed()
            .setTitle('Register')
            .setDescription('Successfully registered in.')
            .setColor('#560e78')
            .setTimestamp();

            message.channel.send(Embed);

        } else {
            const Embed = new MessageEmbed()
            .setTitle('Register')
            .setDescription('Failed to create new account.\n[Existing Account]')
            .setColor('#560e78')
            .setTimestamp();

            message.channel.send(Embed);
        }
    }
}