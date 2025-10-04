<?php

class CreateBooksTable extends Migration
{
    public function up()
    {
        $this->createTable('books', [
            $this->id(),
            $this->string('title'),
            $this->string('author', 100),
            $this->decimal('price', 10, 2),
            $this->string('image_url'),
            ...$this->timestamps()
        ]);
    }

    public function down()
    {
        $this->dropTable('books');
    }
}