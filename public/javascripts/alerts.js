function showSuccess(message) {
  Swal.fire({
    icon: 'success',
    title: message,
    timer: 3000,
    showConfirmButton: false
  });
}

function showError(message) {
  Swal.fire({
    icon: 'error',
    title: message,
    timer: 3500,
    showConfirmButton: true
  });
}
