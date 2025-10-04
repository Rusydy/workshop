<?php

class CreateOrderItemsTable extends Migration
{
    public function up()
    {
        $this->createTable('order_items', [
            $this->id(),
            $this->integer('order_id'),
            $this->integer('book_id'),
            $this->integer('quantity'),
            $this->decimal('price', 10, 2),
            "`created_at` timestamp DEFAULT CURRENT_TIMESTAMP"
        ]);

        // Foreign keys will be added in a separate migration
        // This allows for proper dependency management during seeding
    }

    public function down()
    {
        $this->dropTable('order_items');
    }
}