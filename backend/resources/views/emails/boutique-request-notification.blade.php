<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Nouvelle demande de boutique - Boutique UIDT</title>
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
        .info-box {
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
        <h1>Nouvelle demande de boutique</h1>
        <p>Une nouvelle demande d'ouverture de boutique a été soumise</p>
    </div>
    
    <div class="content">
        <h2>Bonjour,</h2>
        
        <p>Une nouvelle demande d'ouverture de boutique a été soumise sur Boutique UIDT et nécessite votre attention.</p>
        
        <div class="info-box">
            <h3>Informations du demandeur :</h3>
            <p><strong>Nom :</strong> {{ $request->name }}</p>
            <p><strong>Email :</strong> {{ $request->email }}</p>
            @if($request->phone)
            <p><strong>Téléphone :</strong> {{ $request->phone }}</p>
            @endif
        </div>
        
        <div class="info-box">
            <h3>Informations de la boutique :</h3>
            <p><strong>Nom de la boutique :</strong> {{ $request->boutique_name }}</p>
            @if($request->description)
            <p><strong>Description :</strong></p>
            <p>{{ $request->description }}</p>
            @endif
        </div>
        
        <div style="text-align: center;">
            <a href="{{ $adminPanelUrl }}" class="button">Accéder au tableau de bord admin</a>
        </div>
        
        <p>Veuillez examiner cette demande et prendre une décision (approuver ou rejeter) depuis votre tableau de bord administrateur.</p>
        
        <p>Cordialement,<br>Le système Boutique UIDT</p>
    </div>
    
    <div class="footer">
        <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
        <p><a href="https://innosft.com/" style="color: #0066FF; text-decoration: none;">https://innosft.com/</a></p>
        <p>&copy; {{ date('Y') }} Boutique UIDT - Tous droits réservés</p>
    </div>
</body>
</html>

