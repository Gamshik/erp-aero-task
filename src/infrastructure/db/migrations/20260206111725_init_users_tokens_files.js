exports.up = async function (knex) {
  await knex.schema.createTable("users", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("(UUID())"));
    table.string("identifier", 255).unique().notNullable();
    table.string("passwordHash", 255).notNullable();
  });

  await knex.schema.createTable("tokens", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("(UUID())"));
    table.uuid("userId").notNullable();
    table.string("refreshToken", 255).notNullable();
    table.string("device", 255).nullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now());

    table
      .foreign("userId")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
  });

  await knex.schema.createTable("files", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("(UUID())"));
    table.uuid("userId").notNullable();
    table.string("name", 255).notNullable();
    table.string("mimeType", 100).nullable();
    table.bigInteger("size").nullable();
    table.string("path", 500).notNullable();
    table.timestamp("uploadedAt").defaultTo(knex.fn.now());

    table
      .foreign("userId")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("files");
  await knex.schema.dropTableIfExists("tokens");
  await knex.schema.dropTableIfExists("users");
};
