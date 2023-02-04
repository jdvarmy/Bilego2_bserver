SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `chekisu6_bilego2`
--
CREATE DATABASE IF NOT EXISTS `chekisu6_bilego2` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `chekisu6_bilego2`;

-- --------------------------------------------------------

--
-- Структура таблицы `artists`
--
-- Создание: Янв 23 2023 г., 06:20
--

DROP TABLE IF EXISTS `artists`;
CREATE TABLE `artists` (
  `id` bigint(20) NOT NULL,
  `uid` varchar(60) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `status` enum('temp','publish','pending','draft','future','private','trash') NOT NULL DEFAULT 'temp',
  `title` varchar(255) DEFAULT NULL,
  `text` longtext,
  `createDateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateDateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `seoId` bigint(20) DEFAULT NULL,
  `imageId` bigint(20) DEFAULT NULL,
  `avatarId` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `events`
--
-- Создание: Янв 23 2023 г., 06:20
-- Последнее обновление: Янв 24 2023 г., 06:43
--

DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` bigint(20) NOT NULL,
  `uid` varchar(60) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `status` enum('temp','publish','pending','draft','future','private','trash') NOT NULL DEFAULT 'temp',
  `title` varchar(255) DEFAULT NULL,
  `text` longtext,
  `createDateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateDateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `city` enum('moscow','petersburg') DEFAULT NULL,
  `fragment` text,
  `searchWords` text,
  `ageRestriction` int(11) DEFAULT NULL,
  `isShowOnSlider` tinyint(4) NOT NULL DEFAULT '0',
  `musicLink` varchar(255) DEFAULT NULL,
  `videoLink` varchar(255) DEFAULT NULL,
  `headerType` enum('image','video','effect') NOT NULL DEFAULT 'image',
  `headerMedia` varchar(255) DEFAULT NULL,
  `headerText` varchar(255) DEFAULT '{"title":"","subtitle":"","meta":""}',
  `headerTextColor` varchar(255) DEFAULT '{"title":"#ffffff","subtitle":"#ffffff","meta":"#ffffff"}',
  `concertManagerInfo` text,
  `concertManagerPercentage` int(11) DEFAULT NULL,
  `itemId` bigint(20) DEFAULT NULL,
  `seoId` bigint(20) DEFAULT NULL,
  `eventManagerId` bigint(20) DEFAULT NULL,
  `imageId` bigint(20) DEFAULT NULL,
  `headerImageId` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `events`
--

INSERT INTO `events` (`id`, `uid`, `slug`, `status`, `title`, `text`, `createDateTime`, `updateDateTime`, `deletedAt`, `city`, `fragment`, `searchWords`, `ageRestriction`, `isShowOnSlider`, `musicLink`, `videoLink`, `headerType`, `headerMedia`, `headerText`, `headerTextColor`, `concertManagerInfo`, `concertManagerPercentage`, `itemId`, `seoId`, `eventManagerId`, `imageId`, `headerImageId`) VALUES
(1, 'd538e15e-d4ec-43ab-90f0-8a7b64219c5c', 'test-event', 'temp', NULL, NULL, '2023-01-24 09:42:54.388113', '2023-01-24 09:43:58.000000', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 'image', NULL, '{\"title\":\"\",\"subtitle\":\"\",\"meta\":\"\"}', '{\"title\":\"#ffffff\",\"subtitle\":\"#ffffff\",\"meta\":\"#ffffff\"}', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `events_artist_artists`
--
-- Создание: Янв 23 2023 г., 06:20
--

DROP TABLE IF EXISTS `events_artist_artists`;
CREATE TABLE `events_artist_artists` (
  `eventsId` bigint(20) NOT NULL,
  `artistsId` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `event_dates`
--
-- Создание: Янв 23 2023 г., 06:20
-- Последнее обновление: Янв 24 2023 г., 06:42
--

DROP TABLE IF EXISTS `event_dates`;
CREATE TABLE `event_dates` (
  `id` bigint(20) NOT NULL,
  `uid` varchar(60) NOT NULL,
  `type` enum('simple','map') DEFAULT NULL,
  `dateFrom` datetime DEFAULT NULL,
  `dateTo` datetime DEFAULT NULL,
  `closeDateTime` datetime DEFAULT NULL,
  `eventId` bigint(20) DEFAULT NULL,
  `mapId` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `event_dates`
--

INSERT INTO `event_dates` (`id`, `uid`, `type`, `dateFrom`, `dateTo`, `closeDateTime`, `eventId`, `mapId`) VALUES
(1, '2e9199cf-5483-4409-ba62-4d71e3d47927', NULL, NULL, NULL, NULL, 1, NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `items`
--
-- Создание: Янв 23 2023 г., 06:20
--

DROP TABLE IF EXISTS `items`;
CREATE TABLE `items` (
  `id` bigint(20) NOT NULL,
  `uid` varchar(60) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `status` enum('temp','publish','pending','draft','future','private','trash') NOT NULL DEFAULT 'temp',
  `title` varchar(255) DEFAULT NULL,
  `text` longtext,
  `createDateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateDateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `city` enum('moscow','petersburg') DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `latitude` varchar(255) DEFAULT NULL,
  `longitude` varchar(255) DEFAULT NULL,
  `seoId` bigint(20) DEFAULT NULL,
  `imageId` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `item_closest_metro`
--
-- Создание: Янв 23 2023 г., 06:20
--

DROP TABLE IF EXISTS `item_closest_metro`;
CREATE TABLE `item_closest_metro` (
  `id` bigint(20) NOT NULL,
  `metro` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `itemId` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `maps`
--
-- Создание: Янв 23 2023 г., 06:20
--

DROP TABLE IF EXISTS `maps`;
CREATE TABLE `maps` (
  `id` bigint(20) NOT NULL,
  `uid` varchar(60) NOT NULL,
  `xml` varchar(255) DEFAULT NULL,
  `viewBox` varchar(255) DEFAULT NULL,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `background` longtext,
  `attributes` longtext,
  `metadata` longtext,
  `paths` longtext,
  `seats` longtext,
  `mapId` bigint(20) DEFAULT NULL,
  `minimapId` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `media`
--
-- Создание: Янв 23 2023 г., 06:20
-- Последнее обновление: Янв 24 2023 г., 06:51
--

DROP TABLE IF EXISTS `media`;
CREATE TABLE `media` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT '',
  `originalName` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `mimetype` varchar(255) NOT NULL,
  `encoding` varchar(255) NOT NULL,
  `size` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `media`
--

INSERT INTO `media` (`id`, `name`, `originalName`, `path`, `mimetype`, `encoding`, `size`) VALUES
(1, '', '8757-1000x830.jpg', '2023-1/image/949ee5f8-4351-498f-bef4-e9b158334be2.jpg', 'image/jpeg', '7bit', 441635),
(2, '', 'maxresdefault.jpg', '2023-1/image/55f979af-1eab-4ad9-bfab-4489c2c68dce.jpg', 'image/jpeg', '7bit', 167108),
(3, '', 'rik-i-morti-rick-and-morty-rick-sanchez-rick-sanchez-morty-2.jpg', '2023-1/image/f4183a13-c184-4b77-a057-b9f05559d3df.jpg', 'image/jpeg', '7bit', 368767);

-- --------------------------------------------------------

--
-- Структура таблицы `orders`
--
-- Создание: Янв 23 2023 г., 06:20
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` bigint(20) NOT NULL,
  `type` enum('pendingPayment','processing','completed','canceled','failed','onHold','refunded') NOT NULL DEFAULT 'pendingPayment',
  `createDateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `email` varchar(60) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `totalOrderPrice` int(11) NOT NULL DEFAULT '0',
  `eventId` bigint(20) DEFAULT NULL,
  `userId` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `order_items`
--
-- Создание: Янв 23 2023 г., 06:20
--

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` bigint(20) NOT NULL,
  `price` int(11) NOT NULL,
  `service` int(11) NOT NULL,
  `discount` int(11) NOT NULL,
  `totalPrice` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `orderId` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `seo`
--
-- Создание: Янв 23 2023 г., 06:20
--

DROP TABLE IF EXISTS `seo`;
CREATE TABLE `seo` (
  `id` bigint(20) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `taxonomy`
--
-- Создание: Янв 23 2023 г., 06:20
-- Последнее обновление: Янв 24 2023 г., 06:52
--

DROP TABLE IF EXISTS `taxonomy`;
CREATE TABLE `taxonomy` (
  `id` bigint(20) NOT NULL,
  `link` enum('event','item') NOT NULL,
  `type` enum('genre','category','selection','feeling','type') NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `overIndex` int(11) DEFAULT NULL,
  `showInMenu` tinyint(4) NOT NULL DEFAULT '0',
  `showInMainPage` tinyint(4) NOT NULL DEFAULT '0',
  `iconId` bigint(20) DEFAULT NULL,
  `imageId` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `taxonomy`
--

INSERT INTO `taxonomy` (`id`, `link`, `type`, `name`, `slug`, `description`, `overIndex`, `showInMenu`, `showInMainPage`, `iconId`, `imageId`) VALUES
(1, 'event', 'genre', 'Рок', 'rok', NULL, 0, 0, 0, 3, NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `taxonomy_event_events`
--
-- Создание: Янв 23 2023 г., 06:20
--

DROP TABLE IF EXISTS `taxonomy_event_events`;
CREATE TABLE `taxonomy_event_events` (
  `taxonomyId` bigint(20) NOT NULL,
  `eventsId` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `taxonomy_item_items`
--
-- Создание: Янв 23 2023 г., 06:20
--

DROP TABLE IF EXISTS `taxonomy_item_items`;
CREATE TABLE `taxonomy_item_items` (
  `taxonomyId` bigint(20) NOT NULL,
  `itemsId` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `tickets`
--
-- Создание: Янв 23 2023 г., 06:20
--

DROP TABLE IF EXISTS `tickets`;
CREATE TABLE `tickets` (
  `id` bigint(20) NOT NULL,
  `uid` varchar(60) NOT NULL,
  `type` enum('simple','map') DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `stock` int(11) NOT NULL DEFAULT '0',
  `seat` varchar(255) DEFAULT NULL,
  `row` varchar(255) DEFAULT NULL,
  `sector` varchar(255) DEFAULT NULL,
  `createDateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateDateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `eventDateId` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `tickets_order_items_order_items`
--
-- Создание: Янв 23 2023 г., 06:20
--

DROP TABLE IF EXISTS `tickets_order_items_order_items`;
CREATE TABLE `tickets_order_items_order_items` (
  `ticketsId` bigint(20) NOT NULL,
  `orderItemsId` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `tickets_sell`
--
-- Создание: Янв 23 2023 г., 06:20
--

DROP TABLE IF EXISTS `tickets_sell`;
CREATE TABLE `tickets_sell` (
  `id` bigint(20) NOT NULL,
  `uid` varchar(60) NOT NULL,
  `price` int(11) NOT NULL DEFAULT '0',
  `service` int(11) NOT NULL DEFAULT '0',
  `dateFrom` datetime DEFAULT NULL,
  `dateTo` datetime DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `createDateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateDateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `tickets_tickets_sell_tickets_sell`
--
-- Создание: Янв 23 2023 г., 06:20
--

DROP TABLE IF EXISTS `tickets_tickets_sell_tickets_sell`;
CREATE TABLE `tickets_tickets_sell_tickets_sell` (
  `ticketsId` bigint(20) NOT NULL,
  `ticketsSellId` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--
-- Создание: Янв 23 2023 г., 06:20
-- Последнее обновление: Янв 23 2023 г., 09:33
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `uid` varchar(60) NOT NULL,
  `email` varchar(60) NOT NULL,
  `login` varchar(60) NOT NULL,
  `pass` varchar(60) NOT NULL,
  `role` enum('bilego_admin','admin_panel_manager','event_ceo','subscriber') NOT NULL DEFAULT 'subscriber',
  `status` int(11) NOT NULL DEFAULT '0',
  `name` varchar(60) DEFAULT NULL,
  `surname` varchar(60) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `concertManagerInfo` text,
  `concertManagerPercentage` int(11) DEFAULT NULL,
  `createDateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateDateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `avatarId` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `uid`, `email`, `login`, `pass`, `role`, `status`, `name`, `surname`, `birthdate`, `phone`, `concertManagerInfo`, `concertManagerPercentage`, `createDateTime`, `updateDateTime`, `deletedAt`, `avatarId`) VALUES
(1, '069b7733-d3c5-46d8-9b6f-ca9b7e755402', 'chekist.87@mail.ru', 'chekist.87@mail.ru', '$2b$13$vORntp3k/llIgA8avmrf..eDS9WBXtsTDgwDVBYV/C0kIW5XsY4.i', 'bilego_admin', 1, 'Вася', 'Пупкин', NULL, NULL, NULL, NULL, '2023-01-23 10:46:37.362143', '2023-01-23 12:33:30.733187', NULL, NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `user_access`
--
-- Создание: Янв 23 2023 г., 06:20
-- Последнее обновление: Янв 24 2023 г., 06:44
--

DROP TABLE IF EXISTS `user_access`;
CREATE TABLE `user_access` (
  `id` bigint(20) NOT NULL,
  `refreshToken` text,
  `ip` varchar(20) NOT NULL,
  `device` varchar(255) DEFAULT NULL,
  `createDateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateDateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `userId` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `user_access`
--

INSERT INTO `user_access` (`id`, `refreshToken`, `ip`, `device`, `createDateTime`, `updateDateTime`, `userId`) VALUES
(1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIwNjliNzczMy1kM2M1LTQ2ZDgtOWI2Zi1jYTliN2U3NTU0MDIiLCJlbWFpbCI6ImNoZWtpc3QuODdAbWFpbC5ydSIsInJvbGUiOiJiaWxlZ29fYWRtaW4iLCJuYW1lIjoi0JLQsNGB0Y8iLCJzdXJuYW1lIjoi0J_Rg9C_0LrQuNC9IiwiYmlydGhkYXRlIjpudWxsLCJwaG9uZSI6bnVsbCwic3RhdHVzIjoxLCJpYXQiOjE2NzQ1NDI2NDUsImV4cCI6MTY3OTcyNjY0NX0.2w-uKygdsy4bgU-dQo8i9zXWQy_WePFjSRGng6JLaHA', '0.0.0.0', 'desktop', '2023-01-24 09:42:24.433845', '2023-01-24 09:44:05.000000', 1);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `artists`
--
ALTER TABLE `artists`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_6a27392a7853f22693baabfadd` (`uid`),
  ADD UNIQUE KEY `IDX_d8698856b9f9735db747084136` (`slug`),
  ADD KEY `FK_dd733ff817fd17b0b17ed0a1479` (`seoId`),
  ADD KEY `FK_76f9aa6b44e03321c5feef0299c` (`imageId`),
  ADD KEY `FK_75f387d7b036a0541292da6a5d6` (`avatarId`);

--
-- Индексы таблицы `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_ee00bddeb44e2e199093485bff` (`uid`),
  ADD UNIQUE KEY `IDX_05bd884c03d3f424e2204bd14c` (`slug`),
  ADD KEY `FK_b828e114fbd97fff771a8554beb` (`itemId`),
  ADD KEY `FK_b2022872abd0c610b4642411fc0` (`seoId`),
  ADD KEY `FK_3fdd14a92b35af6cf0ae7a347da` (`eventManagerId`),
  ADD KEY `FK_35515e57a42f4fd00a4172371bb` (`imageId`),
  ADD KEY `FK_919dd82b12f6ceb5edbb785fb66` (`headerImageId`);

--
-- Индексы таблицы `events_artist_artists`
--
ALTER TABLE `events_artist_artists`
  ADD PRIMARY KEY (`eventsId`,`artistsId`),
  ADD KEY `IDX_8fa675f8b34fd1954a3a33fdc8` (`eventsId`),
  ADD KEY `IDX_e828ec9f80bc1f63e31ba64440` (`artistsId`);

--
-- Индексы таблицы `event_dates`
--
ALTER TABLE `event_dates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_6eaf7eb6c0b3c276116a01ad3d` (`uid`),
  ADD KEY `FK_ed88d5a6c9241fddc6dd7430469` (`eventId`),
  ADD KEY `FK_fc16d064118d4af93196e38e4ca` (`mapId`);

--
-- Индексы таблицы `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_2e718ee16b63344e3a362744e4` (`uid`),
  ADD UNIQUE KEY `IDX_a30421de0f1836d3e4a8071b2a` (`slug`),
  ADD KEY `FK_fc36a611477d9ccddab5a1246c6` (`seoId`),
  ADD KEY `FK_341d76ee69345ce5fa4f55ab948` (`imageId`);

--
-- Индексы таблицы `item_closest_metro`
--
ALTER TABLE `item_closest_metro`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_d8b05ba9e71167ae9b09f30abbe` (`itemId`);

--
-- Индексы таблицы `maps`
--
ALTER TABLE `maps`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_da9b77ba8486f36ab5e0c00708` (`uid`),
  ADD KEY `FK_d2f7a4af0b8284fdedbd03807d9` (`mapId`),
  ADD KEY `FK_70d0f0f9f7a01cafccc7d34a6a6` (`minimapId`);

--
-- Индексы таблицы `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_80f390b083014fd69ec40b8c38c` (`eventId`),
  ADD KEY `FK_151b79a83ba240b0cb31b2302d1` (`userId`);

--
-- Индексы таблицы `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_f1d359a55923bb45b057fbdab0d` (`orderId`);

--
-- Индексы таблицы `seo`
--
ALTER TABLE `seo`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `taxonomy`
--
ALTER TABLE `taxonomy`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_4aded29f2db9a28ae98b01555c` (`slug`),
  ADD KEY `FK_180878023662b86bccf04b5d17f` (`iconId`),
  ADD KEY `FK_4d6d64d43b1003dde7cd7fd307d` (`imageId`);

--
-- Индексы таблицы `taxonomy_event_events`
--
ALTER TABLE `taxonomy_event_events`
  ADD PRIMARY KEY (`taxonomyId`,`eventsId`),
  ADD KEY `IDX_70ffbfb7538b1d0229cf49b4aa` (`taxonomyId`),
  ADD KEY `IDX_0181415d7b198185ac6aecb0fa` (`eventsId`);

--
-- Индексы таблицы `taxonomy_item_items`
--
ALTER TABLE `taxonomy_item_items`
  ADD PRIMARY KEY (`taxonomyId`,`itemsId`),
  ADD KEY `IDX_7b0d444f4505199f59432858a9` (`taxonomyId`),
  ADD KEY `IDX_9ddbb36d851fbd4dc4542a9c7f` (`itemsId`);

--
-- Индексы таблицы `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_6c8ef5ff7f647b5deffd9e88a2` (`uid`),
  ADD KEY `FK_79b38cbaa8f0fb3181c677f047d` (`eventDateId`);

--
-- Индексы таблицы `tickets_order_items_order_items`
--
ALTER TABLE `tickets_order_items_order_items`
  ADD PRIMARY KEY (`ticketsId`,`orderItemsId`),
  ADD KEY `IDX_d379096a60d8b57be481f7b3f1` (`ticketsId`),
  ADD KEY `IDX_488d1f72bc1b53e3128b84d3a6` (`orderItemsId`);

--
-- Индексы таблицы `tickets_sell`
--
ALTER TABLE `tickets_sell`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_6dba3759a64e28dff2a416401d` (`uid`);

--
-- Индексы таблицы `tickets_tickets_sell_tickets_sell`
--
ALTER TABLE `tickets_tickets_sell_tickets_sell`
  ADD PRIMARY KEY (`ticketsId`,`ticketsSellId`),
  ADD KEY `IDX_e16eec01578f8ae5f159ca7aae` (`ticketsId`),
  ADD KEY `IDX_03b89ab33dcdf5fe6cab5c9692` (`ticketsSellId`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_6e20ce1edf0678a09f1963f958` (`uid`),
  ADD UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`),
  ADD UNIQUE KEY `IDX_2d443082eccd5198f95f2a36e2` (`login`),
  ADD KEY `FK_3e1f52ec904aed992472f2be147` (`avatarId`);

--
-- Индексы таблицы `user_access`
--
ALTER TABLE `user_access`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_95da52cd2e73d533819048acfba` (`userId`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `artists`
--
ALTER TABLE `artists`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `events`
--
ALTER TABLE `events`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT для таблицы `event_dates`
--
ALTER TABLE `event_dates`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT для таблицы `items`
--
ALTER TABLE `items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `item_closest_metro`
--
ALTER TABLE `item_closest_metro`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `maps`
--
ALTER TABLE `maps`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `media`
--
ALTER TABLE `media`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `seo`
--
ALTER TABLE `seo`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `taxonomy`
--
ALTER TABLE `taxonomy`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT для таблицы `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `tickets_sell`
--
ALTER TABLE `tickets_sell`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT для таблицы `user_access`
--
ALTER TABLE `user_access`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `artists`
--
ALTER TABLE `artists`
  ADD CONSTRAINT `FK_75f387d7b036a0541292da6a5d6` FOREIGN KEY (`avatarId`) REFERENCES `media` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_76f9aa6b44e03321c5feef0299c` FOREIGN KEY (`imageId`) REFERENCES `media` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_dd733ff817fd17b0b17ed0a1479` FOREIGN KEY (`seoId`) REFERENCES `seo` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `FK_35515e57a42f4fd00a4172371bb` FOREIGN KEY (`imageId`) REFERENCES `media` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_3fdd14a92b35af6cf0ae7a347da` FOREIGN KEY (`eventManagerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_919dd82b12f6ceb5edbb785fb66` FOREIGN KEY (`headerImageId`) REFERENCES `media` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_b2022872abd0c610b4642411fc0` FOREIGN KEY (`seoId`) REFERENCES `seo` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_b828e114fbd97fff771a8554beb` FOREIGN KEY (`itemId`) REFERENCES `items` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `events_artist_artists`
--
ALTER TABLE `events_artist_artists`
  ADD CONSTRAINT `FK_8fa675f8b34fd1954a3a33fdc80` FOREIGN KEY (`eventsId`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_e828ec9f80bc1f63e31ba644402` FOREIGN KEY (`artistsId`) REFERENCES `artists` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `event_dates`
--
ALTER TABLE `event_dates`
  ADD CONSTRAINT `FK_ed88d5a6c9241fddc6dd7430469` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_fc16d064118d4af93196e38e4ca` FOREIGN KEY (`mapId`) REFERENCES `maps` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `items`
--
ALTER TABLE `items`
  ADD CONSTRAINT `FK_341d76ee69345ce5fa4f55ab948` FOREIGN KEY (`imageId`) REFERENCES `media` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_fc36a611477d9ccddab5a1246c6` FOREIGN KEY (`seoId`) REFERENCES `seo` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `item_closest_metro`
--
ALTER TABLE `item_closest_metro`
  ADD CONSTRAINT `FK_d8b05ba9e71167ae9b09f30abbe` FOREIGN KEY (`itemId`) REFERENCES `items` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `maps`
--
ALTER TABLE `maps`
  ADD CONSTRAINT `FK_70d0f0f9f7a01cafccc7d34a6a6` FOREIGN KEY (`minimapId`) REFERENCES `media` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_d2f7a4af0b8284fdedbd03807d9` FOREIGN KEY (`mapId`) REFERENCES `media` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `FK_151b79a83ba240b0cb31b2302d1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_80f390b083014fd69ec40b8c38c` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `FK_f1d359a55923bb45b057fbdab0d` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `taxonomy`
--
ALTER TABLE `taxonomy`
  ADD CONSTRAINT `FK_180878023662b86bccf04b5d17f` FOREIGN KEY (`iconId`) REFERENCES `media` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_4d6d64d43b1003dde7cd7fd307d` FOREIGN KEY (`imageId`) REFERENCES `media` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `taxonomy_event_events`
--
ALTER TABLE `taxonomy_event_events`
  ADD CONSTRAINT `FK_0181415d7b198185ac6aecb0fac` FOREIGN KEY (`eventsId`) REFERENCES `events` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_70ffbfb7538b1d0229cf49b4aa9` FOREIGN KEY (`taxonomyId`) REFERENCES `taxonomy` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `taxonomy_item_items`
--
ALTER TABLE `taxonomy_item_items`
  ADD CONSTRAINT `FK_7b0d444f4505199f59432858a9d` FOREIGN KEY (`taxonomyId`) REFERENCES `taxonomy` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_9ddbb36d851fbd4dc4542a9c7fb` FOREIGN KEY (`itemsId`) REFERENCES `items` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `FK_79b38cbaa8f0fb3181c677f047d` FOREIGN KEY (`eventDateId`) REFERENCES `event_dates` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `tickets_order_items_order_items`
--
ALTER TABLE `tickets_order_items_order_items`
  ADD CONSTRAINT `FK_488d1f72bc1b53e3128b84d3a6e` FOREIGN KEY (`orderItemsId`) REFERENCES `order_items` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_d379096a60d8b57be481f7b3f12` FOREIGN KEY (`ticketsId`) REFERENCES `tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `tickets_tickets_sell_tickets_sell`
--
ALTER TABLE `tickets_tickets_sell_tickets_sell`
  ADD CONSTRAINT `FK_03b89ab33dcdf5fe6cab5c96926` FOREIGN KEY (`ticketsSellId`) REFERENCES `tickets_sell` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_e16eec01578f8ae5f159ca7aae9` FOREIGN KEY (`ticketsId`) REFERENCES `tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `FK_3e1f52ec904aed992472f2be147` FOREIGN KEY (`avatarId`) REFERENCES `media` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `user_access`
--
ALTER TABLE `user_access`
  ADD CONSTRAINT `FK_95da52cd2e73d533819048acfba` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
