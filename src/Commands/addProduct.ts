import { Command } from '../interface';
import { MessageEmbed } from 'discord.js';
import { Prisma } from '.prisma/client';


const productArgs = new MessageEmbed()
.setTitle('Add Product')
.setDescription(`add product arguments\n\`command\` + \`product name\`[string] + \`product price\`[int] `)
.setTimestamp();


export const command: Command = {
    name: 'addproduct',
    description: 'add product for user to buy.',
    group: ['admin','useronly'],
    run: async(client,message,args) => {

        const data: Prisma.ProductCreateInput = {
            name: null,
            price: 0
        };

        data.name = args[0];
        data.price = ( parseInt(args[1]) ? parseInt(args[1]) : null);

        if (!data.price || !data.name) {
            return message.channel.send(productArgs);
        }

        const error = await client.FileManager.CreateFile(data.name);

        if (error !== null) {
            return message.channel.send('Existing name, Please use another one.');
        }

        await client.prisma.product.create({
            data,
        })
        .then(response => {
        
            const productData = new MessageEmbed()
            .setTitle('Add Product')
            .setDescription(`Name: ${response.name}\nPrice: ${response.price}\nId: ${response.id} has successfully added in.`)
            .setTimestamp();

            message.channel.send(productData);
        })
        .catch(error => {
            message.channel.send(`${error}.`);
        })
    }
}