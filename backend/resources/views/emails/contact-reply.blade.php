<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Réponse à votre message</title>
</head>
<body>
    <h2>Bonjour {{ $name }},</h2>
    
    <p>Merci d'avoir contacté InnoSoft Creation. Voici notre réponse à votre message :</p>
    
    <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0;">
        <div style="margin: 0; line-height: 1.6;">
            {!! $replyMessage !!}
        </div>
    </div>
    
    @if($originalMessage)
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
        <p style="color: #666; font-size: 14px;"><strong>Votre message original :</strong></p>
        <p style="color: #666; font-size: 14px; white-space: pre-wrap;">{{ $originalMessage }}</p>
    </div>
    @endif
    
    <p style="margin-top: 30px;">
        Cordialement,<br>
        <strong>L'équipe InnoSoft Creation</strong>
    </p>
</body>
</html>

