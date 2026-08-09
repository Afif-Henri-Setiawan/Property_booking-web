# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## StayNest --- Property Rental Platform

**STATUS: DRAFT SEMENTARA**

  ----------------------------------- -----------------------------------
  **Nama Produk**                     StayNest --- Property Rental
                                      Platform

  **Versi Dokumen**                   v0.1

  **Disusun oleh**                    TBD (Pengembang)

  **Untuk**                           TBD (Klien)

  **Tanggal**                         8 Agustus 2026

  **Dokumen Terkait**                 Konsep dan rancangan awal Property
                                      Rental Platform
  ----------------------------------- -----------------------------------

------------------------------------------------------------------------

# 1. Ringkasan Produk (Overview)

Platform penyewaan properti dibutuhkan untuk memudahkan pengguna
menemukan tempat menginap, mengecek ketersediaan properti berdasarkan
tanggal, melakukan pemesanan, serta menyelesaikan pembayaran secara
online. Dari sisi pemilik properti, dibutuhkan sistem untuk mengelola
properti, harga, fasilitas, ketersediaan, booking, dan pendapatan secara
terpusat. Detail proses operasional yang saat ini digunakan belum
ditentukan sehingga kebutuhan pada dokumen ini berfokus pada rancangan
produk yang akan dibangun.

StayNest merupakan platform web penyewaan properti yang mempertemukan
Guest dengan Host. Sistem menyediakan pencarian dan filter properti,
detail properti, kalender ketersediaan, booking, pembayaran menggunakan
Midtrans, voucher booking digital dengan QR Code, pembatalan sesuai
kebijakan, review dan rating, serta dashboard Host dan Admin. Sistem
juga dirancang untuk mencegah double booking melalui validasi
availability dan transaksi database.

# 2. Tujuan & Sasaran (Goals)

-   Memusatkan proses pencarian dan pemesanan properti dalam satu
    platform.
-   Mengurangi risiko double booking dengan pengelolaan availability dan
    transaksi booking yang terkontrol.
-   Memudahkan Host mengelola properti, harga, ketersediaan, booking,
    dan pendapatan.
-   Menyediakan proses pembayaran online yang terintegrasi dengan
    Midtrans.
-   Memberikan pengalaman booking yang transparan melalui informasi
    harga, tanggal, status, dan voucher digital.
-   Menyediakan data operasional dan performa properti melalui
    dashboard.

# 3. Pengguna & Peran (Users & Roles)

-   **Guest :** pengguna yang mencari properti, melihat detail, mengecek
    ketersediaan, melakukan booking dan pembayaran, melihat voucher,
    membatalkan booking sesuai kebijakan, serta memberikan review
    setelah masa menginap selesai.
-   **Host :** pemilik atau pengelola properti yang dapat membuat dan
    mengelola properti, foto, fasilitas, harga, ketersediaan, booking,
    tamu, dan informasi pendapatan.
-   **Admin :** pengelola platform yang dapat mengelola pengguna, Host,
    properti, kategori, booking, pembayaran, serta melakukan moderasi
    dan pengawasan platform.

# 4. Ruang Lingkup (Scope)

## 4.1 Termasuk (MVP)

-   Registrasi, login, autentikasi, dan role management.
-   Pencarian dan filter properti berdasarkan lokasi, tanggal, jumlah
    tamu, harga, tipe properti, fasilitas, dan rating.
-   Detail properti beserta foto, fasilitas, kapasitas, lokasi, harga,
    dan rating.
-   Pengelolaan properti oleh Host.
-   Pengelolaan availability dan harga properti.
-   Booking berdasarkan tanggal check-in dan check-out.
-   Pencegahan double booking dan overselling unit.
-   Pembayaran booking menggunakan Midtrans.
-   Payment notification/webhook dan verifikasi pembayaran di backend.
-   Voucher booking digital dan QR Code.
-   Pengelolaan pembatalan booking sesuai kebijakan.
-   Review dan rating dari Guest yang memiliki booking valid dan telah
    selesai.
-   Dashboard Guest, Host, dan Admin.
-   Statistik booking, pendapatan, okupansi, dan check-in dasar.

## 4.2 Di Luar Lingkup Awal / Fase Lanjutan

Fitur seperti wishlist, rekomendasi properti, email notification, refund
otomatis, chat Guest--Host, dynamic pricing, Redis caching, waitlist,
dan aplikasi mobile ditempatkan sebagai fitur usulan/fase lanjutan pada
Bab 11.

# 5. Asumsi & Batasan (Assumptions & Constraints)

-   **Asumsi pengembang:** aplikasi dibangun sebagai web application
    menggunakan Next.js dan TypeScript pada frontend.
-   **Asumsi pengembang:** backend menggunakan Node.js dan Express.js
    dengan REST API.
-   **Asumsi pengembang:** PostgreSQL digunakan sebagai database utama
    dan Prisma digunakan sebagai ORM.
-   **Asumsi pengembang:** autentikasi menggunakan JWT dan role-based
    access control.
-   **Asumsi pengembang:** pembayaran menggunakan Midtrans Snap dan
    tahap pengembangan menggunakan environment Sandbox sebelum
    production.
-   **Asumsi pengembang:** status pembayaran yang diterima dari frontend
    tidak menjadi satu-satunya dasar konfirmasi booking; backend
    memverifikasi status transaksi melalui mekanisme Midtrans sebelum
    booking dikonfirmasi.
-   **Asumsi pengembang:** satu property dapat memiliki satu atau lebih
    unit yang dapat disewakan; detail model unit/property masih perlu
    ditentukan.
-   **Asumsi pengembang:** availability booking dihitung berdasarkan
    rentang tanggal check-in dan check-out.
-   **Batasan:** kebijakan pembatalan dan refund belum ditentukan.
-   **Batasan:** nama brand final, biaya layanan, metode pembayaran
    production, hosting, cloud storage, dan kebijakan operasional belum
    ditentukan.
-   **Batasan:** detail proses check-in/check-out fisik belum
    ditentukan.

# 6. Kebutuhan Fungsional (Functional Requirements)

## 6.1 Guest --- Autentikasi & Akun

  -----------------------------------------------------------------------
  **ID**                  **Kebutuhan             **Prioritas**
                          Fungsional**            
  ----------------------- ----------------------- -----------------------
  **AUTH-1**              Guest dapat melakukan   **Wajib**
                          registrasi menggunakan  
                          nama, email, dan        
                          password.               

  **AUTH-2**              Guest dapat melakukan   **Wajib**
                          login menggunakan email 
                          dan password.           

  **AUTH-3**              Sistem melakukan        **Wajib**
                          autentikasi pengguna    
                          menggunakan mekanisme   
                          token yang aman.        

  **AUTH-4**              Guest dapat melakukan   **Wajib**
                          logout.                 

  **AUTH-5**              Sistem menerapkan hak   **Wajib**
                          akses berdasarkan role  
                          Guest, Host, dan Admin. 

  **AUTH-6**              Guest dapat melihat dan **Penting**
                          mengubah informasi      
                          profil dasar.           
  -----------------------------------------------------------------------

## 6.2 Guest --- Pencarian & Filter Properti

  -----------------------------------------------------------------------
  **ID**                  **Kebutuhan             **Prioritas**
                          Fungsional**            
  ----------------------- ----------------------- -----------------------
  **SRCH-1**              Guest dapat mencari     **Wajib**
                          properti berdasarkan    
                          lokasi atau kata kunci. 

  **SRCH-2**              Guest dapat menentukan  **Wajib**
                          tanggal check-in dan    
                          check-out saat          
                          melakukan pencarian.    

  **SRCH-3**              Guest dapat menentukan  **Wajib**
                          jumlah tamu saat        
                          melakukan pencarian.    

  **SRCH-4**              Sistem hanya            **Wajib**
                          menampilkan properti    
                          yang tersedia untuk     
                          rentang tanggal yang    
                          dipilih.                

  **SRCH-5**              Guest dapat memfilter   **Penting**
                          properti berdasarkan    
                          harga minimum dan       
                          maksimum.               

  **SRCH-6**              Guest dapat memfilter   **Penting**
                          berdasarkan tipe        
                          properti.               

  **SRCH-7**              Guest dapat memfilter   **Penting**
                          berdasarkan fasilitas.  

  **SRCH-8**              Guest dapat memfilter   **Penting**
                          berdasarkan rating.     

  **SRCH-9**              Sistem mendukung        **Penting**
                          pagination pada daftar  
                          properti.               
  -----------------------------------------------------------------------

## 6.3 Guest --- Detail Properti

  -----------------------------------------------------------------------
  **ID**                  **Kebutuhan             **Prioritas**
                          Fungsional**            
  ----------------------- ----------------------- -----------------------
  **PROP-1**              Guest dapat melihat     **Wajib**
                          detail properti yang    
                          dipublikasikan.         

  **PROP-2**              Sistem menampilkan foto **Wajib**
                          properti dalam bentuk   
                          galeri.                 

  **PROP-3**              Sistem menampilkan      **Wajib**
                          deskripsi, lokasi, tipe 
                          properti, kapasitas     
                          tamu, jumlah kamar      
                          tidur, dan kamar mandi. 

  **PROP-4**              Sistem menampilkan      **Wajib**
                          harga per malam.        

  **PROP-5**              Sistem menampilkan      **Wajib**
                          fasilitas properti.     

  **PROP-6**              Sistem menampilkan      **Penting**
                          rating dan review       
                          properti.               

  **PROP-7**              Sistem menampilkan      **Wajib**
                          informasi ketersediaan  
                          berdasarkan tanggal     
                          yang dipilih.           
  -----------------------------------------------------------------------

## 6.4 Host --- Manajemen Properti

  -----------------------------------------------------------------------
  **ID**                  **Kebutuhan             **Prioritas**
                          Fungsional**            
  ----------------------- ----------------------- -----------------------
  **HOST-1**              Host dapat membuat      **Wajib**
                          properti baru.          

  **HOST-2**              Host dapat mengisi      **Wajib**
                          nama, deskripsi, tipe,  
                          lokasi, harga per       
                          malam, kapasitas tamu,  
                          jumlah kamar tidur, dan 
                          kamar mandi.            

  **HOST-3**              Host dapat mengunggah   **Wajib**
                          beberapa foto properti. 

  **HOST-4**              Host dapat menambahkan  **Wajib**
                          fasilitas properti.     

  **HOST-5**              Host dapat mengubah     **Wajib**
                          informasi properti yang 
                          dikelolanya.            

  **HOST-6**              Host dapat menghapus    **Penting**
                          atau menonaktifkan      
                          properti sesuai status  
                          dan hak akses.          

  **HOST-7**              Host dapat melihat      **Wajib**
                          daftar properti yang    
                          dikelolanya.            

  **HOST-8**              Sistem dapat memiliki   **Penting**
                          status properti seperti 
                          Draft, Pending,         
                          Published, Rejected,    
                          Inactive, dan           
                          Suspended.              
  -----------------------------------------------------------------------

## 6.5 Host --- Harga & Availability

  -----------------------------------------------------------------------
  **ID**                  **Kebutuhan             **Prioritas**
                          Fungsional**            
  ----------------------- ----------------------- -----------------------
  **AVAL-1**              Host dapat menentukan   **Wajib**
                          harga sewa per malam.   

  **AVAL-2**              Host dapat melihat      **Wajib**
                          kalender availability   
                          properti.               

  **AVAL-3**              Host dapat menandai     **Wajib**
                          tanggal tertentu        
                          sebagai tidak tersedia. 

  **AVAL-4**              Sistem menghitung       **Wajib**
                          ketersediaan            
                          berdasarkan booking     
                          yang telah dibuat.      

  **AVAL-5**              Sistem mencegah tanggal **Wajib**
                          yang sudah terisi untuk 
                          dipesan kembali.        

  **AVAL-6**              Sistem dapat            **Wajib**
                          memperbarui             
                          ketersediaan setelah    
                          booking dibatalkan atau 
                          expired.                

  **AVAL-7**              Host dapat menentukan   **Fase 2**
                          harga berbeda untuk     
                          tanggal atau periode    
                          tertentu.               
  -----------------------------------------------------------------------

## 6.6 Guest --- Booking

  -----------------------------------------------------------------------
  **ID**                  **Kebutuhan             **Prioritas**
                          Fungsional**            
  ----------------------- ----------------------- -----------------------
  **BOOK-1**              Guest dapat memilih     **Wajib**
                          tanggal check-in dan    
                          check-out.              

  **BOOK-2**              Guest dapat menentukan  **Wajib**
                          jumlah tamu.            

  **BOOK-3**              Sistem memeriksa        **Wajib**
                          availability sebelum    
                          membuat booking.        

  **BOOK-4**              Sistem menghitung       **Wajib**
                          jumlah malam            
                          berdasarkan tanggal     
                          check-in dan check-out. 

  **BOOK-5**              Sistem menghitung total **Wajib**
                          harga booking           
                          berdasarkan harga per   
                          malam dan durasi        
                          menginap.               

  **BOOK-6**              Sistem membuat booking  **Wajib**
                          dengan nomor booking    
                          yang unik.              

  **BOOK-7**              Sistem menahan          **Penting**
                          ketersediaan property   
                          selama proses           
                          pembayaran sesuai batas 
                          waktu yang ditentukan.  

  **BOOK-8**              Sistem menggunakan      **Wajib**
                          transaksi database      
                          untuk mencegah double   
                          booking pada proses     
                          booking bersamaan.      

  **BOOK-9**              Guest dapat melihat     **Wajib**
                          detail booking.         

  **BOOK-10**             Guest dapat melihat     **Wajib**
                          riwayat booking.        

  **BOOK-11**             Sistem mengubah booking **Penting**
                          yang tidak dibayar      
                          hingga batas waktu      
                          menjadi Expired dan     
                          melepaskan              
                          availability.           
  -----------------------------------------------------------------------

## 6.7 Guest --- Pembayaran Midtrans

  -----------------------------------------------------------------------
  **ID**                  **Kebutuhan             **Prioritas**
                          Fungsional**            
  ----------------------- ----------------------- -----------------------
  **PAY-1**               Sistem dapat membuat    **Wajib**
                          transaksi pembayaran    
                          Midtrans berdasarkan    
                          booking.                

  **PAY-2**               Backend dapat meminta   **Wajib**
                          Snap Token ke Midtrans  
                          berdasarkan detail      
                          transaksi booking.      

  **PAY-3**               Frontend dapat membuka  **Wajib**
                          Midtrans Snap Checkout  
                          menggunakan Snap Token. 

  **PAY-4**               Guest dapat             **Wajib**
                          menyelesaikan           
                          pembayaran menggunakan  
                          metode pembayaran yang  
                          tersedia pada Midtrans. 

  **PAY-5**               Sistem menyediakan      **Wajib**
                          endpoint notification   
                          untuk menerima          
                          perubahan status        
                          transaksi dari          
                          Midtrans.               

  **PAY-6**               Backend memverifikasi   **Wajib**
                          status transaksi        
                          sebelum mengubah        
                          booking menjadi         
                          Confirmed.              

  **PAY-7**               Sistem dapat menangani  **Wajib**
                          status pembayaran       
                          Pending, Paid, Failed,  
                          dan Expired.            

  **PAY-8**               Sistem menyimpan        **Wajib**
                          reference transaksi     
                          Midtrans dan informasi  
                          status pembayaran.      

  **PAY-9**               Sistem menampilkan      **Penting**
                          hasil pembayaran kepada 
                          Guest setelah proses    
                          checkout.               
  -----------------------------------------------------------------------

## 6.8 Guest --- Voucher Booking & QR Code

  -----------------------------------------------------------------------
  **ID**                  **Kebutuhan             **Prioritas**
                          Fungsional**            
  ----------------------- ----------------------- -----------------------
  **VCHR-1**              Sistem membuat voucher  **Wajib**
                          booking setelah         
                          pembayaran berhasil dan 
                          terverifikasi.          

  **VCHR-2**              Sistem menghasilkan     **Wajib**
                          nomor booking yang      
                          unik.                   

  **VCHR-3**              Sistem menghasilkan QR  **Wajib**
                          Code untuk voucher      
                          booking.                

  **VCHR-4**              Guest dapat melihat     **Wajib**
                          voucher booking melalui 
                          dashboard.              

  **VCHR-5**              Voucher menampilkan     **Wajib**
                          properti, tanggal       
                          menginap, jumlah tamu,  
                          nomor booking, dan      
                          status booking.         

  **VCHR-6**              QR Code dapat digunakan **Penting**
                          untuk verifikasi        
                          booking saat proses     
                          check-in.               
  -----------------------------------------------------------------------

## 6.9 Guest --- Pembatalan Booking

  -----------------------------------------------------------------------
  **ID**                  **Kebutuhan             **Prioritas**
                          Fungsional**            
  ----------------------- ----------------------- -----------------------
  **CANC-1**              Guest dapat mengajukan  **Wajib**
                          pembatalan booking yang 
                          memenuhi syarat.        

  **CANC-2**              Sistem memeriksa        **Wajib**
                          kelayakan pembatalan    
                          berdasarkan kebijakan   
                          pembatalan.             

  **CANC-3**              Sistem mengubah status  **Wajib**
                          booking menjadi         
                          Cancelled jika          
                          pembatalan berhasil.    

  **CANC-4**              Sistem mengembalikan    **Wajib**
                          availability setelah    
                          booking dibatalkan.     

  **CANC-5**              Sistem dapat menghitung **Penting**
                          nilai refund            
                          berdasarkan kebijakan   
                          pembatalan.             

  **CANC-6**              Sistem dapat memproses  **Fase 2**
                          refund otomatis melalui 
                          payment gateway.        
  -----------------------------------------------------------------------

## 6.10 Guest --- Review & Rating

  -----------------------------------------------------------------------
  **ID**                  **Kebutuhan             **Prioritas**
                          Fungsional**            
  ----------------------- ----------------------- -----------------------
  **REVW-1**              Guest dapat memberikan  **Wajib**
                          rating terhadap         
                          properti setelah        
                          booking selesai.        

  **REVW-2**              Guest dapat memberikan  **Wajib**
                          komentar review.        

  **REVW-3**              Sistem hanya            **Wajib**
                          mengizinkan review dari 
                          Guest yang memiliki     
                          booking valid terhadap  
                          properti tersebut.      

  **REVW-4**              Sistem hanya            **Wajib**
                          mengizinkan review      
                          setelah masa menginap   
                          selesai.                

  **REVW-5**              Sistem menampilkan      **Penting**
                          rata-rata rating dan    
                          daftar review pada      
                          halaman properti.       

  **REVW-6**              Admin dapat memoderasi  **Fase 2**
                          review yang melanggar   
                          kebijakan platform.     
  -----------------------------------------------------------------------

## 6.11 Host --- Booking & Tamu

  -----------------------------------------------------------------------
  **ID**                  **Kebutuhan             **Prioritas**
                          Fungsional**            
  ----------------------- ----------------------- -----------------------
  **HBKG-1**              Host dapat melihat      **Wajib**
                          booking pada properti   
                          yang dikelolanya.       

  **HBKG-2**              Host dapat melihat      **Wajib**
                          detail tamu pada        
                          booking yang valid.     

  **HBKG-3**              Host dapat melihat      **Wajib**
                          status booking.         

  **HBKG-4**              Host dapat melihat      **Wajib**
                          jadwal check-in dan     
                          check-out.              

  **HBKG-5**              Host dapat melihat      **Penting**
                          daftar booking          
                          mendatang.              
  -----------------------------------------------------------------------

## 6.12 Host --- Dashboard & Analytics

  -----------------------------------------------------------------------
  **ID**                  **Kebutuhan             **Prioritas**
                          Fungsional**            
  ----------------------- ----------------------- -----------------------
  **ANLT-1**              Host dapat melihat      **Wajib**
                          jumlah properti yang    
                          dikelola.               

  **ANLT-2**              Host dapat melihat      **Wajib**
                          jumlah booking.         

  **ANLT-3**              Host dapat melihat      **Wajib**
                          total pendapatan        
                          booking.                

  **ANLT-4**              Host dapat melihat      **Penting**
                          tingkat okupansi        
                          properti.               

  **ANLT-5**              Host dapat melihat      **Penting**
                          rata-rata harga per     
                          malam.                  

  **ANLT-6**              Sistem menampilkan      **Penting**
                          grafik pendapatan       
                          berdasarkan periode.    

  **ANLT-7**              Sistem menampilkan      **Penting**
                          ringkasan performa      
                          setiap properti.        
  -----------------------------------------------------------------------

## 6.13 Admin --- Manajemen Platform

  -----------------------------------------------------------------------
  **ID**                  **Kebutuhan             **Prioritas**
                          Fungsional**            
  ----------------------- ----------------------- -----------------------
  **ADMN-1**              Admin dapat melihat dan **Wajib**
                          mengelola pengguna.     

  **ADMN-2**              Admin dapat melihat dan **Wajib**
                          mengelola Host.         

  **ADMN-3**              Admin dapat melihat     **Wajib**
                          properti yang           
                          terdaftar.              

  **ADMN-4**              Admin dapat melakukan   **Wajib**
                          moderasi atau           
                          persetujuan properti.   

  **ADMN-5**              Admin dapat             **Penting**
                          menonaktifkan properti  
                          yang melanggar          
                          kebijakan.              

  **ADMN-6**              Admin dapat mengelola   **Wajib**
                          kategori properti.      

  **ADMN-7**              Admin dapat melihat     **Penting**
                          booking pada platform.  

  **ADMN-8**              Admin dapat melihat     **Penting**
                          transaksi pembayaran.   

  **ADMN-9**              Admin dapat melihat     **Penting**
                          statistik platform.     
  -----------------------------------------------------------------------

# 7. Alur Pengguna Utama (Key User Flows)

## 7.1 Guest --- Mencari dan Melakukan Booking

1.  Guest membuka halaman pencarian properti.
2.  Guest memasukkan lokasi.
3.  Guest memilih tanggal check-in dan check-out.
4.  Guest menentukan jumlah tamu.
5.  Sistem mencari properti yang sesuai dan masih tersedia.
6.  Guest memilih properti.
7.  Sistem menampilkan detail properti, fasilitas, harga, rating, dan
    availability.
8.  Guest memilih tanggal dan jumlah tamu.
9.  Sistem melakukan pengecekan availability terbaru.
10. Sistem menghitung jumlah malam dan total biaya.
11. Guest melanjutkan proses booking.
12. Sistem membuat booking dengan status **"Menunggu Pembayaran"** dan
    menahan availability sesuai batas waktu pembayaran.

## 7.2 Guest --- Pembayaran dengan Midtrans

1.  Guest membuat booking.
2.  Backend membuat transaksi pembayaran berdasarkan booking.
3.  Backend meminta Snap Token kepada Midtrans.
4.  Frontend membuka Midtrans Snap Checkout menggunakan Snap Token.
5.  Guest memilih metode pembayaran dan menyelesaikan pembayaran.
6.  Midtrans memproses transaksi.
7.  Midtrans mengirimkan notification status transaksi ke backend.
8.  Backend memverifikasi status pembayaran.
9.  Jika pembayaran berhasil, status booking berubah menjadi
    **"Confirmed"**.
10. Sistem membuat voucher booking dan QR Code.
11. Guest dapat melihat voucher booking pada dashboard.

## 7.3 Host --- Membuat Properti

1.  Host melakukan login.
2.  Host membuka dashboard.
3.  Host memilih menu tambah properti.
4.  Host mengisi informasi properti.
5.  Host mengunggah foto.
6.  Host menambahkan fasilitas.
7.  Host menentukan harga dan kapasitas.
8.  Host menyimpan properti.
9.  Sistem menyimpan properti dengan status yang sesuai.
10. Jika diperlukan persetujuan admin, properti berada pada status
    **"Pending"**.
11. Setelah disetujui, properti menjadi **"Published"** dan dapat muncul
    pada pencarian.

## 7.4 Booking Bersamaan dan Pencegahan Double Booking

1.  Guest A dan Guest B memilih properti dan tanggal yang sama dalam
    waktu hampir bersamaan.
2.  Sistem menerima dua permintaan booking.
3.  Backend melakukan pengecekan availability.
4.  Sistem menjalankan proses booking menggunakan transaksi database.
5.  Salah satu transaksi memperoleh hak untuk melakukan reservasi
    terlebih dahulu.
6.  Availability diperbarui atau booking dibuat.
7.  Permintaan lainnya melakukan pengecekan ulang terhadap availability.
8.  Jika tidak tersedia, sistem menolak booking dan menampilkan
    informasi bahwa properti tidak lagi tersedia.
9.  Sistem tidak boleh menghasilkan dua booking aktif untuk unit/tanggal
    yang sama.

## 7.5 Pembatalan Booking

1.  Guest membuka detail booking.
2.  Guest memilih pembatalan.
3.  Sistem memeriksa status booking dan aturan pembatalan.
4.  Jika booking memenuhi syarat, sistem menghitung konsekuensi
    pembatalan.
5.  Booking berubah menjadi **"Cancelled"**.
6.  Availability properti dikembalikan.
7.  Jika refund berlaku, sistem mencatat nilai refund.
8.  Proses refund otomatis melalui payment gateway dilakukan pada fase
    yang telah ditentukan atau secara manual sesuai kebijakan yang
    ditetapkan.

## 7.6 Guest --- Review Setelah Menginap

1.  Guest menyelesaikan masa menginap.
2.  Sistem mengubah booking menjadi **"Completed"** sesuai proses
    check-out.
3.  Guest membuka riwayat booking.
4.  Sistem menyediakan opsi review untuk booking yang telah selesai.
5.  Guest memberikan rating dan komentar.
6.  Sistem menyimpan review.
7.  Rating properti diperbarui.
8.  Review ditampilkan pada halaman properti sesuai kebijakan moderasi.

# 8. Model Data (High-Level)

  ------------------------------------------------------------------------------------
  **Entitas**                       **Field Utama**            **Keterangan**
  --------------------------------- -------------------------- -----------------------
  **users**                         id, name, email, password, Menyimpan akun Guest,
                                    role, avatar, created_at,  Host, dan Admin.
                                    updated_at                 

  **properties**                    id, host_id, title,        Menyimpan informasi
                                    description,               properti yang
                                    property_type, address,    ditawarkan.
                                    city, latitude, longitude, 
                                    price_per_night,           
                                    max_guests, bedrooms,      
                                    bathrooms, status,         
                                    created_at, updated_at     

  **property_images**               id, property_id,           Menyimpan foto
                                    image_url, sort_order,     properti.
                                    created_at                 

  **amenities**                     id, name, slug             Menyimpan daftar
                                                               fasilitas yang
                                                               tersedia.

  **property_amenities**            property_id, amenity_id    Relasi properti dan
                                                               fasilitas.

  **availability_blocks**           id, property_id,           Menyimpan periode
                                    start_date, end_date,      ketika properti tidak
                                    reason, status             tersedia secara manual.

  **bookings**                      id, property_id, guest_id, Menyimpan data
                                    booking_number, check_in,  pemesanan properti.
                                    check_out, guests, nights, 
                                    subtotal, service_fee,     
                                    total_amount, status,      
                                    expires_at, created_at,    
                                    updated_at                 

  **payments**                      id, booking_id,            Menyimpan data
                                    midtrans_order_id,         transaksi pembayaran
                                    midtrans_transaction_id,   Midtrans.
                                    payment_reference, amount, 
                                    payment_method,            
                                    transaction_status,        
                                    fraud_status, paid_at,     
                                    created_at                 

  **booking_guests**                id, booking_id, name,      Menyimpan informasi
                                    email, phone               tamu pada booking jika
                                                               diperlukan.

  **reviews**                       id, property_id, user_id,  Menyimpan rating dan
                                    booking_id, rating,        review dari Guest yang
                                    comment, created_at,       memenuhi syarat.
                                    updated_at                 

  **check_ins**                     id, booking_id,            Mencatat proses
                                    scanned_by, checked_in_at  verifikasi/check-in
                                                               booking.

  **property_categories**           id, name, slug             Menyimpan kategori
                                                               properti.

  **property_category_relations**   property_id, category_id   Relasi properti dan
                                                               kategori.
  ------------------------------------------------------------------------------------

**Catatan:** field dalam \[tanda kurung siku\] merupakan bagian dari
fitur usulan/Fase Lanjutan (Bab 11). Model data dapat berubah
berdasarkan keputusan final terkait unit properti, kebijakan refund, dan
fitur lanjutan.

# 9. Kebutuhan Non-Fungsional (Non-Functional Requirements)

-   **Responsivitas :** Sistem harus dapat digunakan dengan nyaman pada
    desktop, tablet, dan perangkat mobile.
-   **Keamanan :** Sistem harus menerapkan autentikasi, role-based
    authorization, password hashing, validasi input, dan pembatasan
    akses berdasarkan kepemilikan data.
-   **Keamanan pembayaran :** Credential Midtrans seperti Server Key
    harus disimpan sebagai environment variable dan tidak boleh diekspos
    pada frontend.
-   **Verifikasi pembayaran :** Sistem tidak boleh mengubah booking
    menjadi Confirmed hanya berdasarkan callback frontend; status
    pembayaran harus diverifikasi pada backend.
-   **Integritas booking :** Sistem harus mencegah double booking dengan
    transaksi database dan mekanisme pengecekan availability yang aman
    terhadap request bersamaan.
-   **Performa :** Search dan listing harus menggunakan pagination,
    query yang efisien, serta index database pada field yang sering
    digunakan untuk pencarian dan booking.
-   **Privasi data :** Data pribadi Guest dan Host hanya dapat diakses
    oleh pihak yang memiliki hak akses sesuai kebutuhan bisnis.
-   **Ketersediaan :** Sistem harus menangani kegagalan payment gateway
    atau koneksi dengan status transaksi yang jelas tanpa membuat
    booking menjadi Confirmed secara keliru.
-   **Skalabilitas :** Arsitektur harus memungkinkan penambahan caching,
    queue, real-time notification, dan peningkatan kapasitas server.
-   **Maintainability :** Backend menggunakan pemisahan route,
    controller, service, middleware, dan validation agar kode mudah
    dikembangkan dan dipelihara.

# 10. Integrasi Pihak Ketiga

  -----------------------------------------------------------------------
  **Layanan**             **Fungsi**              **Catatan**
  ----------------------- ----------------------- -----------------------
  **Midtrans Snap**       Menyediakan checkout    **Wajib pada MVP.**
                          pembayaran untuk        Backend menghasilkan
                          booking properti.       Snap Token dan frontend
                                                  membuka Snap Checkout.

  **Midtrans Payment      Mengirimkan perubahan   **Wajib pada MVP.**
  Notification**          status pembayaran dari  Backend harus
                          Midtrans ke backend.    memverifikasi status
                                                  sebelum booking
                                                  dikonfirmasi.

  **QR Code               Menghasilkan QR Code    **Wajib pada MVP.**
  Library/Service**       untuk voucher booking   Library spesifik TBD.
                          dan membantu proses     
                          verifikasi.             

  **Cloud Storage**       Menyimpan foto          Teknologi/layanan
                          properti.               spesifik TBD; dapat
                                                  menggunakan Cloudinary,
                                                  object storage, atau
                                                  layanan sejenis.
  -----------------------------------------------------------------------

# 11. Fitur Usulan / Fase Lanjutan

-   **Wishlist/Favorite.** Guest dapat menyimpan properti favorit untuk
    dilihat kembali.
-   **Email Notification.** Sistem mengirimkan email untuk konfirmasi
    booking, pembayaran, pembatalan, dan pengingat check-in.
-   **Refund Otomatis.** Sistem mengintegrasikan proses refund dengan
    payment gateway berdasarkan kebijakan pembatalan.
-   **Chat Guest--Host.** Guest dan Host dapat berkomunikasi melalui
    sistem sebelum atau setelah booking.
-   **Dynamic Pricing.** Host dapat menentukan harga berbeda berdasarkan
    musim, hari, tingkat permintaan, atau periode tertentu.
-   **Waitlist.** Guest dapat mendaftar sebagai waiting list ketika
    properti atau periode tertentu tidak tersedia.
-   **Rekomendasi Properti.** Sistem memberikan rekomendasi berdasarkan
    lokasi, riwayat pencarian, booking, atau preferensi Guest.
-   **Redis Caching.** Cache digunakan untuk meningkatkan performa
    pencarian dan data yang sering diakses.
-   **Real-time Availability.** Perubahan availability dapat diperbarui
    secara real-time pada halaman pencarian atau detail properti.
-   **Mobile Application.** Platform dikembangkan menjadi aplikasi
    mobile untuk Guest dan Host.
-   **Advanced Analytics.** Host dan Admin mendapatkan analisis lebih
    mendalam seperti revenue per property, occupancy trend, booking
    conversion, average length of stay, dan performa periode.
-   **Multi-unit Property.** Satu listing dapat memiliki beberapa
    unit/kamar dengan availability dan inventori masing-masing.
-   **Promo & Voucher.** Host atau platform dapat membuat kode promo dan
    potongan harga.
-   **Map Integration.** Guest dapat melihat properti pada peta
    interaktif dan mencari berdasarkan area.

# 12. Pertanyaan Terbuka / TBD

-   Apakah nama produk final yang digunakan adalah "StayNest"?
-   Siapa nama pengembang dan klien yang akan dicantumkan pada dokumen
    final?
-   Apakah properti dapat berupa villa, hotel, apartment, homestay,
    rumah, atau tipe lainnya?
-   Apakah satu listing mewakili satu properti/unit atau satu properti
    dapat memiliki beberapa unit/kamar?
-   Apakah setiap booking hanya dapat mencakup satu properti?
-   Apakah Guest dapat memesan beberapa unit dalam satu transaksi?
-   Berapa lama batas waktu pembayaran setelah booking dibuat?
-   Apa kebijakan pembatalan untuk setiap rentang waktu sebelum
    check-in?
-   Apakah refund akan dilakukan otomatis melalui Midtrans atau diproses
    manual?
-   Apakah biaya layanan platform dikenakan kepada Guest, Host, atau
    keduanya?
-   Apakah pajak dan biaya tambahan perlu dihitung dalam total booking?
-   Apakah Host harus melalui verifikasi identitas sebelum dapat
    mempublikasikan properti?
-   Apakah setiap properti wajib mendapatkan persetujuan Admin?
-   Bagaimana proses check-in dan check-out secara operasional?
-   Apakah QR Code hanya digunakan untuk verifikasi booking atau juga
    untuk proses check-in?
-   Apakah Host dapat mengubah harga setelah terdapat booking aktif?
-   Apakah Host dapat menutup availability secara manual pada tanggal
    tertentu?
-   Apakah rating/review hanya dapat diberikan satu kali untuk setiap
    booking?
-   Payment method Midtrans apa saja yang akan diaktifkan pada
    production?
-   Apakah Midtrans Snap akan digunakan dalam mode Popup atau Redirect?
-   Apakah akun Midtrans production sudah tersedia?
-   Layanan cloud storage apa yang akan digunakan untuk foto properti?
-   Hosting production apa yang akan digunakan untuk frontend, backend,
    dan PostgreSQL?
-   Apakah platform membutuhkan multi-language?
-   Apakah platform membutuhkan multi-currency?
-   Apakah Guest dapat melakukan booking tanpa login?
-   Apakah diperlukan fitur notifikasi email pada MVP?

# 13. Glosarium

-   **Guest :** pengguna yang mencari dan melakukan pemesanan properti.
-   **Host :** pemilik atau pengelola properti yang menawarkan properti
    melalui platform.
-   **Admin :** pengelola platform yang bertanggung jawab terhadap
    moderasi dan operasional sistem.
-   **Property :** properti yang ditawarkan untuk disewa melalui
    platform.
-   **Availability :** kondisi ketersediaan properti pada rentang
    tanggal tertentu.
-   **Booking :** data pemesanan yang dibuat Guest untuk menyewa
    properti pada tanggal tertentu.
-   **Check-in :** tanggal atau proses ketika Guest mulai menggunakan
    properti.
-   **Check-out :** tanggal atau proses ketika Guest mengakhiri masa
    menginap.
-   **Double Booking :** kondisi ketika properti atau unit yang sama
    berhasil dipesan oleh lebih dari satu booking pada periode yang
    saling bertabrakan.
-   **Midtrans Snap :** layanan checkout Midtrans yang digunakan untuk
    memproses pembayaran booking.
-   **Snap Token :** token transaksi yang digunakan frontend untuk
    membuka proses pembayaran Midtrans Snap.
-   **Payment Notification :** notifikasi dari Midtrans ke backend
    mengenai perubahan status transaksi.
-   **Digital Voucher :** bukti booking elektronik yang berisi informasi
    reservasi dan dapat digunakan untuk verifikasi.
-   **QR Code :** kode dua dimensi yang digunakan sebagai
    identitas/verifikasi voucher booking.
-   **Occupancy Rate :** persentase tingkat keterisian atau penggunaan
    properti pada periode tertentu.
-   **Refund :** pengembalian dana kepada Guest sesuai kebijakan
    pembatalan.
-   **MVP :** Minimum Viable Product, yaitu versi awal produk yang
    memiliki kebutuhan utama agar dapat digunakan.
-   **TBD :** To Be Determined, yaitu informasi yang masih perlu
    ditentukan atau disepakati.

------------------------------------------------------------------------

*Dokumen ini merupakan draft sementara dan dapat berubah seiring
pembahasan lebih lanjut dengan klien.*
