// ============================================================
// EcoHabitat - Google Apps Script
// Integración con Google Sheets para la gestión de almacenes
// ============================================================
// INSTRUCCIONES:
// 1. Crea una Google Sheet con el ID que copies desde la URL
// 2. Ve a Extensiones → Apps Script
// 3. Pega este código y guarda
// 4. Despliega → Nueva implementación → Web App
//    - Ejecutar como: Yo
//    - Quién tiene acceso: Cualquier persona
// 5. Copia la URL del Web App y pégala en la config de la app
// ============================================================

const SHEET_ID = 'REEMPLAZA_CON_TU_ID_DE_GOOGLE_SHEET';

// ============================================================
// PUNTO DE ENTRADA POST (sincronización desde la app)
// ============================================================
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);

    if (data.action === 'sync') {
      const sheetName = capitalizar(data.tipo);
      let sheet = ss.getSheetByName(sheetName);
      if (!sheet) sheet = ss.insertSheet(sheetName);
      sheet.clearContents();

      if (data.tipo === 'inventario') {
        // Cabecera
        sheet.appendRow(['Item', 'Zarza la Mayor', 'Plasencia', 'Total', 'Activo', 'Fecha Actualización']);
        // Datos
        data.datos.forEach(d => {
          sheet.appendRow([
            d.item,
            d.zarza || 0,
            d.plasencia || 0,
            (d.zarza || 0) + (d.plasencia || 0),
            d.activo !== false ? 'Sí' : 'No',
            d.fechaActualizacion ? formatearFecha(d.fechaActualizacion) : ''
          ]);
        });
        // Formato cabecera
        formatearCabecera(sheet, 6);

      } else if (data.tipo === 'maquinaria') {
        sheet.appendRow(['Categoría', 'Número', 'Marca / Equipo', 'Nº Serie / Matrícula', 'Estado', 'Observación Baja', 'Fecha Alta']);
        data.datos.forEach(d => {
          sheet.appendRow([
            d.categoria,
            d.numero,
            d.marca,
            d.serie || '',
            d.baja === 'Sí' ? 'BAJA' : 'Activa',
            d.obs_baja || '',
            d.fechaAlta ? formatearFecha(d.fechaAlta) : ''
          ]);
        });
        formatearCabecera(sheet, 7);
        // Colorear bajas en rojo
        const rows = sheet.getDataRange().getValues();
        rows.forEach((row, i) => {
          if (row[4] === 'BAJA') {
            sheet.getRange(i + 1, 1, 1, 7).setBackground('#fde8e8').setFontColor('#c0392b');
          }
        });

      } else if (data.tipo === 'mantenimiento') {
        sheet.appendRow(['Fecha', 'Máquina', 'Categoría', 'Tipo Mantenimiento', 'Tareas Realizadas', 'Técnico', 'Almacén', 'Observaciones']);
        data.datos.forEach(d => {
          sheet.appendRow([
            d.fecha || '',
            d.maquina || '',
            d.categoria || '',
            d.tipo || '',
            Array.isArray(d.tareas) ? d.tareas.join('; ') : '',
            d.tecnico || '',
            d.almacen || '',
            d.observaciones || ''
          ]);
        });
        formatearCabecera(sheet, 8);
        // Colorear por tipo
        const tipoColores = {
          'Diario': '#d4f0d9',
          'Semanal/Quincenal': '#fef5e3',
          'Mensual': '#fde8e3',
          'Por uso': '#e3ecff'
        };
        const rows2 = sheet.getDataRange().getValues();
        rows2.forEach((row, i) => {
          if (i === 0) return; // skip header
          const color = tipoColores[row[3]] || '#ffffff';
          sheet.getRange(i + 1, 1, 1, 8).setBackground(color);
        });
      }

      // Auto-ajustar columnas
      sheet.autoResizeColumns(1, sheet.getLastColumn());

      return jsonResponse({ ok: true, message: `${sheetName} sincronizado: ${data.datos.length} registros` });
    }

    return jsonResponse({ ok: false, error: 'Acción no reconocida' });

  } catch (err) {
    Logger.log('Error en doPost: ' + err.toString());
    return jsonResponse({ ok: false, error: err.toString() });
  }
}

// ============================================================
// PUNTO DE ENTRADA GET (ping y lectura)
// ============================================================
function doGet(e) {
  try {
    const action = e.parameter.action || '';

    if (action === 'ping') {
      return jsonResponse({ ok: true, message: 'EcoHabitat Apps Script activo', timestamp: new Date().toISOString() });
    }

    if (action === 'read') {
      const tipo = e.parameter.tipo || 'inventario';
      const ss = SpreadsheetApp.openById(SHEET_ID);
      const sheet = ss.getSheetByName(capitalizar(tipo));
      if (!sheet) return jsonResponse({ ok: false, error: 'Hoja no encontrada' });
      const data = sheet.getDataRange().getValues();
      return jsonResponse({ ok: true, data });
    }

    return jsonResponse({ ok: true, message: 'API EcoHabitat v1.0' });

  } catch (err) {
    return jsonResponse({ ok: false, error: err.toString() });
  }
}

// ============================================================
// HELPERS
// ============================================================
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function capitalizar(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatearFecha(isoStr) {
  try {
    const d = new Date(isoStr);
    return Utilities.formatDate(d, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
  } catch (e) {
    return isoStr || '';
  }
}

function formatearCabecera(sheet, numCols) {
  const headerRange = sheet.getRange(1, 1, 1, numCols);
  headerRange.setBackground('#1e3d2f');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setFontFamily('Arial');
  headerRange.setFontSize(11);
}

// ============================================================
// FUNCIÓN DE PRUEBA (ejecutar manualmente para verificar)
// ============================================================
function testConexion() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  Logger.log('Conectado a: ' + ss.getName());
  Logger.log('Hojas: ' + ss.getSheets().map(s => s.getName()).join(', '));
}
