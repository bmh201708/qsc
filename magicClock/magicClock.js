/**
 * 欢迎！未来的潮人！
 * 请在这个文件中完成魔法时钟的制作
 * 您甚至不需要编辑其他文件，但我们鼓励更多的探索！
 * 现在您可以删掉这段注释，开始实践。
 */
const canvas = document.getElementById("ClockCanvas");
const ctx = canvas.getContext("2d");

var imgbolt = new Image() ;
imgbolt.src = "./src/Bolt.png" ; 
imgbolt.onload = function() {
    width = 80 ; 
    Height = width / 80 * 200 ; 
    ctx.drawImage(imgbolt , -50 , -500 , width , Height);
}

ctx.translate(200 , 700); 



var mi , ho ; 
var imgBoard = new Image();
var imgMinute = new Image() ;
var imgHour = new Image() ;

function drawTime(s) { // 画出某个时刻的时钟
    //var s = getTime() ; 
    var Hournumber = Number(s.substr(0 , 2)) ; 
    var Minutenumber = Number(s.substr(3 , 2)) ;
    //console.log(Minutenumber) ; 
    imgBoard.src = "./src/ClockBoard.png" ;
    imgBoard.onload = function() {
        ctx.drawImage(imgBoard , -100 , -100 , 200 , 200); // 画表盘 
        ctx.save() ; 
        mi = 2 * Math.PI * (Minutenumber / 60) ;
        //console.log(mi);
        ctx.rotate(mi) ;        
        imgMinute.src = "./src/MinuteHand.png" ; 
        imgMinute.onload = function() {
            width1 = 8; 
            Height1 = width1 / 13 * 158 ; 
            ctx.drawImage(imgMinute , -5 , -90 , width1 , Height1); // 画分针 (195 , 570)
            ctx.restore();
            if(Hournumber >= 12) {
                Hournumber -= 12 ; 
            } else {
                Hournumber = Hournumber ; 
            }
            ho = 2 * Math.PI * (Hournumber / 12) + Math.PI / 6 * (Minutenumber / 60);
            ctx.save() ; 
            ctx.rotate(ho);
            imgHour.src = "./src/HourHand.png";
            imgHour.onload = function() {
                width = 12; 
                Height = width / 33 * 159 ; 
                ctx.drawImage(imgHour , -5 , -50 , width , Height); // 画时针 (195 , 650)

                
                ctx.restore();
            }
        } 


    }
}

setInterval(() => {
    drawTime(getTime()) ; 
} , 20 );

/*function printTime(){
    console.log(getTime());
}
setInterval(printTime,500);*/

var offsetX , offsetY , startX , startY ; 
var isfreeze = false ;
//console.log(canvas.offsetLeft , canvas.offsetTop ); // (0 , -800)

canvas.addEventListener("mousedown" , function(e) {
    // 获取鼠标位置
    startX = e.clientX - canvas.offsetLeft ; 
    startY = e.clientY - canvas.offsetTop ; 
    //console.log(startX , startY);

   //获取图片位置
    offsetX = startX - imgbolt.x;
    offsetY = startY - imgbolt.y;

    canvas.addEventListener("mousemove" , moveHandler) ;
    canvas.addEventListener("mouseup" , upHandler) ; 
}) ; 

function moveHandler(e) {
    //计算位移距离
    var x = e.clientX - canvas.offsetLeft - offsetX ; 
    var y = e.clientY - canvas.offsetTop - offsetY ;
 //   console.log(x , y);

    //移动图片
    ctx.clearRect(-200 , -700 , canvas.width , canvas.height);
    width = 80 ; 
    height = 200 ; 
    ctx.drawImage(imgbolt ,  -40 , -700 +  y , width , height) ;
    var xx = x - 200 + 40 , yy = y - 700 + 200 ; 
    if(yy >= -20 && isfreeze == false) {
        freezeTime() ; isfreeze = true ; 
    }
    if(yy <= -100 && isfreeze == true) {
        meltTime() ; isfreeze = false ;
    }
}

function upHandler(e) {
    canvas.removeEventListener("mousemove" , moveHandler) ; 
    canvas.removeEventListener("mouseup" , upHandler) ; 
}

function calcTime(angle) {
    var Hournumber = Math.floor(angle / (Math.PI / 6) ) ; 
    var Minutenumber = Math.floor(( angle - Hournumber * (Math.PI / 6)  ) / (Math.PI / 6) * 60 ); 
    var nowTime = getTime() ; 
    var nowHour = Number(nowTime.substr(0 , 2)) ; 
    var nowMinute = Number(nowTime.substr(3 , 2)) ;
    
    if(Hournumber < 10) {
        Hournumber = '0' + Hournumber.toString() ; 
    } else {
        Hournumber = Hournumber.toString() ; 
    }

    if(Minutenumber < 10) {
        Minutenumber = '0' + Minutenumber.toString() ; 
    } else {
        Minutenumber = Minutenumber.toString() ; 
    }
    var strTime = Hournumber+ ':' + Minutenumber;
    console.log(strTime) ; 
    setTime(strTime);
    drawTime(strTime) ; 
}

document.getElementById("ClockCanvas").addEventListener("click" , function(e) {
    //console.log(e.clientX , e.clientY , (e.clientX - 1120) * (e.clientX - 1120), (e.clientY - 550) * (e.clientY - 550)); // (1120 , 550)
    var X = e.clientX - canvas.offsetLeft - 1120; 
    var Y = e.clientY - canvas.offsetTop - 700; 
    //console.log(X , Y) ; 
    var d = Math.sqrt(( X * X + Y * Y) ) ; 
    if( isfreeze == true && d <= 100) {
        console.log(X , Y); 
        if(X >= 0 && Y >= 0 ) {
            var sinvalue = Y / d ; 
            var angle = Math.asin(sinvalue) + Math.PI / 2;
            calcTime(angle) ; 
        } 
        if(X >= 0 && Y < 0) {
            var sinvalue = X / d ; 
            var angle = Math.asin(sinvalue);
            calcTime(angle)
        }       
        if(X < 0 && Y >= 0) {
            var sinvalue = (-X) / d ; 
            var angle = Math.asin(sinvalue) + Math.PI; 
            calcTime(angle) ; 
        }
        if(X < 0 && Y < 0) {
            var sinvalue = (-Y) / d ; 
            var angle = Math.asin(sinvalue) + Math.PI * 1.5;
            calcTime(angle) ;  
        }
    }
}) ; 