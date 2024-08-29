document.addEventListener('DOMContentLoaded', function () {
    // Variables
    const selectedImage = document.getElementById('selectedImage');
    const brightnessRange = document.getElementById('brightnessRange');
    const bulbs = document.querySelectorAll('.bulb');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const resetButton = document.getElementById('resetButton');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    const colorPicker = document.getElementById('colorPicker');
    const toggleButton = document.getElementById('toggleButton'); // Botón de encendido/apagado}

    let bulbsOn = false; // Estado inicial de las bombillas
    let currentIndex = 0;
    let currentHue = 0; // Variable global para almacenar el tono seleccionado

    // Desactivar control de brillo inicialmente
    brightnessRange.disabled = true;

    // Inicialización
    function initialize() {
        setupThumbnailClick();
        setupBrightnessControl();
        setupColorControl();
        setupResetButton();
        setupNavigationButtons();
        setupToggleButton();
        updateImage(currentIndex); // Llama a updateImage al inicializar
        updateBulbState();
    }

    // Función para manejar el clic en las miniaturas
    function setupThumbnailClick() {
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', function () {
                updateImage(index);
            });
        });
    }

    // Función para actualizar la imagen seleccionada
    function updateImage(index) {
        currentIndex = index;
        selectedImage.src = thumbnails[currentIndex].src;
        thumbnails.forEach(thumb => thumb.classList.remove('selected'));
        thumbnails[currentIndex].classList.add('selected');
    
        // Actualizar la clase de la image-container en función de la imagen seleccionada
        const imageName = thumbnails[currentIndex].src.match(/foto_\d+/)[0]; // Extraer el nombre de la imagen
        const imageContainer = document.querySelector('.image-container');
        
        // Limpiar todas las clases relacionadas con imágenes previas
        imageContainer.classList.remove('foto_1', 'foto_2', 'foto_3', 'foto_4');
        
        // Agregar la nueva clase correspondiente
        imageContainer.classList.add(imageName);
    }
    

    // Función para manejar el control de brillo
    function setupBrightnessControl() {
        brightnessRange.addEventListener('input', function () {
            if (bulbsOn) {
                const brightness = parseFloat(this.value);
                updateBrightness(brightness);
            }
        });
    }

    // Actualizar brillo de bombillas y de imagen seleccionada
    function updateBrightness(brightness) {
        const scaleValue = 1 + (brightness - 1) * 8;
        const imagescaleValue = 1 + (brightness - 1)* 0.5;
        selectedImage.style.filter = `brightness(${imagescaleValue}) hue-rotate(${currentHue}deg)`;

        bulbs.forEach(bulb => {
            bulb.style.filter = `brightness(${brightness})`;
            bulb.style.transform = `scale(${scaleValue})`;
        });
    }

    // Función para manejar el control de color
    function setupColorControl() {
        colorPicker.addEventListener('input', function () {
            currentHue = getHueRotation(colorPicker.value);
            updateFilters();
        });
    }

    // Actualizar filtros de imagen
    function updateFilters() {
        const brightness = parseFloat(brightnessRange.value);
        selectedImage.style.filter = `sepia(1) saturate(2) brightness(${brightness}) hue-rotate(${currentHue}deg)`;
    }
    

    // Obtener rotación de tono basado en color hexadecimal
    function getHueRotation(hexColor) {
        const r = parseInt(hexColor.substring(1, 3), 16);
        const g = parseInt(hexColor.substring(3, 5), 16);
        const b = parseInt(hexColor.substring(5, 7), 16);
        return (Math.atan2(1.732 * (g - b), 2 * r - g - b) * 180 / Math.PI + 360) % 360;
    }

    // Función para manejar el botón de restablecimiento
    function setupResetButton() {
        resetButton.addEventListener('click', function () {
            resetImageAndBulbs();
        });
    }

    // Restablecer imagen y bombillas al valor inicial
    function resetImageAndBulbs() {
        brightnessRange.value = 1;
        colorPicker.value = '#FFFFFF';
        currentHue = getHueRotation(colorPicker.value);
        updateFilters();
        resetAll();
        bulbsOn = false;
        updateBulbState();
    }
    

    // Función para manejar los botones de navegación
    function setupNavigationButtons() {
        leftArrow.addEventListener('click', function () {
            navigateLeft();
        });

        rightArrow.addEventListener('click', function () {
            navigateRight();
        });
    }

    // Navegar a la imagen anterior
    function navigateLeft() {
        currentIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
        updateImage(currentIndex);
    }

    // Navegar a la imagen siguiente
    function navigateRight() {
        currentIndex = (currentIndex + 1) % thumbnails.length;
        updateImage(currentIndex);
    }

    // Función para manejar el botón de encendido/apagado
    function setupToggleButton() {
        toggleButton.addEventListener('click', function () {
            bulbsOn = !bulbsOn;
            updateBulbState();
        });
    }

    // Actualizar el estado de las bombillas
    function updateBulbState() {
        toggleButton.classList.toggle('active', bulbsOn);
        bulbs.forEach(bulb => {
            bulb.style.display = bulbsOn ? 'block' : 'none';
        });
        brightnessRange.disabled = !bulbsOn;
    
        if (!bulbsOn) {
            resetAll(); // Solo restablecer brillo y tamaño cuando las bombillas se apagan
        }
    }

    // Función para restablecer todo (imagen y bombillas)
    function resetAll() {
        brightnessRange.value = 1;
        updateBrightness(1); // Restablecer brillo y tamaño a su estado inicial
        selectedImage.style.filter = `brightness(1) hue-rotate(${currentHue}deg)`; // Mantener el tono
        bulbs.forEach(bulb => {
            bulb.style.filter = `brightness(1)`;
            bulb.style.transform = `scale(1)`;
        });
    }

    // Ejecutar la inicialización al cargar el DOM
    initialize();
});
