import { Publisher, Subjects, TicketUpdatedEvent } from '@hadiscriptmicro/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
