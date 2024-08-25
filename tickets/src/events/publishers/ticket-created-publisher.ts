import { Publisher, Subjects, TicketCreatedEvent } from '@hadiscriptmicro/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
