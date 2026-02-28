<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conexión social</title>
</head>
<body style="font-family: sans-serif; padding: 24px;">
    <h2>{{ $ok ? 'Conexión completada' : 'Conexión fallida' }}</h2>
    <p>{{ $message }}</p>

    <script>
        if (window.opener) {
            window.opener.location.reload();
            setTimeout(() => window.close(), 600);
        }
    </script>
</body>
</html>
