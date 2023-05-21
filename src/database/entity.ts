import { Users } from '../users/entity/users.entity';
import { UserAccess } from '../users/entity/user-access.entity';
import { Events } from '../events/entity/events.entity';
import { Artists } from '../artists/entity/artists.entity';
import { Items } from '../items/entity/items.entity';
import { ItemClosestMetro } from '../items/entity/item-closest-metro.entity';
import { EventDates } from '../events/entity/event-dates.entity';
import { Maps } from '../map/entity/maps.entity';
import { Tickets } from '../tickets/entity/tickets.entity';
import { TicketsSell } from '../tickets/entity/tickets-sell.entity';
import { SEO } from './entity/seo.entity';
import { Taxonomy } from '../taxonomy/entity/taxonomy.entity';
import { Orders } from '../orders/entity/orders.entity';
import { OrderItems } from '../orders/entity/order-items.entity';
import { Media } from '../medialibrary/entity/media.entity';

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
