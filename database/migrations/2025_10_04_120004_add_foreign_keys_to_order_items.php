<?php

class AddForeignKeysToOrderItems extends Migration
{
    public function up()
    {
        // Add foreign key constraints to order_items table
        $this->addForeignKey('order_items', 'order_items_order_id_foreign', 'order_id', 'orders', 'id');
        $this->addForeignKey('order_items', 'order_items_book_id_foreign', 'book_id', 'books', 'id');
        
        // Add indexes for better performance
        $this->addIndex('order_items', 'order_items_order_id_index', 'order_id');
        $this->addIndex('order_items', 'order_items_book_id_index', 'book_id');
    }

    public function down()
    {
        // Drop foreign keys and indexes
        if ($this->tableExists('order_items')) {
            try {
                $this->dropForeignKey('order_items', 'order_items_order_id_foreign');
            } catch (Exception $e) {
                // Foreign key might not exist
            }
            try {
                $this->dropForeignKey('order_items', 'order_items_book_id_foreign');
            } catch (Exception $e) {
                // Foreign key might not exist
            }
            try {
                $this->dropIndex('order_items', 'order_items_order_id_index');
            } catch (Exception $e) {
                // Index might not exist
            }
            try {
                $this->dropIndex('order_items', 'order_items_book_id_index');
            } catch (Exception $e) {
                // Index might not exist
            }
        }
    }
}