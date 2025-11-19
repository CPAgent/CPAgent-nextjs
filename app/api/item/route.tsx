import { prisma } from "@/lib/prisma";

export async function GET() {
    const item = await prisma.item.findMany();
    return new Response(JSON.stringify(item), { status: 200});
}
