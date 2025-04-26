const loadBtn = document.getElementById('loadProfileBtn');
const profileContainer = document.getElementById('profile-container');
const loading = document.getElementById('loading');
const container = document.querySelector('.container');
const stickyWrapper = document.getElementById('sticky-wrapper');

loadBtn.addEventListener('click', () => {
  loading.style.display = 'block';
  loadBtn.style.display = 'none';

  fetch('https://nadziraka.glitch.me/profile')
    .then(response => {
      if (!response.ok) throw new Error('Gagal fetch');
      return response.json();
    })
    .then(data => {
      loading.style.display = 'none';

      profileContainer.innerHTML = ''; 
      const card = document.createElement('div');
      card.classList.add('profile-card');

      card.innerHTML = `
        <h3>Nadzira Karimantika Atsarirahmati</h3>
        <p>NIM: L0122118</p>
      `;
      profileContainer.appendChild(card);          

      updateStickyNotes(data); // <-- dipanggil di sini supaya sticky notes selalu update

      if (!document.getElementById('closeProfileBtn')) {
        const closeBtn = document.createElement('button');
        closeBtn.id = 'closeProfileBtn';
        closeBtn.className = 'btn';
        closeBtn.textContent = 'Tutup Profil';
        container.appendChild(closeBtn);

        closeBtn.addEventListener('click', () => {
          profileContainer.innerHTML = '';
          closeBtn.remove();
          loadBtn.style.display = 'inline-block';
        });
      }
    })
    .catch(error => {
      console.error('Gagal mengambil data:', error);
      loading.textContent = 'Gagal memuat data.';
      loadBtn.style.display = 'inline-block';
    });
});

function updateStickyNotes(profiles) {
  stickyWrapper.innerHTML = ''; // Bersihkan dulu

  const colors = ['yellow', 'pink', 'blue', 'green', 'purple', 'orange'];
  const jumlahNotes = 6;

  for (let i = 0; i < jumlahNotes; i++) {
    const note = document.createElement('div');
    note.className = `sticky-note ${colors[i % colors.length]}`;

    if (profiles[i]) {
      note.innerHTML = `
        <h4>${profiles[i].nama}</h4>
        <p>${profiles[i].nim}</p>
      `;
    } else {
      note.innerHTML = `
        <h4>Belum Ada</h4>
        <p>😺 Kosong nih</p>
      `;
    }

    stickyWrapper.appendChild(note);
  }
}

// Auto-load sticky notes when page loads
fetch('https://nadziraka.glitch.me/profile')
  .then(response => {
    if (!response.ok) throw new Error('Gagal fetch');
    return response.json();
  })
  .then(data => {
    updateStickyNotes(data);
  })
  .catch(error => {
    console.error('Gagal mengambil data untuk sticky notes:', error);
  });
