<?php

class CreateOrdersTable extends Migration
{
    public function up()
    {
        $this->createTable('orders', [
            $this->id(),
            $this->string('customer_name', 100),
            $this->string('customer_email', 100),
            $this->string('customer_phone', 20),
            $this->text('customer_address'),
            $this->decimal('total_amount', 10, 2),
            $this->enum('status', ['pending', 'processing', 'completed', 'cancelled'], false, 'pending'),
            $this->text('notes', true),
            ...$this->timestamps()
        ]);
    }

    public function down()
    {
        $this->dropTable('orders');
    }
}