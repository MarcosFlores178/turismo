function renderCityDetails(selectElement) {
  const selectedCities = Array.from(selectElement.selectedOptions);
  const detailsContainer = document.getElementById('ciudades-detalles');

  detailsContainer.innerHTML = '';
  detailsContainer.style.display = selectedCities.length ? 'block' : 'none';

  selectedCities.forEach((option, index) => {
    const cityId = option.value;
    const cityName = option.text;

    detailsContainer.innerHTML += `
      <div class="city-detail mb-2 p-2 border rounded">
        <h5>${cityName}</h5>
        <label class="d-block">
          <input type="radio" name="es_destino_principal" value="${cityId}">
          ¿Destino principal?
        </label>
        <label class="d-block">
          Orden de visita:
          <input type="number" name="orden_visita_${cityId}" value="${index + 1}" min="1">
        </label>
      </div>
    `;
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const selectCiudades = document.querySelector('#ciudades');

  if (selectCiudades) {
    // Render inicial con las ciudades que ya vienen seleccionadas
    renderCityDetails(selectCiudades);

    // Actualizar cada vez que cambia la selección
    selectCiudades.addEventListener('change', function (e) {
      renderCityDetails(e.target);
    });
  }
});
