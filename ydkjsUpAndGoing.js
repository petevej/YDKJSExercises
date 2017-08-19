/**
  * Created By: Pete Vejanurug
  * Email: p@lagobe.com
  * Phone: +66903263755
  */
  
var phonePrice = 99.99;
var accessoryPrice = 9.99;
var spendingThreshold = 200;
var taxRates = 0.08;

var bankBalance = prompt( "Please enter your bank account balance" );
var amount = 0;

// return amount with tax added
function addTax(amt) {
	amt = amt + ( amt * taxRates );
	return amt;
}

// format with $ and 2 decimals
function format(amt) {
	return "$" + amt.toFixed(2);
}
 
// loop to buy phone + accessories
function buyPhone() {
	
	// keep buying phone as long as still under bank balance
	while (amount < bankBalance) {
		amount = amount + phonePrice;
		
		// keep buying accessories as long as still under MT
		if (amount < spendingThreshold) {
			amount = amount + accessoryPrice;
		}
	}
	amount = addTax(amount);
	
	console.log(
	"Your purchase: " + format(amount)
	);
	
	return amount; 
}

buyPhone();

// affordability test
function canAfford(amt) {
	if (amount <= bankBalance) {
		console.log("Yes, you can buy this!");
	} 
	else {
		console.log("No, you can't afford this!");
	}
}

canAfford(amount);