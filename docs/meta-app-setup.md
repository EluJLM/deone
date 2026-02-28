# Configuración de App en Meta (Facebook + Instagram)

Esta guía habilita el popup de inicio de sesión y la entrega de token para tu app.

## 1) Crea la app en Meta

1. Ve a [Meta for Developers](https://developers.facebook.com/).
2. Entra a **My Apps** > **Create App**.
3. Tipo recomendado: **Business**.
4. Asigna nombre, correo y Business Manager (si aplica).

## 2) Agrega productos

Dentro de la app agrega:

- **Facebook Login**
- **Instagram Graph API**

## 3) Configura OAuth Redirect URI

En **Facebook Login > Settings**, agrega como URI válida:

- `https://TU_DOMINIO/social-connections/facebook/callback`
- `https://TU_DOMINIO/social-connections/instagram/callback`

Para local:

- `http://127.0.0.1:8000/social-connections/facebook/callback`
- `http://127.0.0.1:8000/social-connections/instagram/callback`

## 4) Variables de entorno

En `.env` coloca:

```env
META_APP_ID=tu_app_id
META_APP_SECRET=tu_app_secret
```

## 5) Permisos que debes solicitar

Para Facebook Pages e Instagram publishing:

- `pages_show_list`
- `pages_read_engagement`
- `pages_manage_posts`
- `business_management`
- `instagram_basic`
- `instagram_content_publish`

> En modo desarrollo solo funcionará con usuarios de prueba/roles de la app.

## 6) App Review (cuando salgas a producción)

Debes solicitar aprobación de permisos avanzados en **App Review** y subir evidencia de uso.

## 7) Recomendación para publicación real

El token obtenido por OAuth normalmente es de usuario. Para publicar en páginas y en Instagram Business, debes:

1. Obtener páginas vinculadas del usuario.
2. Sacar Page Access Token.
3. Resolver Instagram Business Account ID vinculada a la página.
4. Publicar por Graph API.

Tu proyecto actual ya guarda el token y marca estado inmediato después de subida; esta guía completa la parte de autorización Meta.
