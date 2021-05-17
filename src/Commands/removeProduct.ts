import { Command } from '../interface/';

export const command: Command = {
    name: 'removeproduct',
    description: 'remove product to be added before.',
    group: ['admin','useronly'],
    run: async(client,message,args) => {

        const name: string = args[0];
        
        client.FileManager.RemoveFile(name);

        await client.prisma.product.delete({
            where:{
                name,
            }
        })
        .then(async () => {
            await message.channel.send('Done.');
        })
        .catch(async () => {
            await message.channel.send('Failed to delete data.');
        })
    }
}
