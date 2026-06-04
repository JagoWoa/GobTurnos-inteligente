# GobTurnos Inteligente

Sistema web de gestion de turnos inteligentes para servicios gubernamentales.
La primera version construye la cara del sistema: autenticacion visual, rutas,
solicitud de turno, consulta de requisitos, gestion de turnos, ventanilla y
dashboard de supervisor. Tambien incluye perfil ciudadano, preferencias de
accesibilidad y validacion de formularios.

## Tecnologias

- React + Vite
- React Router
- Supabase JS preparado para la conexion futura
- Lucide React para iconografia accesible

## Ejecutar

```bash
npm.cmd install
npm.cmd run dev -- --host 127.0.0.1 --port 5180 --strictPort
```

Abrir: http://127.0.0.1:5180

## Supabase

Crear un archivo `.env` local usando `.env.example` como base:

```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=tu_publishable_key
```

No colocar en el frontend `service_role`, claves secretas, tokens LLM ni llaves
privadas. Cuando se conecte la mente del sistema, las operaciones sensibles
deben ir por backend, Edge Functions o politicas RLS bien definidas.

## Accesibilidad

La interfaz se diseno tomando como objetivo WCAG 2.2 nivel A + AA:
contraste, foco visible, etiquetas asociadas, navegacion por teclado,
estructura semantica, mensajes de estado y controles tactiles amplios.

El apartado `/app/accesibilidad` permite aumentar o disminuir el tamano de
letra y cambiar entre modo claro y oscuro. Las preferencias se guardan en
`localStorage`.

## Seguridad de formularios

La validacion actual es del lado del cliente para mejorar usabilidad:
campos obligatorios, patrones de cedula, correo, telefono y longitudes minimas.
En la integracion real con Supabase se debe repetir la validacion en backend,
activar RLS y evitar confiar en datos editables del usuario para autorizacion.
