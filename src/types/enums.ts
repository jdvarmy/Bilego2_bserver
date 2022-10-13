export enum Version {
  _1 = 'v1/',
}

export enum PostType {
  ticketObject = 'bilego_ticket_object',
  event = 'bilego_event_post',
  item = 'bilego_item_post',
  artist = 'bilego_artist_post',
}

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

export enum TaxonomyLink {
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

export enum UnauthorizedException_401 {
  notFound, // Пользователь не найден
  wrongPass, // Неверный логин или пароль
}

export enum ForbiddenException_403 {
  deleted, // Пользователь удален
  token, // Протух токен
}

export enum NotFoundException_404 {}

export enum BadRequestException_400 {}

export enum Exception500 {
  uploadFile, // Неудалось загрузить файл на диск
  removeFile, // Неудалось удалить файл
  saveUser, // Неуказаны логин или пароль
  getUser, // Такого пользователя не существует
  findUser, // Пользователь с такими данными не найден
  findEvent, // Событие с такими данными не найдено
  findEventDate, // Дата события с такими данными не найдена
  findEventDates, // На данное событие не найдено открытых дат
  findItems, // Площадки с такими данными не найдены
  findEventUid, // Событие с таким идентификатором не найдено
  saveEventSlug, // Пустая ссылка на событие
  editNoEventDateId, // Нет идентификатора даты события при редактировании
  editNoTicketId, // Нет идентификатора билета при редактировании
  findTickets, // Билеты не найдены
  findSell, // Продажи билета не найдены
  findMap, // Карта с такими данными не найдена
  uploadMap, // Проблемы с загрузкой карты или мини-карты
  uploadMapNoData, // Нет файла карты или мини-карты
  parseSVGError, // Ошибка при парсинге SVG карты
}

export enum FileType {
  image = 'image',
}
