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
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="https://innosft.com/" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Visiter notre site web</a>
    </div>
    
    <p style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
        <a href="https://innosft.com/" style="color: #3b82f6; text-decoration: none;">https://innosft.com/</a>
    </p>
</body>
</html>

