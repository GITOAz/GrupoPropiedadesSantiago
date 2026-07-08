# Apps Script — flujo de aprobación de contactos

Este script recibe los contactos del sitio web, los registra en una Google
Sheet y le pide a los socios que aprueben o rechacen cada uno por correo,
sin usar ninguna API key: se autoriza con tu cuenta personal de Google.

## 1. Crear la planilla

1. Ve a [sheets.google.com](https://sheets.google.com) y crea una hoja de
   cálculo nueva. Nómbrala, por ejemplo, "Grupo Propiedades Santiago — Contactos".
2. No hace falta crear las pestañas "Pendientes" / "Aprobados" a mano — el
   script las crea solas la primera vez que corre (ver paso 4).

## 2. Pegar el script

1. En la planilla, ve a **Extensiones → Apps Script**.
2. Borra el contenido de `Código.gs` (o `Code.gs`) que viene por defecto.
3. Pega el contenido completo de [`Code.gs`](./Code.gs) de este repo.
4. Revisa el arreglo `SOCIOS_EMAILS` al inicio del archivo y ajusta los
   emails si es necesario.
5. Guarda el proyecto (ícono de disco o `Ctrl+S`). Ponle un nombre, por
   ejemplo "Grupo Propiedades Santiago - Aprobación de contactos".

## 3. Autorizar el script

1. En el editor, selecciona la función `inicializarHojas` en el
   desplegable de funciones (arriba, al lado de "Depurar").
2. Haz clic en **Ejecutar**.
3. Google te pedirá autorizar permisos (Sheets + Gmail) con tu cuenta
   personal. Acepta ("Avanzado" → "Ir a [nombre del proyecto] (no seguro)"
   es normal para scripts propios sin publicar).
4. Verifica en la planilla que se crearon las pestañas **Pendientes** y
   **Aprobados** con encabezados.

## 4. Desplegar como Web App

1. En el editor, arriba a la derecha: **Implementar → Nueva implementación**.
2. Tipo: **Aplicación web**.
3. Configuración:
   - **Ejecutar como**: tu cuenta (Yo / la cuenta con la que autorizaste).
   - **Quién tiene acceso**: **Cualquier usuario** (necesario para que el
     sitio web pueda llamarlo y para que los socios abran los links de
     aprobación desde el correo, sin tener que iniciar sesión).
4. Haz clic en **Implementar**, autoriza de nuevo si te lo pide.
5. Copia la **URL de la aplicación web** que te entrega (termina en
   `/exec`). Esa es la URL que necesitas pasarle a Claude / pegar en tu
   `.env` como `APPS_SCRIPT_WEBHOOK_URL`.

## 5. Conectar con el sitio

En el proyecto Next.js, abre el archivo `.env` y completa:

```
APPS_SCRIPT_WEBHOOK_URL="https://script.google.com/macros/s/XXXXXXXX/exec"
```

Reinicia el servidor de desarrollo. Desde ese momento, cada envío del
formulario de contacto del sitio:

1. Se guarda localmente en la base de datos de desarrollo (respaldo).
2. Se reenvía a este Web App, que lo escribe en "Pendientes" y avisa por
   correo a los 3 socios con los botones **Aprobar** / **Rechazar**.
3. Al aprobar, la fila se mueve a "Aprobados". Al rechazar, queda marcada
   como "Rechazado" en "Pendientes".

## Notas

- El correo se envía **desde tu cuenta personal de Gmail**
  (`oscar.aranguiz.i@gmail.com`), aunque el sitio muestre
  `contacto@grupopropiedadessantiago.cl` como email de contacto (enmascaramiento
  solo visual, sin casilla real del dominio todavía).
- Los links de Aprobar/Rechazar incluyen un token aleatorio por contacto
  (columna `Token`, oculta a simple vista pero no borrada de la hoja) para
  que no cualquiera pueda aprobar/rechazar adivinando la URL.
- Si vuelves a desplegar (**Implementar → Gestionar implementaciones →
  editar → Nueva versión**), la URL `/exec` se mantiene igual. Si en
  cambio creas una implementación completamente nueva, la URL cambia y
  hay que actualizar `APPS_SCRIPT_WEBHOOK_URL`.
- Cuotas de Gmail/Apps Script para cuentas personales gratuitas: 100
  correos/día aprox. Más que suficiente en fase Beta; si se supera, subir
  a Google Workspace más adelante.
