<?php

class BooksSeeder extends Seeder
{
    public function run()
    {
        // Check if books already exist to avoid duplicates
        if ($this->count('books') > 0) {
            echo "   Books table already has data, skipping...\n";
            return;
        }

        $books = [
            [
                'id' => 1,
                'title' => 'Judul Buku Fiksi',
                'author' => 'Penulis A',
                'price' => 99000.00,
                'image_url' => 'https://placehold.co/270x380/1a7f72/FFFFFF?text=Fiksi'
            ],
            [
                'id' => 2,
                'title' => 'Buku Pengembangan Diri',
                'author' => 'Penulis B',
                'price' => 125000.00,
                'image_url' => 'https://placehold.co/270x380/f0ad4e/FFFFFF?text=Bisnis'
            ],
            [
                'id' => 3,
                'title' => 'Cerita Anak Edukatif',
                'author' => 'Penulis C',
                'price' => 75000.00,
                'image_url' => 'https://placehold.co/270x380/5cb85c/FFFFFF?text=Anak'
            ],
            [
                'id' => 4,
                'title' => 'Sejarah Nusantara',
                'author' => 'Penulis D',
                'price' => 150000.00,
                'image_url' => 'https://placehold.co/270x380/d9534f/FFFFFF?text=Sejarah'
            ],
            [
                'id' => 5,
                'title' => 'Novel Senja',
                'author' => 'Penulis E',
                'price' => 88000.00,
                'image_url' => 'https://placehold.co/270x380/6f42c1/FFFFFF?text=Novel'
            ],
            [
                'id' => 6,
                'title' => 'Galaksi Andromeda',
                'author' => 'Penulis F',
                'price' => 110000.00,
                'image_url' => 'https://placehold.co/270x380/fd7e14/FFFFFF?text=Sci-Fi'
            ],
            [
                'id' => 7,
                'title' => 'Jejak Sang Pemimpin',
                'author' => 'Penulis G',
                'price' => 135000.00,
                'image_url' => 'https://placehold.co/270x380/20c997/FFFFFF?text=Biografi'
            ],
            [
                'id' => 8,
                'title' => 'Misteri Pulau Hilang',
                'author' => 'Penulis H',
                'price' => 95000.00,
                'image_url' => 'https://placehold.co/270x380/343a40/FFFFFF?text=Misteri'
            ],
            [
                'id' => 9,
                'title' => 'Kerajaan Naga',
                'author' => 'Penulis I',
                'price' => 140000.00,
                'image_url' => 'https://placehold.co/270x380/007bff/FFFFFF?text=Fantasi'
            ],
            [
                'id' => 10,
                'title' => 'Rumah di Ujung Jalan',
                'author' => 'Penulis J',
                'price' => 89000.00,
                'image_url' => 'https://placehold.co/270x380/dc3545/FFFFFF?text=Horor'
            ],
            [
                'id' => 11,
                'title' => 'Kumpulan Kisah Lucu',
                'author' => 'Penulis K',
                'price' => 70000.00,
                'image_url' => 'https://placehold.co/270x380/ffc107/000000?text=Komedi'
            ],
            [
                'id' => 12,
                'title' => 'Rahasia Alam Semesta',
                'author' => 'Penulis L',
                'price' => 160000.00,
                'image_url' => 'https://placehold.co/270x380/17a2b8/FFFFFF?text=Sains'
            ]
        ];

        $this->insert('books', $books);
        
        echo "   Inserted " . count($books) . " books\n";
    }
}