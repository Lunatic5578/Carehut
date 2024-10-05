document.addEventListener("DOMContentLoaded", () => {

// $(".open-menu").on("click", function(){
    
//     let p= document.getElementById('menu');
//     p.style.height="100%"; 
    
//  })
//  $(".close-menu").on("click", function(){
 
//      let p2= document.getElementById('menu');
//      p2.style.height="0%";
//  })
let menu= document.querySelector('.menu');
let close=document.querySelector('.close-menu');
let open=document.querySelector('.open-menu');

 function closeOnItems(){
     let menuItems=document.querySelectorAll("#navbar .nav-bar .menu li");
     for(let menuItem of menuItems){

         menuItem.addEventListener("click",function(){

             console.log("clicked");
             menu.style.right="-100%" 

         })
     }
 }
function closeOnClose(){
    close.addEventListener("click",function(){
        menu.style.right="-100%";
    })
}

function OpenOnOpen(){
    open.addEventListener("click",function(){
        menu.style.right="0";
    })
}

 closeOnItems();
 closeOnClose();
 OpenOnOpen();
 
});