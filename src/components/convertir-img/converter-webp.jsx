// ===== POLYFILLS NECESARIOS =====
(function () {
  if (!HTMLCanvasElement.prototype.toBlob) {
    HTMLCanvasElement.prototype.toBlob = function (callback, type, quality) {
      const dataURL = this.toDataURL(type, quality);
      const binStr = atob(dataURL.split(',')[1]);
      const arr = Uint8Array.from(binStr, ch => ch.charCodeAt(0));
      callback(new Blob([arr], { type: type || 'image/png' }));
    };
  }
})();

// ===== DETECCIÓN DE CAPACIDADES =====
let _webPSupported = null;
const _isLegacyIOS = /iP(hone|od|ad).+OS (10|9|8|7)/.test(navigator.userAgent);

function _checkWebPSupport() {
  return new Promise((resolve) => {
    if (_webPSupported !== null) return resolve(_webPSupported);

    const img = new Image();
    img.onload = () => {
      _webPSupported = img.width > 0 && img.height > 0;
      resolve(_webPSupported);
    };
    img.onerror = () => {
      _webPSupported = false;
      resolve(false);
    };
    img.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
  });
}

// ===== FUNCIÓN PRINCIPAL =====
export async function optimizarFormDataConWebP(formDataOriginal) {
  await _checkWebPSupport();
  const formDataOptimizado = new FormData();
  const camposDeImagen = ["imagenes", "imagen"];

  _copiarCamposNoImagenes(formDataOriginal, formDataOptimizado, camposDeImagen);
  await _procesarImagenes(formDataOriginal, formDataOptimizado, camposDeImagen);

  return formDataOptimizado;
}

// ===== FUNCIONES AUXILIARES =====
function _copiarCamposNoImagenes(original, optimizado, camposImagen) {
  if (typeof original.entries !== 'function') {
    for (const key in original) {
      if (original.hasOwnProperty(key) && !camposImagen.includes(key)) {
        optimizado.append(key, original.get(key));
      }
    }
    return;
  }

  for (const [clave, valor] of original.entries()) {
    if (!camposImagen.includes(clave)) {
      optimizado.append(clave, valor);
    }
  }
}

async function _procesarImagenes(original, optimizado, camposImagen) {
  for (const campo of camposImagen) {
    if (!original.has(campo)) continue;

    const archivos = original.getAll(campo).filter(Boolean);
    if (archivos.length === 0) continue;

    const convertidos = await Promise.all(
      archivos.map(_convertirImagenAWebPConFallback)
    );

    convertidos.forEach((archivo) => {
      if (archivo instanceof File) {
        optimizado.append(campo, archivo);
      }
    });
  }
}

async function _convertirImagenAWebPConFallback(archivo) {
  if (!archivo.type.startsWith('image/')) return archivo;

  try {
    const imagen = await _cargarImagen(archivo);
    const { ancho, alto } = _calcularDimensionesOptimizadas(imagen.naturalWidth, imagen.naturalHeight);

    const canvas = document.createElement('canvas');
    canvas.width = ancho;
    canvas.height = alto;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(imagen, 0, 0, ancho, alto);

    const tipoFinal = _isLegacyIOS || !_webPSupported ? 'image/jpeg' : 'image/webp';
    const nombreFinal = _generarNombreConExtension(archivo.name, tipoFinal === 'image/webp' ? 'webp' : 'jpeg');

    let blob;
    if (tipoFinal === 'image/webp') {
      blob = await _generarWebPConCalidadAdaptativa(canvas);
      if (!blob) throw new Error("Fallo en compresión WebP");
    } else {
      blob = await _canvasToJpegConTamañoLimitado(canvas, 0.75);
    }

    return new File([blob], nombreFinal, {
      type: tipoFinal,
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error('Error al convertir imagen:', archivo.name, error);
    _debug(`Error en ${archivo.name}: ${error.message}`);
    return archivo;
  }
}

async function _generarWebPConCalidadAdaptativa(canvas) {
  let blob = await _canvasToWebP(canvas, 0.75);
  if (!blob || blob.size > 500 * 1024) {
    blob = await _canvasToWebP(canvas, 0.5);
  }
  return blob;
}

function _canvasToWebP(canvas, calidad) {
  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob), 'image/webp', calidad);
  });
}

async function _canvasToJpegConTamañoLimitado(canvas, calidadInicial) {
  let calidad = calidadInicial;
  let blob = await _canvasToJpeg(canvas, calidad);

  while (blob && blob.size > 500 * 1024 && calidad > 0.05) {
    calidad -= 0.05;
    blob = await _canvasToJpeg(canvas, calidad);
  }

  return blob;
}

function _canvasToJpeg(canvas, calidad) {
  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob), 'image/jpeg', calidad);
  });
}

function _calcularDimensionesOptimizadas(anchoOriginal, altoOriginal) {
  const ladoMayor = Math.max(anchoOriginal, altoOriginal);
  const ladoMayorObjetivo = ladoMayor > 2048 ? 2048 : (ladoMayor > 1080 ? 1080 : 720);
  const escala = ladoMayorObjetivo / ladoMayor;
  return {
    ancho: Math.round(anchoOriginal * escala),
    alto: Math.round(altoOriginal * escala),
  };
}

function _generarNombreConExtension(nombreOriginal, extension) {
  return nombreOriginal.replace(/\.[^/.]+$/, "") + '.' + extension;
}

function _cargarImagen(archivo) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Error al cargar imagen'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Error al leer archivo'));
    reader.readAsDataURL(archivo);
  });
}

function _debug(msg) {
  const el = document.getElementById('debug');
  if (el) el.innerText += `\n${msg}`;
}
