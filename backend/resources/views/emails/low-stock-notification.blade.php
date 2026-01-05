<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stock faible - InnoSoft Creation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #ffc107;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #ffc107;
            margin: 0;
            font-size: 28px;
        }
        .alert-box {
            background-color: #fff3cd;
            border: 3px solid #ffc107;
            border-radius: 5px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }
        .alert-box h2 {
            color: #856404;
            margin: 0 0 10px 0;
            font-size: 24px;
        }
        .stock-number {
            font-size: 48px;
            font-weight: bold;
            color: #ff6b6b;
            margin: 20px 0;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            color: #F44336;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            border-bottom: 2px solid #F44336;
            padding-bottom: 5px;
        }
        .info-row {
            margin-bottom: 10px;
        }
        .info-label {
            font-weight: bold;
            color: #555;
            display: inline-block;
            width: 150px;
        }
        .info-value {
            color: #333;
        }
        .action-box {
            background-color: #e7f3ff;
            border: 2px solid #2196F3;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
        }
        .action-box h3 {
            color: #1976D2;
            margin: 0 0 10px 0;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #777;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚠️ Alerte Stock Faible</h1>
            <p>InnoSoft Creation</p>
        </div>

        <div class="alert-box">
            <h2>Attention !</h2>
            <p style="margin: 0; color: #856404; font-size: 16px;">
                Le stock d'un produit est maintenant très faible
            </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
            <div class="stock-number">{{ $product->stock }}</div>
            <p style="font-size: 18px; color: #ff6b6b; font-weight: bold; margin: 10px 0;">
                unité{{ $product->stock > 1 ? 's' : '' }} restante{{ $product->stock > 1 ? 's' : '' }}
            </p>
        </div>

        <div class="section">
            <div class="section-title">Informations du produit</div>
            <div class="info-row">
                <span class="info-label">Nom :</span>
                <span class="info-value">{{ $product->name }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">ID :</span>
                <span class="info-value">#{{ $product->id }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Catégorie :</span>
                <span class="info-value">{{ ucfirst($product->category) }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Prix :</span>
                <span class="info-value">{{ number_format($product->price, 0, ',', ' ') }} XOF</span>
            </div>
        </div>

        <div class="action-box">
            <h3>Action requise</h3>
            <p style="margin: 0; color: #1976D2;">
                Veuillez réapprovisionner ce produit rapidement pour éviter une rupture de stock.
                Connectez-vous au panneau d'administration pour mettre à jour le stock.
            </p>
        </div>

        <div class="footer">
            <p><strong>InnoSoft Creation</strong></p>
            <p>Ville verte, Thiès, Sénégal</p>
            <p style="margin-top: 20px; font-size: 12px; color: #999;">
                Cette notification a été générée automatiquement après une commande.
            </p>
        </div>
    </div>
</body>
</html>

