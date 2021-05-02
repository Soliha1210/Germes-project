let minus=document.querySelector('.minus')
let plus=document.querySelector('.plus')
let num=document.querySelector('.num')

plus.addEventListener('click',function(){
	num.textContent=parseInt(num.textContent)+1
})

minus.addEventListener('click',function(){
	if(num.textContent>0){
		num.textContent=parseInt(num.textContent)-1
	}
	
})

new Splide( '.logo2.splide', {
	type   : 'loop',
	perPage: 7,
    perMove: 1,
} ).mount();

let btn=document.querySelector('.img_up');
let text=document.querySelector('.del_text');
btn.addEventListener('click', function(){
	text.classList.toggle('show')

})