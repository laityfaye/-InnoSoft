<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Nouveau message de contact</title>
</head>
<body>
    <h2>Nouveau message de contact - InnoSoft Creation</h2>
    
    <p><strong>Nom:</strong> <?php echo e($name); ?></p>
    <p><strong>Email:</strong> <?php echo e($email); ?></p>
    <p><strong>Téléphone:</strong> <?php echo e($phone); ?></p>
    <p><strong>Sujet:</strong> <?php echo e($subject); ?></p>
    
    <h3>Message:</h3>
    <p><?php echo e($messageContent); ?></p>
</body>
</html>

<?php /**PATH C:\Users\laity\Desktop\innosoft\backend\resources\views/emails/contact.blade.php ENDPATH**/ ?>