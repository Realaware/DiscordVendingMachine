import { Command } from '../interface';
import { MessageEmbed } from 'discord.js';

const lackofStock = new MessageEmbed()
.setTitle('Buy')
.setDescription('Process ended due to lack of stock.')
.setTimestamp();

const lackofBal = new MessageEmbed()
.setTitle('Buy')
.setDescription('Process ended due to lack of balance')
.setTimestamp();


export const command: Command = {
    name: 'buy',
    description: 'buy product that you want to do it.',
    group: ['useronly'],
    run: async(client,message,args) => {

        // i hate this process,
        const name: string = args[0];
        const amount = (parseInt(args[1]) ? parseInt(args[1]) : 1);
        const { id:_id } = message.author

        const id = parseInt(_id);

        const product_Data = await client.prisma.product.findUnique({where:{name}});
        const user_Data = await client.prisma.user.findUnique({where:{id}});

        if (!user_Data) {
            return;
        }

        if (product_Data) {

            if (amount > product_Data.stock) {
                return message.channel.send(lackofStock);
            }

            if (user_Data.balance < product_Data.price) {
                return message.channel.send(lackofBal);
            }

            // change db data.
            client.setStock(name,product_Data.stock - amount);
            await client.prisma.user.update({
                data: {
                    balance: user_Data.balance - product_Data.price,
                    role:{
                        connect:{
                            name:'Buyer'
                        }
                    }
                },
                where: {
                    id
                }
            })
            .catch(err => {
                console.log(err);
            })

            // give reward to buyer.
            try {
                const FileContent = await client.FileManager.ReadFile(name);
                const Reward = await client.FileManager.ReadMultipleLine(FileContent,{removeLine:true},amount);
    
                const Embed = new MessageEmbed()
                .setTitle('Buy')
                .setDescription('Thank you for using our service. if you encountered any problems with underlying product, please contact to admin.')
                .setTimestamp();

                Embed.addField('reward',`\`\`\`${Reward[0]}\`\`\``,true);
    
                await message.author.send(Embed);
    
                await client.FileManager.EditFile(name,Reward[1]);
            } catch (error) {
                console.log(error);
                await message.channel.send('unexpected error has occured. if your balance has been gotten out despite not receiving reward,please contact to admin.');
            }
        }
    }
}