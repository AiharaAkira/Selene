function fnMove(seq){
            var offset = $(seq).offset();
            $('html, body').animate({scrollTop : offset.top}, 400);

    
        }
