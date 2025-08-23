  document.querySelector('select[name="ciudades"]').addEventListener('change', function() {
    const selectedOptions = Array.from(this.selectedOptions).map(option => option.value);
    const detallesContainer = document.getElementById('ciudades-detalles');
    detallesContainer.innerHTML = ''; // Limpiar detalles anteriores

    selectedOptions.forEach(ciudadId => {
      const detalleDiv = document.createElement('div');
      detalleDiv.classList.add('form-group');
      detalleDiv.innerHTML = `
        <h4>Detalles para la ciudad ID: ${ciudadId}</h4>
        <label>Días en la ciudad:</label>
        <input type="number" name="dias_ciudad_${ciudadId}" required>
        <label>Actividades (separadas por comas):</label>
        <input type="text" name="actividades_ciudad_${ciudadId}" required>
      `;
      detallesContainer.appendChild(detalleDiv);
    });

    detallesContainer.style.display = selectedOptions.length ? 'block' : 'none';
  });