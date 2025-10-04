<?php

class CreateAdminUsersTable extends Migration
{
    public function up()
    {
        $this->createTable('admin_users', [
            $this->id(),
            $this->unique($this->string('username', 50)),
            $this->unique($this->string('email', 100)),
            $this->string('password'),
            $this->string('full_name', 100),
            $this->default($this->enum('role', ['admin', 'moderator']), 'moderator'),
            $this->default($this->boolean('is_active'), true),
            $this->nullable($this->timestamp('last_login')),
            ...$this->timestamps()
        ]);
    }

    public function down()
    {
        $this->dropTable('admin_users');
    }
}