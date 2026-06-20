import { prisma } from "../config/prismaClient"

async function main() {
    const globalChat = await prisma.conversation.findUnique({
        where: {
            id: "globalChat"
        }
    });
    if(globalChat) {
        console.log("Global Chat already exists!");
        console.log("Terminating seeding script...");
        return;
    }
    
    await prisma.conversation.create({
        data: {
            id: "globalChat"
        }
    });

    console.log(globalChat);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch((async (err) => {
        console.error("Error seeding database: ", err);
        await prisma.$disconnect();
        process.exit(1);
    }))