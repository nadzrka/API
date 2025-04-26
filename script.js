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
        <h4>${profiles[i].judul}</h4>
        <p>${profiles[i].isi}</p>
        <button class="btn edit-btn">Edit</button>
      `;
    } else {
      note.innerHTML = `
        <h4>Belum Ada</h4>
        <p>😺 Kosong nih</p>
        <button class="btn edit-btn">Edit</button>
      `;
    }

    stickyWrapper.appendChild(note);
    const editBtn = note.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => editStickyNote(note, profiles[i] ? profiles[i].id : null));
  }
}

function editStickyNote(note, profileId) {
    const currentTitle = note.querySelector('h4').textContent;
    const currentContent = note.querySelector('p').textContent;
    const originalTitle = currentTitle; // Store the original title
    const originalContent = currentContent; // Store the original content

    // Make both fields editable
    note.innerHTML = `
      <h4>Edit Profile</h4>
      <label for="judul">Judul:</label>
      <textarea id="judul">${currentTitle}</textarea>
      <label for="isi">Isi:</label>
      <textarea id="isi">${currentContent}</textarea>
      <button class="editbtn save-btn">Save</button>
      <button class="editbtn cancel-btn">Cancel</button>
    `;

    const saveBtn = note.querySelector('.save-btn');
    const cancelBtn = note.querySelector('.cancel-btn');

    saveBtn.addEventListener('click', () => {
      const updatedTitle = note.querySelector('#judul').value;
      const updatedContent = note.querySelector('#isi').value;

      console.log('Saving...', { updatedTitle, updatedContent, profileId });  // Debugging log

      const method = profileId ? 'PUT' : 'POST';
      const url = profileId ? `https://nadziraka.glitch.me/profile/${profileId}` : 'https://nadziraka.glitch.me/profile';

      fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: profileId || Date.now(),  // If no profileId, generate a new ID
          judul: updatedTitle,
          isi: updatedContent,
        }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to save data');
        }
        return response.json();
      })
      .then(() => {
        // After saving, update the note content without reloading everything
        note.innerHTML = `
          <h4>${updatedTitle}</h4>
          <p>${updatedContent}</p>
          <button class="btn edit-btn">Edit</button>
        `;
        const editBtn = note.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => editStickyNote(note, profileId || null));
      })
      .catch(error => {
        console.error('Error saving note:', error);
        alert('Failed to save note');
      });
    });

    cancelBtn.addEventListener('click', () => {
      // Revert to the original content when canceling
      note.innerHTML = `
        <h4>${originalTitle}</h4>
        <p>${originalContent}</p>
        <button class="btn edit-btn">Edit</button>
      `;
      const editBtn = note.querySelector('.edit-btn');
      editBtn.addEventListener('click', () => editStickyNote(note, profileId || null));
    });
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
