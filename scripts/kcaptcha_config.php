<?php

# KCAPTCHA configuration file

$alphabet = "0123456789abcdefghijklmnopqrstuvwxyz"; # do not change without changing font files!

# symbols used to draw CAPTCHA
//$allowed_symbols = "0123456789"; #digits
$allowed_symbols = "23456789abcdeghkmnpqstuvxyz"; #alphabet without similar symbols (o=0, 1=l, i=j, t=f)

# folder with fonts
$fontsdir = 'fonts';	

# CAPTCHA string length
$length = mt_rand(3,6); # random 5 or 6
//$length = 6;

# CAPTCHA image size (you do not need to change it, whis parameters is optimal)
$width = 80;
$height = 35;

# symbol's vertical fluctuation amplitude divided by 2
$fluctuation_amplitude = 3;

# increase safety by prevention of spaces between symbols
$no_spaces = true;

# show credits
$show_credits = false;

# CAPTCHA image colors (RGB, 0-255)
//$foreground_color = array(0, 0, 0);
//$background_color = array(220, 230, 255);
$foreground_color = array(mt_rand(190,255), mt_rand(190,255), mt_rand(190,255));
$background_color = array(mt_rand(80,170), mt_rand(80,170), mt_rand(80,170));

# JPEG quality of CAPTCHA image (bigger is better quality, but larger file size)
$jpeg_quality = 70;
?>