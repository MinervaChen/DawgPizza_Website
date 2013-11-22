
$("document").ready( function(){
    //takes in the pizza data and fills the file with pizza information
    var idx;
    var pizza;
    var prices;
    var total = 0;
    var cart = new CartModel();
    for (idx = 0; idx < com.dawgpizza.menu.pizzas.length; ++idx) {
        pizza = com.dawgpizza.menu.pizzas[idx];
        var name = document.createElement("dt");
        prices = document.createElement("dt");
        var small = '<button type= "button" class="btn btn-default btn-xs" data-type = "pizza" data-name = "'+ pizza.name + '" data-size = "small" data-price = "'+ pizza.prices[0] + '">' + "small $" + pizza.prices[0] + '</button>' + " ";
        var medium = '<button type= "button" class="btn btn-default btn-xs" data-type = "pizza" data-name = "'+ pizza.name +'" data-size = "medium" data-price = "'+ pizza.prices[1] + '">' + "medium $" + pizza.prices[1] + '</button>' + " ";
        var large = '<button type= "button" class="btn btn-default btn-xs" data-type = "pizza" data-name = "'+ pizza.name +'" data-size = "large" data-price = "'+ pizza.prices[2] + '">' + "large $" + pizza.prices[2] + '</button>' + " ";

        $(name).html(pizza.name);
        $(prices).html(small + medium + large);
        var description = document.createElement("dl");
        $(description).html(pizza.description);
        if(pizza.vegetarian){
            $(name).appendTo(".vegpizzas");
            $(description).appendTo(".vegpizzas");
            $(prices).appendTo(".vegpizzas");
        } else {
            $(name).appendTo(".pizzaMenu");
            $(description).appendTo(".pizzaMenu");   
			$(prices).appendTo(".pizzaMenu");
        }
    } //for

    //takes in the pizza data and fills the file with drink information
    var idx;
    var drink;
    for (idx = 0; idx < com.dawgpizza.menu.drinks.length; ++idx) {
        drink = com.dawgpizza.menu.drinks[idx];
        var name = document.createElement("ul");
        var drink = '<button type= "button" class="btn btn-default btn-xs" data-type = "drink" data-name = "'+ drink.name +'" data-price = "'+ drink.price + '">' + drink.name + " $" + drink.price + '</button>' + " ";
        $(name).html(drink);
        $(name).appendTo(".drinks");
    } 

    //takes in the pizza data and fills the file with dessert information
    var idx;
    var dessert;
    for (idx = 0; idx < com.dawgpizza.menu.desserts.length; ++idx) {
        dessert = com.dawgpizza.menu.desserts[idx];
        var name = document.createElement("ul");
        var dessert = '<button type= "button" class="btn btn-default btn-xs" data-type = "dessert" data-name = "'+ dessert.name +'" data-price = "'+ dessert.price + '">' + dessert.name + " $" + dessert.price + '</button>' + " ";
        $(name).html(dessert);
        $(name).appendTo(".desserts");
    } 

    $(".btn-xs").click(addToCart);
   
    function addToCart(){
	    var name = $(this).data("name");
	    var type = $(this).data("type");
	    var price = $(this).data("price");
	    var size = "";
	    if(type == "pizza"){
	        size = $(this).data("size");
	    }

	    var item = new Items({
	        name : name,
	        type : type,
	        size : size,
	        quantity : 0
	    });
	    if(cart.exists(item) == -1){
	    	cart.insert(item);
	    	total += price;
	    	var itemHtml = $(".template").clone().removeClass("template");
	    	if(type == "pizza"){
	    		itemHtml.html(name + " for $" + price + " : " + size + " <span class=\"glyphicon glyphicon-remove\"></span>");
	    	}else {
				itemHtml.html(name + " for $" + price + " <span class=\"glyphicon glyphicon-remove\"></span>");
	    	}
	    	itemHtml.attr("data-name", name);
	    	itemHtml.attr("data-type", type);
	    	itemHtml.attr("data-size", size);
	    	itemHtml.attr("data-price", price);
	    	$(".cart").append(itemHtml);
	    	$(".cart-item").unbind();
	    	$(".cart-item").bind("click", removeFromCart);
	    } else {
	    	cart.insert(item);
	    	total += price;
	    	$('.cart-item[data-name="' + name + '"].cart-item[data-size="' + size + '"]').html(cart.getQuantity(item) + 1 + "x " + " for $" + price +" "+ size + " " + name + " <span class=\"glyphicon glyphicon-remove\"></span>");
		}
		$(".col-xs-10").html("Total: $" + total + " + $" + (total * .095).toFixed(2) + " (tax) = $" + (total * 1.095).toFixed(2));
	}

	$(".submit-order").click(function(){
		if(total < 20){
			alert("you need at least $20 to order");
		} else {
			$("#submitOrderForm").modal();
		}
	});

	function removeFromCart(){
		var name = $(this).data("name");
		var type = $(this).data("type");
		var price = $(this).data("price");
		var size = "";
		if(type == "pizza"){
			size = $(this).data("size");
		}
		var item = new Items({
			name : name,
	        type : type,
	        size : size,
	        quantity : 0
		});	
			
		total -= price * (cart.getQuantity(item) + 1);
		$(".col-xs-10").html("Total: $" + total + " + $" + (total * .095).toFixed(2) + " (tax) = $" + (total * 1.095).toFixed(2));

		cart.removeItem(item);
		$(this).remove();
	}
	function createCartItemView(config) {
        var view = createTemplateView(config);
        view.afterRender = function(clonedTemplate, model) {
            clonedTemplate.find('.remove-item').click(function(){
                view.cartModel.removeItem(model);
            });
        };
        return view;
	} //createCartItemView()
// postCart()
// posts the cart model to the server using
// the supplied HTML form
// parameters are:
//  - cart (object) reference to the cart model
//  - cartForm (jQuery object) reference to the HTML form
//
function postCart(cart, cartForm) {
    //find the input in the form that has the name of 'cart'    
    //and set it's value to a JSON representation of the cart model
    cartForm.find('input[name="cart"]').val(JSON.stringify(cart));

    //submit the form--this will navigate to an order confirmation page
    cartForm.submit();

} //postCart()



});// document ready
