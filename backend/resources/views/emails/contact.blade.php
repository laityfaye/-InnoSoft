<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Nouveau message de contact</title>
</head>
<body>
    <h2>Nouveau message de contact - InnoSoft Creation</h2>
    
    <p><strong>Nom:</strong> {{ $name }}</p>
    <p><strong>Email:</strong> {{ $email }}</p>
    <p><strong>Téléphone:</strong> {{ $phone }}</p>
    <p><strong>Sujet:</strong> {{ $subject }}</p>
    
    <h3>Message:</h3>
    <p>{{ $messageContent }}</p>
</body>
</html>

