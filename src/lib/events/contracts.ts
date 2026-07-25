export type DomainEvent<TPayload extends Record<string, unknown> = Record<string, unknown>> = {
  id: string;
  name: string;
  occurredAt: Date;
  aggregateType: string;
  aggregateId: string;
  actorId: string;
  payload: TPayload;
};

/**
 * Domain modules depend on this port, not a specific event bus. A durable
 * outbox and external broker can be introduced later without changing policy code.
 */
export interface EventPublisher {
  publish(event: DomainEvent): Promise<void>;
}

export class InMemoryEventPublisher implements EventPublisher {
  readonly events: DomainEvent[] = [];

  async publish(event: DomainEvent): Promise<void> {
    this.events.push(event);
  }
}
