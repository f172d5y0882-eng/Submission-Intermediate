import Swal from 'sweetalert2';

class AddStoryPage {
  async render() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      location.hash = '#/login';
      return '<p>Redirecting to login...</p>';
    }

    return `
      <section class="container">
        <h2>Tambah Cerita Baru</h2>

        <form id="story-form">
          <div>
            <label for="name">Nama:</label>
            <input type="text" id="name" name="name" required />
          </div>

          <div>
            <label for="description">Deskripsi:</label>
            <textarea id="description" name="description" required></textarea>
          </div>

          <div>
            <label for="photo">Upload Gambar:</label>
            <input type="file" id="photo" name="photo" accept="image/*" />

            <p>Atau ambil dari kamera:</p>
            <button type="button" id="open-camera">Buka Kamera</button>
            <button type="button" id="stop-camera" style="display:none; margin-left:10px;">Tutup Kamera</button>
            <button type="button" id="reset-media" class="hidden" style="margin-left: 10px;">Reset Gambar</button>

            <video id="video" width="300" autoplay style="display:none; margin-block:10px;"></video>
            <button type="button" id="capture" style="display:none;">Ambil Foto</button>
            <canvas id="canvas" style="display:none;"></canvas>

            <!-- preview hasil kamera -->
            <div id="camera-preview-container" style="margin-top:10px;"></div>
          </div>

          <div>
            <label>Lokasi:</label>
            <p id="selected-coords">Klik di peta untuk memilih lokasi</p>
            <input type="hidden" id="lat" name="lat" />
            <input type="hidden" id="lon" name="lon" />
          </div>

          <div id="map" style="height: 300px; margin-block: 20px;"></div>

          <button type="submit">Kirim Cerita</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    // === MAP ===
    const map = L.map('map').setView([-2.5, 118], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    let marker;
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      document.querySelector('#lat').value = lat;
      document.querySelector('#lon').value = lng;
      document.querySelector('#selected-coords').textContent = `Lat: ${lat}, Lon: ${lng}`;

      if (marker) marker.remove();
      marker = L.marker([lat, lng]).addTo(map);
    });

    // === CAMERA ===
    let stream = null;
    let photoBlob = null;
    const openCameraButton = document.querySelector('#open-camera');
    const stopCameraButton = document.querySelector('#stop-camera');
    const captureButton = document.querySelector('#capture');
    const resetButton = document.querySelector('#reset-media');
    const inputFile = document.querySelector('#photo');
    const video = document.querySelector('#video');
    const canvas = document.querySelector('#canvas');
    const previewContainer = document.querySelector('#camera-preview-container');
    const form = document.querySelector('#story-form');

    openCameraButton.addEventListener('click', async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.style.display = 'block';
        captureButton.style.display = 'inline-block';
        stopCameraButton.style.display = 'inline-block';
      } catch (err) {
        Swal.fire('Oops!', 'Gagal mengakses kamera', 'error');
        console.error(err);
      }
    });

    stopCameraButton.addEventListener('click', () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      video.srcObject = null;
      video.style.display = 'none';
      captureButton.style.display = 'none';
      stopCameraButton.style.display = 'none';
      Swal.fire('Info', 'Kamera dimatikan', 'info');
    });

    captureButton.addEventListener('click', () => {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);

      canvas.toBlob((blob) => {
        photoBlob = blob;

        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
        video.srcObject = null;
        video.style.display = 'none';
        captureButton.style.display = 'none';
        stopCameraButton.style.display = 'none';

        Swal.fire('Sukses!', 'Foto berhasil diambil', 'success');

        // === tampilkan preview hasil kamera ===
        previewContainer.innerHTML = '';
        const preview = document.createElement('img');
        preview.src = URL.createObjectURL(photoBlob);
        preview.alt = 'Foto dari kamera';
        preview.style.maxWidth = '150px';
        preview.style.marginTop = '10px';
        previewContainer.appendChild(preview);

        // tampilkan tombol reset
        resetButton.classList.remove('hidden');
        openCameraButton.classList.add('hidden');
      }, 'image/jpeg');
    });

    // Jika user pilih file manual
    inputFile.addEventListener('change', () => {
      if (inputFile.files.length > 0) {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          video.srcObject = null;
        }
        video.style.display = 'none';
        captureButton.style.display = 'none';
        openCameraButton.classList.add('hidden');
        resetButton.classList.remove('hidden');

        // hapus preview kamera
        previewContainer.innerHTML = '';
      }
    });

    // === FORM SUBMIT ===
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const description = form.description.value;
      const lat = form.lat.value;
      const lon = form.lon.value;

      const formData = new FormData();
      formData.append('description', description);
      formData.append('lat', lat);
      formData.append('lon', lon);

      if (photoBlob) {
        formData.append('photo', photoBlob, 'photo.jpg');
      } else {
        const photo = form.photo.files[0];
        if (photo) {
          formData.append('photo', photo);
        }
      }

      Swal.fire({
        title: 'Mengirim cerita...',
        text: 'Mohon tunggu sebentar',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const result = await response.json();

        if (!result.error) {
          Swal.fire('Sukses!', result.message, 'success').then(() => {
            location.hash = '#/';
          });
        } else {
          Swal.fire('Oops!', result.message, 'error');
        }
      } catch (error) {
        console.error(error);
        Swal.fire('Oops!', 'Gagal mengirim data', 'error');
      }
    });

    // Reset media
    resetButton.addEventListener('click', () => {
      inputFile.value = '';
      inputFile.classList.remove('hidden');

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        stream = null;
      }

      video.srcObject = null;
      video.style.display = 'none';
      captureButton.style.display = 'none';
      stopCameraButton.style.display = 'none';
      openCameraButton.classList.remove('hidden');

      photoBlob = null;
      resetButton.classList.add('hidden');

      // hapus preview kamera
      previewContainer.innerHTML = '';
    });
  }
}

export default AddStoryPage;
