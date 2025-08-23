document.querySelector('input[name="imagenes"]').addEventListener('change', function(e) {
  const portadaContainer = document.getElementById('portada-container');
  const portadaOptions = document.getElementById('portada-options');
  const portadaInput = document.getElementById('imagenPortadaInput');
  
  portadaOptions.innerHTML = '';
  
  if (this.files.length > 0) {
    portadaContainer.style.display = 'block';
    
    // Crear opciones para cada imagen
    Array.from(this.files).forEach((file, index) => {
      const div = document.createElement('div');
      div.innerHTML = `
        <label>
          <input type="radio" name="portadaRadio" value="${index}" ${index === 0 ? 'checked' : ''}>
          ${file.name} ${index === 0 ? '(Portada por defecto)' : ''}
        </label>
      `;
      portadaOptions.appendChild(div);
    });
    
    // Establecer la primera imagen como portada por defecto
    portadaInput.value = '0';
    
    // Actualizar cuando cambie la selección
    document.querySelectorAll('input[name="portadaRadio"]').forEach(radio => {
      radio.addEventListener('change', function() {
        portadaInput.value = this.value;
      });
    });
    
  } else {
    portadaContainer.style.display = 'none';
    portadaInput.value = '0';
  }
});