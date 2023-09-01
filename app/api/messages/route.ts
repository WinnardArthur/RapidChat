import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();

    const { message, image, conversationId } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Create a new message
    const newMessage = await prisma.message.create({
      data: {
        body: message,
        image: image,
        conversation: {
          // Add conversationId to conversation array
          connect: {
            id: conversationId,
          },
        },
        sender: {
          // Current user is the sender, so use
          // current user's id to as the sender
          connect: {
            id: currentUser.id,
          },
        },
        seen: {
          // Current user always sees the sent message
          // So add user's id to the seen array
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: {
        seen: true,
        sender: true,
      },
    });

    // Update conversation model
    // Update the last message at of conversation model
    // Add new message's id to the messages array in
    // the conversation model's
    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });

    return NextResponse.json(newMessage);
  } catch (error: any) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
