<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation de commande - InnoSoft Creation</title>
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
            border-bottom: 3px solid #F44336;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #F44336;
            margin: 0;
            font-size: 28px;
        }
        .order-number {
            background-color: #F44336;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            display: inline-block;
            margin: 20px 0;
            font-size: 18px;
            font-weight: bold;
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
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        .items-table th {
            background-color: #F44336;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
        }
        .items-table td {
            padding: 10px 12px;
            border-bottom: 1px solid #ddd;
        }
        .items-table tr:last-child td {
            border-bottom: none;
        }
        .items-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .total-row {
            background-color: #fff3f3 !important;
            font-weight: bold;
            font-size: 16px;
        }
        .total-row td {
            padding: 15px 12px;
            border-top: 2px solid #F44336;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #777;
            font-size: 14px;
        }
        .status-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 14px;
        }
        .status-pending {
            background-color: #ffc107;
            color: #000;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>InnoSoft Creation</h1>
            <p>Confirmation de commande</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
            <div class="order-number">Commande #<?php echo e($order->order_number); ?></div>
        </div>

        <p style="font-size: 16px; text-align: center; margin-bottom: 30px;">
            Bonjour <strong><?php echo e($order->customer_name); ?></strong>,<br>
            Nous avons bien reçu votre commande et nous vous en remercions !
        </p>

        <div class="section">
            <div class="section-title">Informations de livraison</div>
            <div class="info-row">
                <span class="info-label">Nom :</span>
                <span class="info-value"><?php echo e($order->customer_name); ?></span>
            </div>
            <div class="info-row">
                <span class="info-label">Email :</span>
                <span class="info-value"><?php echo e($order->customer_email); ?></span>
            </div>
            <?php if($order->customer_phone): ?>
            <div class="info-row">
                <span class="info-label">Téléphone :</span>
                <span class="info-value"><?php echo e($order->customer_phone); ?></span>
            </div>
            <?php endif; ?>
            <div class="info-row">
                <span class="info-label">Adresse :</span>
                <span class="info-value"><?php echo e($order->shipping_address); ?></span>
            </div>
            <?php if($order->city): ?>
            <div class="info-row">
                <span class="info-label">Ville :</span>
                <span class="info-value"><?php echo e($order->city); ?></span>
            </div>
            <?php endif; ?>
            <div class="info-row">
                <span class="info-label">Pays :</span>
                <span class="info-value"><?php echo e($order->country); ?></span>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Détails de la commande</div>
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Produit</th>
                        <th>Quantité</th>
                        <th>Prix unitaire</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <?php $__currentLoopData = $order->items; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <tr>
                        <td><?php echo e($item->product_name); ?></td>
                        <td><?php echo e($item->quantity); ?></td>
                        <td><?php echo e(number_format($item->product_price, 0, ',', ' ')); ?> XOF</td>
                        <td><?php echo e(number_format($item->subtotal, 0, ',', ' ')); ?> XOF</td>
                    </tr>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    <tr class="total-row">
                        <td colspan="3" style="text-align: right;">Total :</td>
                        <td><?php echo e(number_format($order->total, 0, ',', ' ')); ?> XOF</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="section">
            <div class="section-title">Informations de paiement</div>
            <div class="info-row">
                <span class="info-label">Mode de paiement :</span>
                <span class="info-value">
                    <?php if($order->payment_method === 'cash'): ?>
                        Espèces
                    <?php elseif($order->payment_method === 'mobile_money'): ?>
                        Mobile Money
                    <?php elseif($order->payment_method === 'bank_transfer'): ?>
                        Virement bancaire
                    <?php else: ?>
                        <?php echo e($order->payment_method); ?>

                    <?php endif; ?>
                </span>
            </div>
            <div class="info-row">
                <span class="info-label">Statut :</span>
                <span class="status-badge status-pending"><?php echo e(ucfirst($order->status)); ?></span>
            </div>
        </div>

        <?php if($order->notes): ?>
        <div class="section">
            <div class="section-title">Notes</div>
            <p style="color: #555; font-style: italic;"><?php echo e($order->notes); ?></p>
        </div>
        <?php endif; ?>

        <div class="footer">
            <p><strong>InnoSoft Creation</strong></p>
            <p>Ville verte, Thiès, Sénégal</p>
            <p>Email : innosoftcreation@gmail.com | Téléphone : +221 78 018 62 29</p>
            <p style="margin-top: 20px; font-size: 12px; color: #999;">
                Vous recevrez un email de suivi dès que votre commande sera traitée.
            </p>
        </div>
    </div>
</body>
</html>

<?php /**PATH C:\Users\laity\Desktop\innosoft\backend\resources\views/emails/order-confirmation.blade.php ENDPATH**/ ?>