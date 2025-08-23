document.querySelector('select[name="ciudades"]').addEventListener('change', function(e) {
  const selectedCities = Array.from(e.target.selectedOptions);
  const detailsContainer = document.getElementById('ciudades-detalles');
  
  detailsContainer.innerHTML = '';
  detailsContainer.style.display = selectedCities.length ? 'block' : 'none';

  selectedCities.forEach((option, index) => {
    const cityId = option.value;
    const cityName = option.text;
    
    detailsContainer.innerHTML += `
      <div class="city-detail">
        <h4>${cityName}</h4>
        <label>
          <input type="checkbox" name="ciudad_principal_${cityId}" value="true">
          ¿Destino principal?
        </label>
        <label>
          Orden de visita:
          <input type="number" name="orden_visita_${cityId}" value="${index + 1}" min="1">
        </label>
      </div>
    `;
  });
});