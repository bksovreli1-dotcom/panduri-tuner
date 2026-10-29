(() => {
  const status = document.getElementById('offline-status');
  if (!('serviceWorker' in navigator) || !window.isSecureContext) {
    status.textContent = 'ოფლაინ შენახვა ამ ბრაუზერში მიუწვდომელია.';
    return;
  }
  navigator.serviceWorker.register('./sw.js').then(() => navigator.serviceWorker.ready).then(() => {
    status.textContent = '✓ ოფლაინ მზადაა — ტუნერი, აკორდები და სიმღერები ამ ბრაუზერში შენახულია. წყაროების ბმულებს ინტერნეტი სჭირდება.';
  }).catch(() => {
    status.textContent = 'ოფლაინ შენახვა ვერ დასრულდა. სცადე გვერდის განახლება ინტერნეტთან კავშირისას.';
  });
})();
