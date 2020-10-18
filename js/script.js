    window.onload = function(){
      let canvas = document.getElementById("pingPong");
      let ctx = canvas.getContext("2d");
      let bufferCanvas = document.createElement("canvas");
      let bufferCtx = bufferCanvas.getContext("2d");
      bufferCtx.canvas.width = ctx.canvas.width;
      bufferCtx.canvas.height = ctx.canvas.height;
      let w = +canvas.getAttribute("width");
      
      let str = document.getElementById("str");
      let strCtx = str.getContext("2d");

      const cort = {
        width : null,
        height : null,
      };
      cort.width = +canvas.getAttribute("width");
      cort.height = +canvas.getAttribute("height");

      const ball = {
        radius : 8,  
        posX : canvas.width / 2,
        posY : canvas.height / 2,  
        speedY : 3,
        speedX : 3,
        accel : 1.1,
      };
      const rockets = {
        widht : 7,
        height : 80,  
        posLeftY : 0,
        posRightY : 0,
        stepMove : 10,
      };
      const counterMax = 5; // играем до 5 очков
      let vectorX = 1;
      let vectorY = -1;
      let leftPoint = 0;
      let rightPoint = 0;
      
      function CortDraw(){
        bufferCtx.fillStyle = "#a2e8e2";
        bufferCtx.fillRect(0, 0, canvas.width, canvas.height);
      }
      function ballDraw(){
        bufferCtx.beginPath();
        bufferCtx.fillStyle = "white";
        bufferCtx.arc(ball.posX, ball.posY, ball.radius, 0, Math.PI / 180 * 360);
        bufferCtx.fill();
      }
      function leftRocketDraw(){
        bufferCtx.beginPath();
        bufferCtx.fillStyle = "grey";
        bufferCtx.rect(0, rockets.posLeftY, rockets.widht, rockets.height);
        bufferCtx.fill();
      }
      function rightRocketDraw(){
        bufferCtx.beginPath();
        bufferCtx.fillStyle = "grey";
        bufferCtx.rect(canvas.width - rockets.widht, rockets.posRightY, rockets.widht, rockets.height);
        bufferCtx.fill();
      }
      function infoTableDraw(num){
        strCtx.font = "bold 60px Arial";
        strCtx.fillStyle = "red";
        strCtx.textAlign = "center";
        strCtx.fillText(num, 400, 60, );
      }
      
      animate();
      function animate(){
        CortDraw();  // рисуем корт
        ballDraw();  // рисуем мяч
        leftRocketDraw();  // рисуем левую рокетку
        rightRocketDraw();  // рисуем правую рокетку
        // переносим данные из буффера в основной канвас
        ctx.drawImage(bufferCanvas, 0, 0, canvas.width, canvas.height);
      }

      // кнопка запуска игры
      (function pressButtonStartGame(){
        let start = document.getElementById("start");

        start.addEventListener("click", function getStartGame(){
        leftPoint = -1;
        leftPoints();

        rightPoint = -1;
        rightPoints();

        vectorX = -vectorX;
        vectorY = -vectorY;
        getStartPosition();
        startCounter();
        start.disabled = true;  
        });
      })();

      // начало отсчета и старт игры
      function startCounter(){ 
        strCtx.clearRect(0,0,800, 70);
        str.style.visibility = "visible";  
        setTimeout(function(){
          infoTableDraw(3);
          setTimeout(function(){
            strCtx.clearRect(0,0,800, 70);
            infoTableDraw(2);
            setTimeout(function(){
              strCtx.clearRect(0,0,800, 70);
              infoTableDraw(1);
              setTimeout(function(){
                strCtx.clearRect(0,0,800, 70);
                str.style.visibility = "hidden";  
                requestAnimationFrame(getMoveBall);
              },500); 
            },1000);
          },1000);
        },0);
      }

      // управление ракетками
      (function getControlRockets(){    
        let a = null;
        let b = null;
   
        document.addEventListener("keydown", function(event){
          event.preventDefault();
          if(event.code == "ControlLeft" && !event.repeat){
            requestAnimationFrame(goDownLeft);
          }
          if(event.code == "ShiftLeft" && !event.repeat){
            requestAnimationFrame(goUpLeft);
          }
          if(event.code == "ArrowDown" && !event.repeat){
            requestAnimationFrame(goDownRight);
          }
          if(event.code == "ArrowUp" && !event.repeat){
            requestAnimationFrame(goUpRight);
          }
        })   
    
        document.addEventListener("keyup", function(event){
          event.preventDefault();
          if(event.code == "ControlLeft"){
            cancelAnimationFrame(a);
          }
          if(event.code == "ShiftLeft"){
            cancelAnimationFrame(a);
          }
          if(event.code == "ArrowDown"){
            cancelAnimationFrame(b);
          }
          if(event.code == "ArrowUp"){
            cancelAnimationFrame(b);
          }
        })  

        function goDownLeft(){
          if(rockets.posLeftY < cort.height - rockets.height){
            rockets.posLeftY += rockets.stepMove;
            animate();
            a = requestAnimationFrame(goDownLeft);
          }
        }  

        function goUpLeft(){
          if(rockets.posLeftY > 0){
            rockets.posLeftY -= rockets.stepMove;
            animate();
            a = requestAnimationFrame(goUpLeft);
          }
        }  

        function goDownRight(){
          if(rockets.posRightY < cort.height - rockets.height){
            rockets.posRightY += rockets.stepMove;
            animate();
            b = requestAnimationFrame(goDownRight);
          }
        }  

        function goUpRight(){
          if(rockets.posRightY > 0){
            rockets.posRightY -= rockets.stepMove;
            animate();
            b = requestAnimationFrame(goUpRight);
          }
        }
      })();

      // движение шарика
      function getMoveBall(){
        ball.posX += ball.speedX * vectorX;
        ball.posY += ball.speedY * vectorY;
        
        // вылетел ли мяч правее стены?
        if(ball.posX + ball.radius > cort.width - rockets.widht){
          if(ball.posY >= rockets.posRightY && ball.posY <= rockets.posRightY + rockets.height){
            ball.speedX = -ball.speedX * ball.accel;
            ball.posX = (cort.width - rockets.widht) - ball.radius; 
          }else{
            ball.speedX = 0;
            ball.speedY = 0;
            ball.posX = cort.width - ball.radius;

            animate();
            leftPoints();
          
            if(leftPoint < counterMax){
              infoTableDraw("GOLL");
              str.style.visibility = "visible";
              setTimeout(getNextStart, 1000);
              return;
            }else{
              infoTableDraw("GOLL");
              str.style.visibility = "visible";
              setTimeout(function(){
                strCtx.clearRect(0,0,800, 70);
                infoTableDraw("победил левый игрок");
              },1000);
              start.disabled = false;
              return;
            }
          }
        }
        // вылетел ли мяч левее стены?
        if(ball.posX - ball.radius < rockets.widht){
          if(ball.posY >= rockets.posLeftY && ball.posY <= rockets.posLeftY + rockets.height){
            ball.speedX = -ball.speedX * ball.accel;
            ball.posX = rockets.widht + ball.radius;
          }else{
            ball.speedX = 0;
            ball.speedY = 0;
            ball.posX = ball.radius; 

            animate();
            rightPoints();
          
            if(rightPoint < counterMax){
              infoTableDraw("GOLL");
              str.style.visibility = "visible";
              setTimeout(getNextStart, 1000);
              return;
            }else{
              infoTableDraw("GOLL");
              str.style.visibility = "visible";
              setTimeout(function(){
                strCtx.clearRect(0,0,800, 70);
                infoTableDraw("победил правый игрок");
              },1000);  
              start.disabled = false;
              return;
            } 
          }
        }
        // вылетел ли мяч ниже пола?
        if(ball.posY + ball.radius > cort.height){
          ball.speedY = -ball.speedY * ball.accel;
          ball.posY = cort.height - ball.radius;  
        }
        // вылетел ли мяч выше потолка?
        if(ball.posY - ball.radius < 0){
          ball.speedY = -ball.speedY * ball.accel;
          ball.posY = ball.radius;
        }
        animate();
        requestAnimationFrame(getMoveBall);
      } 
      
      // счетчик очков
      function leftPoints(){
        leftPoint++;
        let p = document.getElementById("leftScore");
        p.innerHTML = leftPoint;
      }
      function rightPoints(){
        rightPoint++;
        let p = document.getElementById("rightScore");
        p.innerHTML = rightPoint;
      }
      
      // запуск игры после забитого гола
      function getNextStart(){
        str.style.visibility = "hidden";
        getStartPosition();
        //задаем начальный вектор движения шара
        vectorX = -vectorX;
        vectorY = -vectorY;
        startCounter();
      }
      
      // стартовая позиция
      function getStartPosition(){
        ball.posX = canvas.width / 2;
        ball.posY = canvas.height / 2;
        ball.speedX = 3;
        ball.speedY = 3;
     
        rockets.posLeftY = 0;
        rockets.posRightY = 0;
      
        animate();
      }
    }
