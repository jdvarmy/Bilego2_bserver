const Version = {
  _1: 'v1/',
};

export const Routs = {
  artists: Version._1 + 'artists',
  auth: Version._1 + 'auth',
  events: Version._1 + 'events',
  items: Version._1 + 'items',
  map: Version._1 + 'map',
  media: Version._1 + 'media',
  slides: Version._1 + 'slides',
  taxonomy: Version._1 + 'taxonomy',
  tickets: Version._1 + 'tickets',
  users: Version._1 + 'users',
};

export enum PostStatus {
  temp = 'temp', // - временный шаблон пост.
  publish = 'publish', // - опубликованный пост.
  pending = 'pending', // - пост на модерации.
  draft = 'draft', // - черновик.
  future = 'future', // - запланированный пост.
  private = 'private', // - личный пост.
  trash = 'trash', // - удаленный пост (в корзине)
}

export enum TicketType {
  simple = 'simple',
  map = 'map',
}

export enum City {
  moscow = 'moscow',
  petersburg = 'petersburg',
}

export enum SortType {
  desc = 'desc',
  asc = 'asc',
  popular = 'popular',
}

export enum UserEntityRole {
  admin = 'bilego_admin',
  manager = 'admin_panel_manager',
  organizer = 'event_ceo',
  subscriber = 'subscriber',
}

export enum UserEntityStatus {
  inactive,
  active,
}

export enum EventHeaderType {
  image = 'image',
  video = 'video',
  effect = 'effect',
}

export enum TaxonomyTypeLink {
  event = 'event',
  item = 'item',
}

export enum TaxonomyType {
  genre = 'genre',
  category = 'category',
  selection = 'selection',
  feeling = 'feeling',
  type = 'type',
}

export enum OrderStatus {
  pendingPayment = 'pendingPayment', // в ожидании оплаты
  processing = 'processing', // обработка
  completed = 'completed', // выполнен
  canceled = 'canceled', // отменен
  failed = 'failed', // не удался, оплата не прошла
  onHold = 'onHold', // на удержании
  refunded = 'refunded', // возвращен
}

export enum Exception500 {
  uploadFile, // Неудалось загрузить файл на диск
  removeFile, // Неудалось удалить файл
  saveUser, // Неуказаны логин или пароль
  getUser, // Такого пользователя не существует
  findUser, // Пользователь с такими данными не найден
  uid, // Идентификатор не валиден
  itemUid, // Идентификатор площадки не валиден
  findMedia, // Медиа с таким id не найдено
  findEvent, // Событие с такими данными не найдено
  findEvents, // Событий с такими данными не найдены
  findEventDate, // Дата события с такими данными не найдена
  findEventDates, // На данное событие не найдено открытых дат
  findItems, // Площадки с такими данными не найдены
  findItem, // Площадка с таким uid не найдена
  findEventUid, // Событие с таким uid не найдена
  saveEventSlug, // Пустая ссылка на событие
  findArtists, // Артисты с таким данными не найдены
  findArtist, // Артист с таким uid не найден
  editNoEventDateId, // Нет идентификатора даты события при редактировании
  editNoTicketId, // Нет идентификатора билета при редактировании
  findTickets, // Билеты не найдены
  findSell, // Продажи билета не найдены
  findMap, // Карта с такими данными не найдена
  uploadMap, // Проблемы с загрузкой карты или мини-карты
  uploadMapNoData, // Нет файла карты или мини-карты
  parseSVGError, // Ошибка при парсинге SVG карты
  findTaxonomy, // Таксономия с таким id не найдена
  findTaxonomies, // Категории с такими данными не найдены
}

export enum FileType {
  image = 'image',
  map = 'svg',
}

export enum ImageSizes {
  origin = 'origin',
  xs = '200x278',
  s = '430x366',
  m = '660x470',
  l = '1340x560',
  xl = '1920x1080',
}

export enum LoggerMessageType {
  error = 'error',
  log = 'log',
  warn = 'warn',
  debug = 'debug',
  verbose = 'verbose',
}
