import { PrismaClient } from '@prisma/client';

export async function setstock(name: string, stock: number) {
    
    const prisma = new PrismaClient();

    const data = await prisma.product.findUnique({
        where:{
            name
        }
    });

    if (data) {
        await prisma.product.update({
            data:{
                stock
            },
            where:{
                name
            }
        });
    }
}