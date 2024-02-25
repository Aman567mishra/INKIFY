    const canvas = document.getElementById('signatureCanvas');
    const context = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // Calculate touch position relative to the canvas
    function getTouchPos(canvas, e) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    }

    // Event listeners for drawing
    canvas.addEventListener('mousedown', (e) => {
      isDrawing = true;
      const pos = { x: e.offsetX, y: e.offsetY };
      [lastX, lastY] = [pos.x, pos.y];
    });
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);

    canvas.addEventListener('touchstart', (e) => {
      isDrawing = true;
      const pos = getTouchPos(canvas, e);
      [lastX, lastY] = [pos.x, pos.y];
    });
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const pos = getTouchPos(canvas, e);
      drawTouch(pos.x, pos.y);
    });
    canvas.addEventListener('touchend', () => isDrawing = false);

    // Drawing function for mouse
    function draw(e) {
      if (!isDrawing) return;
      const pos = { x: e.offsetX, y: e.offsetY };
      drawLine(lastX, lastY, pos.x, pos.y);
      [lastX, lastY] = [pos.x, pos.y];
    }

    // Drawing function for touch
    function drawTouch(x, y) {
      if (!isDrawing) return;
      drawLine(lastX, lastY, x, y);
      [lastX, lastY] = [x, y];
    }

    // Drawing helper function
    function drawLine(x1, y1, x2, y2) {
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.strokeStyle = document.getElementById('colorPicker').value; // Set color from color picker
      context.lineWidth = document.getElementById('lineWidthSlider').value; // Set line width from slider
      context.lineCap = 'round'; // Set line cap
      context.lineJoin = 'round'; // Set line join
      context.stroke();
    }

    // Clear canvas
    function clearCanvas() {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Convert and download signature
    function convertAndDownload() {
      const format = document.getElementById('formatSelect').value;
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/' + format);
      link.download = 'signature.' + format;
      link.click();
    }

    // Convert and download signature
function convertAndDownload() {
  const format = document.getElementById('formatSelect').value;
  if (format === 'jpg') {
    // Create a temporary canvas to draw the signature with a white background
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempContext = tempCanvas.getContext('2d');

    // Fill the temporary canvas with white background
    tempContext.fillStyle = '#fff';
    tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Draw the signature onto the temporary canvas
    tempContext.drawImage(canvas, 0, 0);

    // Trigger download for the temporary canvas as a JPG image
    const link = document.createElement('a');
    link.href = tempCanvas.toDataURL('image/jpeg');
    link.download = 'signature.jpg';
    link.click();
  } else {
    // For PNG format, directly download the signature from the original canvas
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'signature.png';
    link.click();
  }
}
