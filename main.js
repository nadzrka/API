// Ganti dengan URL API Glitch Anda
const apiUrl = 'https://nama-proyek-anda.glitch.me/profile';

async function fetchProfiles() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const profiles = await response.json();
    displayProfiles(profiles);
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    document.getElementById('profiles').textContent = 'Gagal memuat data.';
  }
}

function displayProfiles(profiles) {
  const profilesDiv = document.getElementById('profiles');
  profilesDiv.innerHTML = ''; // Bersihkan pesan "Memuat data..."

  if (profiles.length === 0) {
    profilesDiv.textContent = 'Tidak ada profil yang tersedia.';
    return;
  }

  profiles.forEach(profile => {
    const profileElement = document.createElement('div');
    profileElement.textContent = `${profile.name} - ${profile.email}`;
    profilesDiv.appendChild(profileElement);
  });
}

// Panggil fungsi untuk memuat data saat halaman dimuat
document.addEventListener('DOMContentLoaded', fetchProfiles);
