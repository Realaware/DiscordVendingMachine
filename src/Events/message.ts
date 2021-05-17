import { Event, Command} from '../interface';
import { Message, MessageEmbed } from 'discord.js';

export const event: Event = {
    name: 'message',
    run: async(client,message: Message) => {
        if (message.author.bot || !message.content.startsWith(client.Config.prefix)) return;

        const args = message.content
        .slice(client.Config.prefix.length)
        .trim()
        .split(/ +/g);

        const cmd = args.shift().toLowerCase();
        if (!cmd) return;
        const command = client.commands.get(cmd);

        if (command) {
            const { id:_id } = message.author;
            const id = parseInt(_id);

            if (command.group.includes('useronly')) {
                const data =await client.prisma.user.findUnique({
                    where:{
                        id
                    }
                })

                if (!data) {
                    const Embed = new MessageEmbed()
                    .setTitle('Lack of Permission')
                    .setDescription('Access Denied due to lack of permission.')
                    .setTimestamp();

                    return message.channel.send(Embed);
                }
            }

            if (command.group.includes('admin')) {
                const data = await client.prisma.user.findUnique({
                    where:{
                        id
                    },
                    include:{
                        role:{
                            where:{
                                isAdmin:true,
                                user:{
                                    every:{
                                        id
                                    }
                                }
                            }
                        }
                    }
                })

                if (data.role.length === 0 || !data) {
                    const Embed = new MessageEmbed()
                    .setTitle('Lack of Permission')
                    .setDescription('Access Denied due to lack of permission.')
                    .setTimestamp();

                    message.channel.send(Embed);
                    return;
                }

            }

            command.run(client,message,args);

        }
    }
}