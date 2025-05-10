/**
 * Form Validation Automation Script
 * 
 * Este script automatiza la prueba de validación del formulario:
 * 1. Navega a create.php
 * 2. Intenta enviar el formulario sin completar campos obligatorios
 * 3. Verifica que aparezcan los mensajes de validación
 * 4. Prueba cada campo obligatorio individualmente
 */

const path = require('path');
require('dotenv').config();
const { initBrowser, navigateTo, takeScreenshot, closeBrowser, withTimeout } = require('./utils');

async function testFormValidation() {
  let browser;
  
  try {
    // Inicializar navegador y página
    const { browser: browserInstance, page } = await initBrowser();
    browser = browserInstance;
    
    console.log('Iniciando automatización de prueba de validación de formulario...');
    
    // Agregar manejador de errores para la página
    page.on('error', err => {
      console.error('Error de página:', err);
    });
    
    // Agregar listener para mensajes de JavaScript en la página (console.log, alerts, etc.)
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        console.log(`${msg.type().toUpperCase()}: ${msg.text()}`);
      }
    });
    
    // Manejar diálogos (alert, confirm, prompt)
    page.on('dialog', async dialog => {
      console.log(`ALERTA: ${dialog.message()}`);
      await dialog.dismiss();
    });
    
    // Navegar a la página de creación de producto
    await withTimeout(
      async () => await navigateTo(page, 'products/create.php'),
      10000,
      'Navegación a create.php'
    );
    
    // Tomar captura de pantalla del formulario vacío
    await withTimeout(
      async () => await takeScreenshot(page, 'validation_form_empty'),
      5000,
      'Captura de formulario vacío'
    );
    
    console.log('Prueba 1: Enviar formulario completamente vacío');
    
    // Intentar enviar el formulario sin completar ningún campo
    await withTimeout(
      async () => {
        // Click en el botón de guardar
        await page.click('.btn.btn-success').catch(async (err) => {
          console.log('Error al hacer click en botón principal. Probando botones alternativos...');
          
          // Probar selectores de botón alternativos
          const buttonSelectors = [
            'button[type="submit"]',
            'input[type="submit"]',
            'button.btn', 
            'form .btn'
          ];
          
          for (const selector of buttonSelectors) {
            try {
              const buttonExists = await page.$(selector);
              if (buttonExists) {
                console.log(`Intentando hacer click en botón con selector: ${selector}`);
                await page.click(selector);
                break;
              }
            } catch (err) {
              // Continuar con el siguiente selector
            }
          }
        });
      },
      5000,
      'Envío de formulario vacío'
    );
    
    // Esperar para ver si hay algún mensaje de error o validación
    await page.waitForTimeout(2000);
    
    // Tomar captura después del intento de envío
    await withTimeout(
      async () => await takeScreenshot(page, 'validation_empty_submit_result'),
      5000,
      'Captura después de envío vacío'
    );
    
    // Verificar si hay mensajes de validación (en el DOM o alerts de JS)
    const validationErrors = await page.evaluate(() => {
      // Buscar mensajes de error en el DOM
      const errorElements = Array.from(document.querySelectorAll('.error, .alert-danger, .invalid-feedback, [aria-invalid="true"]'));
      const domErrors = errorElements.map(el => el.textContent.trim());
      
      // Verificar campos marcados con clases de error
      const invalidFields = Array.from(document.querySelectorAll('input:invalid, select:invalid, textarea:invalid'));
      const fieldErrors = invalidFields.map(field => field.id || field.name);
      
      return {
        domErrors,
        invalidFields: fieldErrors,
        formIsValid: document.querySelector('form').checkValidity()
      };
    });
    
    console.log('Resultados de validación para formulario vacío:');
    console.log('- Formulario válido:', validationErrors.formIsValid);
    
    if (validationErrors.domErrors.length > 0) {
      console.log('- Mensajes de error en el DOM:', validationErrors.domErrors);
    }
    
    if (validationErrors.invalidFields.length > 0) {
      console.log('- Campos inválidos:', validationErrors.invalidFields);
    }
    
    // Probar cada campo obligatorio uno por uno
    const requiredFields = [
      { id: 'name', value: '', label: 'Nombre' },
      { id: 'description', value: '', label: 'Descripción' },
      { id: 'category', value: '', label: 'Categoría' },
      { id: 'price', value: '', label: 'Precio' }
    ];
    
    const pruebasIndividuales = [];
    
    for (const field of requiredFields) {
      console.log(`\nPrueba individual para el campo: ${field.label} (${field.id})`);
      
      // Llenar todos los campos excepto el que se está probando
      await withTimeout(
        async () => {
          // Recargar la página para empezar fresco
          await page.reload({ waitUntil: 'networkidle2' });
          
          // Completar todos los campos excepto el que estamos probando
          for (const otherField of requiredFields) {
            if (otherField.id !== field.id) {
              if (otherField.id === 'category') {
                await page.select('#' + otherField.id, 'Computers');
              } else {
                await page.type('#' + otherField.id, otherField.id === 'price' ? '100' : 'Test value');
              }
            }
          }
          
          // Tomar captura antes de enviar
          await takeScreenshot(page, `validation_missing_${field.id}`);
          
          // Intentar enviar el formulario
          await page.click('.btn.btn-success').catch(async () => {
            await page.click('button[type="submit"]').catch(() => {
              console.log('No se pudo hacer click en el botón de envío');
            });
          });
          
          // Esperar para ver mensajes de validación
          await page.waitForTimeout(1000);
          
          // Tomar captura después de enviar
          await takeScreenshot(page, `validation_missing_${field.id}_result`);
          
          // Verificar resultado
          const fieldValidation = await page.evaluate((fieldId) => {
            const field = document.getElementById(fieldId);
            return {
              valid: field ? field.validity.valid : false,
              message: field && field.validationMessage ? field.validationMessage : null,
              required: field ? field.required : false
            };
          }, field.id);
          
          pruebasIndividuales.push({
            campo: field.label,
            id: field.id,
            esValido: fieldValidation.valid,
            esRequerido: fieldValidation.required,
            mensaje: fieldValidation.message
          });
          
          console.log(`- Campo ${field.label}: ${fieldValidation.valid ? 'Válido' : 'Inválido'} ${fieldValidation.required ? '(Requerido)' : ''}`);
          if (fieldValidation.message) {
            console.log(`  Mensaje: ${fieldValidation.message}`);
          }
        },
        10000,
        `Prueba de campo ${field.label}`
      );
    }
    
    // Prueba caso especial: precio negativo o cero
    console.log('\nPrueba especial: Precio con valor negativo o cero');
    await withTimeout(
      async () => {
        // Recargar página
        await page.reload({ waitUntil: 'networkidle2' });
        
        // Completar todos los campos con valores válidos
        await page.type('#name', 'Test Product');
        await page.type('#description', 'Test Description');
        await page.select('#category', 'Computers');
        
        // Precio inválido
        await page.type('#price', '-10');
        
        // Tomar captura antes de enviar
        await takeScreenshot(page, 'validation_invalid_price');
        
        // Intentar enviar
        await page.click('.btn.btn-success').catch(async () => {
          await page.click('button[type="submit"]').catch(() => {
            console.log('No se pudo hacer click en el botón de envío');
          });
        });
        
        // Esperar validaciones
        await page.waitForTimeout(1000);
        
        // Tomar captura
        await takeScreenshot(page, 'validation_invalid_price_result');
        
        // Verificar resultado
        const priceValidation = await page.evaluate(() => {
          const field = document.getElementById('price');
          return {
            valid: field ? field.validity.valid : false,
            message: field && field.validationMessage ? field.validationMessage : null
          };
        });
        
        console.log(`- Precio inválido: ${priceValidation.valid ? 'Aceptado' : 'Rechazado'}`);
        if (priceValidation.message) {
          console.log(`  Mensaje: ${priceValidation.message}`);
        }
      },
      10000,
      'Prueba de precio inválido'
    );
    
    // Resumen de pruebas
    console.log('\n=== RESUMEN DE PRUEBAS DE VALIDACIÓN ===');
    console.log('Campos individuales probados:');
    console.table(pruebasIndividuales);
    
    console.log('\nPrueba de validación de formulario completada.');
    
  } catch (error) {
    console.error('Error durante la prueba de validación:', error);
  } finally {
    // Cerrar el navegador
    if (browser) {
      await closeBrowser(browser);
    }
  }
  
  return true;
}

// Ejecutar el script
testFormValidation()
  .then(() => {
    console.log('Script de prueba de validación completado exitosamente');
    process.exit(0);
  })
  .catch(err => {
    console.error('Script de prueba de validación falló:', err);
    process.exit(1);
  }); 