<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Identifiants temporaires - Boutique UIDT</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #0066FF 0%, #00D4FF 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .credentials-box {
            background: white;
            padding: 20px;
            border-left: 4px solid #0066FF;
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            background: #0066FF;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Félicitations !</h1>
        <p>Votre boutique a été approuvée</p>
    </div>
    
    <div class="content">
        <h2>Bonjour {{ $boutique->owner ? $boutique->owner->name : ($boutique->name ?? $boutique->email) }},</h2>
        
        <p>Nous sommes heureux de vous informer que votre demande d'ouverture de boutique <strong>{{ $boutique->name }}</strong> a été approuvée.</p>
        
        <p>Vous pouvez maintenant accéder à votre tableau de bord pour commencer à gérer votre boutique, ajouter vos produits et suivre vos commandes.</p>
        
        <div class="credentials-box">
            <h3>Vos identifiants temporaires :</h3>
            <p><strong>Email :</strong> {{ $boutique->email }}</p>
            <p><strong>Mot de passe temporaire :</strong> <code style="background: #f0f0f0; padding: 5px 10px; border-radius: 3px;">{{ $tempPassword }}</code></p>
        </div>
        
        <p><strong>⚠️ Important :</strong></p>
        <ul>
            <li>Ce mot de passe est temporaire et expire dans 7 jours.</li>
            <li>Vous devrez changer ce mot de passe lors de votre première connexion.</li>
            <li>Pour des raisons de sécurité, ne partagez jamais vos identifiants.</li>
        </ul>
        
        <div style="text-align: center;">
            <a href="{{ $loginUrl }}" class="button">Accéder à mon tableau de bord</a>
        </div>
        
        <p>Si vous avez des questions ou besoin d'aide, n'hésitez pas à nous contacter.</p>
        
        <p>Cordialement,<br>L'équipe Boutique UIDT</p>
    </div>
    
    <div class="footer">
        <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
        <p><a href="https://innosft.com/" style="color: #0066FF; text-decoration: none;">https://innosft.com/</a></p>
        <p>&copy; {{ date('Y') }} Boutique UIDT - Tous droits réservés</p>
    </div>
</body>
</html>

