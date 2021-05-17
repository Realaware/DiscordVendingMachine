import { Command } from '../interface';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
    name: 'userinfo',
    description: 'Show simple information about you',
    group: ['useronly'],
    run: async(client,message,args) => {
        const { id:_id } = message.author;
        const id = parseInt(_id);

        const data = await client.prisma.user.findUnique({where:{id},include:{role:{select:{name:true},where:{user:{every:{id}}}}}});

        if (!data) {
            const Embed = new MessageEmbed()
            .setTitle('Lack of Permission')
            .setDescription('Access Denied due to lack of permission.')
            .setTimestamp();

            message.channel.send(Embed);
            return;
        }

        const { username } = message.author;

        const Embed = new MessageEmbed()
        .setTitle(`${username.length > 10 ? 'Too long' : username}`)
        .setDescription('Simple information.')
        .setTimestamp();

        const roles = [];

        data.role.forEach(v => {
            roles.push(v.name);
        })

        Embed.addFields([
            {
                name: 'Balance',
                value: data.balance,
                inline: true
            },
            {
                name: 'id',
                value: data.id,
                inline: true
            },
            {
                name: 'roles',
                value: roles.join(' | ') || 'No Roles.',
                inline: true
            }
        ])

        message.channel.send(Embed);
    }
}