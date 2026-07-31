import assert from "node:assert/strict";
import test from "node:test";
import { findConversationForUser } from "../src/lib/conversation-access";

type Conversation = {
  id: string;
  userId: string;
};

const conversations: Conversation[] = [
  { id: "alice-spanish", userId: "alice" },
  { id: "bob-french", userId: "bob" },
];

async function findFirst({ where }: { where: { id: string; userId: string } }) {
  return conversations.find(
    (conversation) => conversation.id === where.id && conversation.userId === where.userId,
  ) ?? null;
}

test("a learner cannot read another learner's conversation", async () => {
  const conversation = await findConversationForUser(findFirst, "alice", "bob-french");

  assert.equal(conversation, null);
});

test("a learner can read their own conversation", async () => {
  const conversation = await findConversationForUser(findFirst, "alice", "alice-spanish");

  assert.deepEqual(conversation, { id: "alice-spanish", userId: "alice" });
});
