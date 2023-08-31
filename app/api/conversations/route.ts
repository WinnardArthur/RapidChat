import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();

    const { userId, isGroup, members, name } = body;

    // If user is not logged, unauthorized.
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // If it's a group chat, but members in only one or no members, throw error
    // Also if there's is no name for group chat/conversation, throw error
    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse("Invalid data", { status: 500 });
    }

    // If it's a group chat with more than one member and a group name
    // Create new group conversation/chat
    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            // Connect users in the group with current user
            // Thus, add them together in the same group
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              { id: currentUser.id },
            ],
          },
        },
        // Populate users
        include: {
          users: true,
        },
      });

      return NextResponse.json(newConversation);
    }

    // If it's not a group chat, but individual conversation,
    // Check if conversation has already been created.
    // If it has, don't create a new chat, but just fetch the chat created.
    // You check if amongst the conversations, there exist for any of them,
    // one with same IDs (for individual conversations).
    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    });

    const singleConversation = existingConversations[0];

    if (singleConversation) return NextResponse.json(singleConversation);

    // If there's no previous conversation between two people,
    // Create a new conversation
    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          // Connect/group their IDs together
          connect: [
            {
              id: currentUser.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });

    return NextResponse.json(newConversation);
  } catch (error: any) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
