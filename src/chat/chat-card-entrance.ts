interface ChatCardMessageLike {
  readonly id: string;
}

/** Client-local one-shot state. It is never written to a ChatMessage or Document. */
export class ChatCardEntranceTracker {
  readonly #seenMessageIds = new Set<string>();

  constructor(existingMessages: Iterable<ChatCardMessageLike> = []) {
    for (const message of existingMessages) this.#seenMessageIds.add(message.id);
  }

  mark(message: ChatCardMessageLike, html: ParentNode): boolean {
    const card = html.querySelector<HTMLElement>(".magnusarchives-roll-card[data-magnusarchives-entrance]");
    if (!card || this.#seenMessageIds.has(message.id)) return false;
    this.#seenMessageIds.add(message.id);
    card.classList.add("magnusarchives-chat-card-enter");
    return true;
  }
}

export function initializeChatCardEntrance(): ChatCardEntranceTracker {
  const tracker = new ChatCardEntranceTracker(game.messages);
  Hooks.on("renderChatMessageHTML", (message: ChatMessage, html: HTMLElement) => {
    tracker.mark(message, html);
  });
  return tracker;
}
