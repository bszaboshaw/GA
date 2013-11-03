	// this is a single line comment
	/*
	 * this is a multi-line comment
	 */

	 //Prompt the user for their name and last name. 

var name = prompt("What is your First Name?");
var lastName = prompt("What is your Last Name?");

	//Create a new variable called full name and store the users full name.

var fullName = "name" + "lastName";

	//Print the full name to the console.

console.log("fullName");

	//Prompt the user for their age.
	
var age = prompt("How old are you?");

	//Add 10 to the age and print the output to the console.
	

console.log(parseInt(age) + 10); 
	
	//Verify that the user is over 18 and print if they are a minor or adult to the console.

if (age >= 18) {
	console.log("you are an adult");
}

else {
	console.log("you are a minor")
}
	
	//Verify if the first name is "General" and the last name is NOT "Assembly"

if (name === "General" && lastName !== "Assembly") {
	console.log("you are successful")
};

