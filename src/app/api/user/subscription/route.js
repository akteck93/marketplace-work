import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { plan, durationDays } = await req.json();

    if (!durationDays || isNaN(durationDays)) {
      return new Response(JSON.stringify({ error: "Invalid duration" }), { status: 400 });
    }

    // Calculate new expiration date
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + durationDays);

    // Update user in DB
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        subscriptionActiveUntil: expirationDate
      }
    });

    return new Response(JSON.stringify({ 
      success: true, 
      subscriptionActiveUntil: updatedUser.subscriptionActiveUntil 
    }), { status: 200 });

  } catch (error) {
    console.error("Subscription update error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
