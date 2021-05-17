import { Event } from '../interface';

export const event: Event = {
    name: 'ready',
    run: (client) => {
        console.log(`logged in ${client.user.tag}`);
    }
}