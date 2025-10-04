<?php

class OrdersSeeder extends Seeder
{
    public function run()
    {
        // Check if orders already exist to avoid duplicates
        if ($this->count('orders') > 0) {
            echo "   Orders table already has data, skipping...\n";
            return;
        }

        // Check if books table has data (dependency)
        if ($this->count('books') == 0) {
            echo "   Books table is empty, please run BooksSeeder first\n";
            return;
        }

        // Sample orders data
        $orders = [
            [
                'id' => 1,
                'customer_name' => 'Ahmad Wijaya',
                'customer_email' => 'ahmad.wijaya@example.com',
                'customer_phone' => '081234567890',
                'customer_address' => 'Jl. Merdeka No. 123, RT 05/RW 02, Kelurahan Kebon Jeruk, Jakarta Barat 11530',
                'total_amount' => 224000.00,
                'status' => 'completed',
                'notes' => 'Mohon dikirim dengan bubble wrap, terima kasih',
                'created_at' => '2025-09-25 10:30:00',
                'updated_at' => '2025-09-26 14:20:00'
            ],
            [
                'id' => 2,
                'customer_name' => 'Siti Rahayu',
                'customer_email' => 'siti.rahayu@gmail.com',
                'customer_phone' => '087654321098',
                'customer_address' => 'Perumahan Green Valley Blok A No. 15, Bekasi Timur, Jawa Barat 17113',
                'total_amount' => 135000.00,
                'status' => 'processing',
                'notes' => 'Untuk hadiah ulang tahun anak',
                'created_at' => '2025-09-28 14:15:00',
                'updated_at' => '2025-09-29 09:45:00'
            ],
            [
                'id' => 3,
                'customer_name' => 'Budi Santoso',
                'customer_email' => 'budi.santoso@yahoo.com',
                'customer_phone' => '082345678901',
                'customer_address' => 'Jl. Sudirman No. 456, Komplek Mahkota Mas, Bandung, Jawa Barat 40123',
                'total_amount' => 310000.00,
                'status' => 'pending',
                'notes' => null,
                'created_at' => '2025-10-01 16:22:00',
                'updated_at' => '2025-10-01 16:22:00'
            ],
            [
                'id' => 4,
                'customer_name' => 'Dewi Lestari',
                'customer_email' => 'dewi.lestari@hotmail.com',
                'customer_phone' => '089876543210',
                'customer_address' => 'Jl. Gatot Subroto No. 789, Denpasar Selatan, Bali 80226',
                'total_amount' => 95000.00,
                'status' => 'completed',
                'notes' => 'Alamat mudah ditemukan, di depan warung Pak Kadek',
                'created_at' => '2025-10-02 11:08:00',
                'updated_at' => '2025-10-03 10:15:00'
            ],
            [
                'id' => 5,
                'customer_name' => 'Rizki Pratama',
                'customer_email' => 'rizki.pratama@example.com',
                'customer_phone' => '085432109876',
                'customer_address' => 'Jl. Diponegoro No. 321, Kota Malang, Jawa Timur 65145',
                'total_amount' => 198000.00,
                'status' => 'processing',
                'notes' => 'Bisa dikirim sore hari setelah jam 4',
                'created_at' => '2025-10-03 08:30:00',
                'updated_at' => '2025-10-03 12:45:00'
            ]
        ];

        $this->insert('orders', $orders);

        // Sample order items data
        $orderItems = [
            // Order 1 items (Ahmad Wijaya)
            [
                'order_id' => 1,
                'book_id' => 1,  // Judul Buku Fiksi
                'quantity' => 1,
                'price' => 99000.00,
                'created_at' => '2025-09-25 10:30:00'
            ],
            [
                'order_id' => 1,
                'book_id' => 2,  // Buku Pengembangan Diri
                'quantity' => 1,
                'price' => 125000.00,
                'created_at' => '2025-09-25 10:30:00'
            ],

            // Order 2 items (Siti Rahayu)
            [
                'order_id' => 2,
                'book_id' => 7,  // Jejak Sang Pemimpin
                'quantity' => 1,
                'price' => 135000.00,
                'created_at' => '2025-09-28 14:15:00'
            ],

            // Order 3 items (Budi Santoso)
            [
                'order_id' => 3,
                'book_id' => 4,  // Sejarah Nusantara
                'quantity' => 2,
                'price' => 150000.00,
                'created_at' => '2025-10-01 16:22:00'
            ],
            [
                'order_id' => 3,
                'book_id' => 11, // Kumpulan Kisah Lucu
                'quantity' => 1,
                'price' => 70000.00,
                'created_at' => '2025-10-01 16:22:00'
            ],

            // Order 4 items (Dewi Lestari)
            [
                'order_id' => 4,
                'book_id' => 8,  // Misteri Pulau Hilang
                'quantity' => 1,
                'price' => 95000.00,
                'created_at' => '2025-10-02 11:08:00'
            ],

            // Order 5 items (Rizki Pratama)
            [
                'order_id' => 5,
                'book_id' => 1,  // Judul Buku Fiksi
                'quantity' => 2,
                'price' => 99000.00,
                'created_at' => '2025-10-03 08:30:00'
            ]
        ];

        $this->insert('order_items', $orderItems);

        echo "   Inserted " . count($orders) . " orders\n";
        echo "   Inserted " . count($orderItems) . " order items\n";
    }
}