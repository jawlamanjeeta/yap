type ConversationFinder<T> = (args: {
  where: {
    id: string;
    userId: string;
  };
}) => Promise<T | null>;

export function findConversationForUser<T>(
  findFirst: ConversationFinder<T>,
  userId: string,
  conversationId: string,
) {
  return findFirst({
    where: {
      id: conversationId,
      userId,
    },
  });
}
