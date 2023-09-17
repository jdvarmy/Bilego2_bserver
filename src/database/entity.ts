import { Users } from '../core/users/entity/users.entity';
import { UserAccess } from '../core/users/entity/user-access.entity';
import { Events } from '../core/events/entity/events.entity';
import { Artists } from '../core/artists/entity/artists.entity';
import { Items } from '../core/items/entity/items.entity';
import { ItemClosestMetro } from '../core/items/entity/item-closest-metro.entity';
import { EventDates } from '../core/events/entity/event-dates.entity';
import { Maps } from '../core/map/entity/maps.entity';
import { Tickets } from '../core/tickets/entity/tickets.entity';
import { TicketsSell } from '../core/tickets/entity/tickets-sell.entity';
import { SEO } from './entity/seo.entity';
import { Taxonomy } from '../core/taxonomy/entity/taxonomy.entity';
import { Orders } from '../core/orders/entity/orders.entity';
import { OrderItems } from '../core/orders/entity/order-items.entity';
import { Media } from '../core/medialibrary/entity/media.entity';

export {
  Users,
  UserAccess,
  Events,
  EventDates,
  Items,
  ItemClosestMetro,
  Artists,
  Maps,
  Tickets,
  TicketsSell,
  SEO,
  Taxonomy,
  Orders,
  OrderItems,
  Media,
};

const entities = [
  Users,
  UserAccess,
  Events,
  EventDates,
  Items,
  ItemClosestMetro,
  Artists,
  Maps,
  Tickets,
  TicketsSell,
  SEO,
  Taxonomy,
  Orders,
  OrderItems,
  Media,
];

export default entities;
