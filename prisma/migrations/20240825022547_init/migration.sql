-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `coin` INTEGER NOT NULL DEFAULT 0,
    `exp` INTEGER NOT NULL DEFAULT 0,
    `layer` INTEGER NOT NULL DEFAULT 1,
    `x` INTEGER NOT NULL DEFAULT 6,
    `y` INTEGER NOT NULL DEFAULT 0,
    `monstersDefeated` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `playerItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `item_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `terrain` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `layer` INTEGER NOT NULL DEFAULT 1,
    `x` INTEGER NOT NULL,
    `y` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `monster` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `level` INTEGER NOT NULL DEFAULT 1,
    `layer` INTEGER NOT NULL DEFAULT 1,
    `x` INTEGER NOT NULL,
    `y` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `building` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `building_id` INTEGER NOT NULL,
    `level` INTEGER NOT NULL DEFAULT 1,
    `layer` INTEGER NOT NULL DEFAULT 1,
    `x` INTEGER NOT NULL,
    `y` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
