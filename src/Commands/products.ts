import { Command } from '../interface';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
    name: 'plist',
    description: 'show product lists that are in database.',
    group: [],
    run: async(client,message,args) => {
        
        const plist = new MessageEmbed()
        .setTitle('Product Lists')
        .setColor('#560e78')
        .setTimestamp();

        const noProducts = new MessageEmbed()
        .setTitle('Product Lists')
        .setDescription('There is no any products in database.')
        .setTimestamp()
        .setColor('#560e78');

        const data = await client.prisma.product.findMany();

        if (data.length == 0) {
            return message.channel.send(noProducts);
        }

        for (const child of data) {
            const { name, id, price, stock } = child;

            plist.addField(name,` \`\`\`id: ${id}\nprice: ${price}\nstock: ${stock} \`\`\` `,true);
        }

        await message.channel.send(plist);
    }
}