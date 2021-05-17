import { Command } from '../interface';
import { GuildMember, MessageEmbed } from 'discord.js';

const args = new MessageEmbed()
.setTitle('Set balance')
.setDescription('set balance args\n `command` + `user`[mention] + `balance`[int]` ')
.setTimestamp();

export const command: Command = {
    name: 'setbalance',
    description: 'set user balance.',
    group: ['admin','useronly'],
    run: async(client,message,args) => {
        const regex = /[0-9]+/gm;
        const userid: string = regex.exec(args[0])[0];
        const balance: number = parseInt(args[1]);

        const user: GuildMember = message.guild.members.cache.get(userid);

        if (!user || !balance) {
            return message.channel.send(args);
        }

        const data = await client.prisma.user.findUnique({where:{id:parseInt(userid)}});

        if (!data) {
            return message.channel.send('Not registered user.');
        }

        await client.prisma.user.update({
            data:{
                balance,
            },
            where:{
                id:parseInt(userid),
            }
        })
        .then(() => {
            message.channel.send('Done.');
        })
        .catch(error => {
            message.channel.send('Failed to update data.');
        })
        
    }
}