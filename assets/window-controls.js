const win = require('@electron/remote').getCurrentWindow(); /* Note this is different to the html global `window` variable */
const { dialog } = require('@electron/remote');

function handleWindowControls() {
  // Make minimise/maximise/restore/close buttons work when they are clicked
  document.getElementById('min-button').addEventListener('click', () => {
    win.minimize();
  });

  document.getElementById('max-button').addEventListener('click', () => {
    win.maximize();
    // console.log(win.isMaximized());
  });

  document.getElementById('restore-button').addEventListener('click', () => {
    win.unmaximize();
  });

  document.getElementById('close-button').addEventListener('click', (e) => {
    // eslint-disable-next-line promise/catch-or-return
    dialog
      .showMessageBox(win, {
        message: 'Anda yakin untuk keluar?',
        type: 'question',
        buttons: ['Tidak', 'Ya'],
        defaultId: 1,
        title: 'Konfirmasi',
        detail:
          'Pastikan anda sudah menyimpan semua pekerjaan anda sebelum ditutup!',
      })
      .then((res) => (res.response === 1 ? win.close() : e.preventDefault()));
    // win.close();
  });

  function toggleMaxRestoreButtons() {
    if (win.isMaximized()) {
      document.body.classList.add('maximized');
    } else {
      document.body.classList.remove('maximized');
    }
  }

  // Toggle maximise/restore buttons when maximisation/unmaximisation occurs
  toggleMaxRestoreButtons();
  win.on('maximize', toggleMaxRestoreButtons);
  win.on('unmaximize', toggleMaxRestoreButtons);
}

// When document has loaded, initialise
document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    handleWindowControls();
  }
};

window.onbeforeunload = () => {
  /* If window is reloaded, remove win event listeners
    (DOM element listeners get auto garbage collected but not
    Electron win listeners as the win is not dereferenced unless closed) */
  win.removeAllListeners();
};
