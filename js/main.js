// *********************************
// The main JS script for BeeSweeper 
// --------------------------------
//  a. We are loading our vars, checking localstorage for the difficulty key.
//  b. We load the board and set the number of mines (based on difficulty key, set or unset)
//  c. We listen for firstClick, upon this event we render the mines, clues, reveal and timer starts
//  d. Further clicks reveal more, check for winConditions and update the board
//---------------------------------
//    The script is divided into 3 parts:
//    1. Setup and storage
//    2. Click Events
//    3. General functions
//
// We are also loading from layout.js which houses the timer and sound fx functions


$(document).ready(function() {


var board = $("#main-container"),
	mineCounter = $("#numMines"),
	updateContainer = $('#update-container')
	updateBox = $("#update-box"),
	resetButton = $("#start-reset-button"),
	beehives = $("#beehives"),
	difficultyMenu = $("#difficulty-menu"),	
	firstClick = false,
	winner = false,
	inProgress = false,
	numFlags = 0;

// 2 Objects that store the prototype properties used for game state changes

var minedSpot = {
	mined: true,
	clue: false,
	clicked: false,
	revealed: false,
	flagged: false
};

var freeSpot = {
	mined: false,
	clue: false,
	clicked: false,
	revealed: false,
	nextToMines: 0,
	flagged: false
};


// --------------------------------1. SETUP AND STORAGE ------------------------------//
// ****** createBoard, createMatrix, localStorage *********************************//


	function createBoard(v){

	  	// Create rows
	    for (var i = 0; i < v; i++){
	       row = document.createElement("div");
	       row.className = "row " + "row" + i;
	       row.setAttribute("data-row", i)   
	       // Create cells
	       for(var j=0; j < v; j++){
		        cell = document.createElement("button");
		        clueSpan = document.createElement("span");
		        cell.className = "cell " + "cell" + j;
		        clueSpan.className = "clueSpan ";
		        cell.setAttribute("data-cell", j)
		        row.appendChild(cell);
		        cell.appendChild(clueSpan);
		     
	       }

	       board.append(row)
	    }
	   
	} //createBoard END

 // Create the matrix - Our "back-end" logic that connects to the front-end grid we created above.
 // We work with the matrix to deal wth the computations and conditional logic that allows our
 // game to come alive. Y is set by difficulty - localStorage
function createMatrix(y){
	matrix = new Array(y);
		for (var i = 0; i < matrix.length; i++) {
				matrix[i] = new Array(y);
		}
}




var isDifficultySet = localStorage.getItem('difficulty');

// If a user is new, create the local key and set the default vars = easy
if(!isDifficultySet){
	console.log('no localStorage');
	localStorage.setItem('difficulty', 'easy')
	createBoard(9) 
	createMatrix(9) 
	numMines = 10 
}

else {
		if (isDifficultySet === 'easy'){
			createBoard(9) 
			createMatrix(9) 
			numMines = 10 
			document.getElementById("easy").selected = true;
		}

		if (isDifficultySet === 'medium'){
			createBoard(14) 
			createMatrix(14) // level
			numMines = 30 
			document.getElementById("medium").selected = true;
		}

		if (isDifficultySet === 'hard'){
			createBoard(18) 
			createMatrix(18) 
			numMines = 60 
			document.getElementById("hard").selected = true;
		}
	}

// Listen for user changes to the difficulty select menu. Set new key and reload.
difficultyMenu.change(function(){

	if($("#difficulty-menu option:selected").val() === "easy"){
		localStorage.setItem('difficulty', 'easy')
		window.location.reload(true)

	}
	if($("#difficulty-menu option:selected").val() === "medium"){
		localStorage.setItem('difficulty', 'medium')
		window.location.reload(true)

	}
	if($("#difficulty-menu option:selected").val() === "hard"){
		localStorage.setItem('difficulty', 'hard')
		window.location.reload(true)

	}
})

// Setup the utility box that lists numMines for user
beehives.text("beehives")
mineCounter.text(numMines)




// -------------------------------2. CLICK EVENTS ----------------------------------------------//
// ********** cellClicks (LMB & RMB), Reset button ***************************************** //

anyCell = $(".cell")

// Left click - store the relevant clicked cell, check if it's first click - true? Setup game
// False? - check win conditions, reveal further squares

anyCell.click(function() {

		// alert($(this).attr('class') + $(this).parent().attr('class'))
		clickedRow = parseInt($(this).parent().attr('data-row')) 
		clickedCell = parseInt($(this).attr("data-cell"))

		

		// If it's the first click...
		if (firstClick === false && inProgress === false) {

			matrix[clickedRow][clickedCell] = new Object(freeSpot)
			// Set this square as start square
			// Further functions place mines and clues, reveal first square(s)
			matrix[clickedRow][clickedCell]["clicked"] = true;
			firstClick = true;
			timer();
			matrix = placeMines(matrix)
			renderMines(matrix)
			renderClues(matrix)
			revealSquares()
			inProgress = true

			

		} // END FirstClick check 

		// Now the User has started the game proper, there next click = so we're hitting this else condition after every new click
		// If the square is flagged - prevent left clicks
		else if ($(this).hasClass("flagged") === false) {
			// First check if they've hit a mine, if so, gameover man
			if (matrix[clickedRow][clickedCell]["mined"] === true) {			
				gameOver()
			} 
			// if not, and the game is in progress, reveal the next square(s) and check for win conditions
			else if (inProgress === true) { 
				   revealSquares();
				   winConditionCheck();
			}
			
		}

	}) // End (.cell).click LMB

// Listener for Right mouse button clicks
anyCell.on("contextmenu", anyCell, function(e){
	
	// grab clicked cell
	clickedFlagRow = parseInt($(this).parent().attr('data-row')) 
	clickedFlagCell = parseInt($(this).attr("data-cell"))

	// How many flags are on the board - prevent having more than numMines && if Flagged class exists on cell
	// remove it and make sure grass image is returned. 
	if (numFlags <= numMines && inProgress === true){	
		if($(this).hasClass("flagged") === true){
			$(this).removeClass("flagged")
			matrix[clickedFlagRow][clickedFlagCell]["flagged"] = false
			numFlags = numFlags - 1

		}
		// if cell does not have the class "flagged" - add it
	   	else { 
	   		$(this).addClass("flagged")
			matrix[clickedFlagRow][clickedFlagCell]["flagged"] = true
			numFlags = numFlags + 1
	   	}
	   }

		return false;
});



// reset the game upon click
resetButton.click(function(){

	window.location.reload(true)

})

// mousedown and up listeners to make the bee's expression animate

anyCell.mousedown(function() {
    resetButton.removeClass( "bee-smile" ).addClass( "bee-pause" )
})
anyCell.mouseup(function() {
	resetButton.removeClass( "bee-pause" ).addClass( "bee-smile" )
})


// ------------------------------------ 3. FUNCTIONS ------------------------------------------------------//
// ***************** placeMines, render, reveal, check win conditions ********************************** //


	function placeMines(matrix) {

		// fill the spaces that are free (== undefined) with freeSpot objects
		for (var x = 0; x < matrix.length; x++) {
			for (var y = 0; y < matrix.length; y++) {
				if (matrix[x][y] === undefined){
					// I've found I need to explicitly create the object here else the property clicked becomes TRUE for all squares
					matrix[x][y] = freeSpot = {
												mined: false,
												clue: false,
												clicked: false,
												revealed: false,
												nextToMines: 0,
												flagged: false
											};
				}
			}
		}

		// Generate Mines
		for (var i = 0; i < numMines; i++) {
			// Generate a random X and Y co-ord
			var randomX = Math.round(Math.random() * (matrix.length - 1)),
				randomY = Math.round(Math.random() * (matrix.length - 1));
			
					// check we dont place a mine in our start point or a previous mine
					while (matrix[randomX][randomY]["clicked"] === true || matrix[randomX][randomY]["mined"] === true){
						randomX = Math.round(Math.random() * (matrix.length - 1));
						randomY = Math.round(Math.random() * (matrix.length - 1));
						console.log("stopped starting sq mine placement")
						
					} 		
					// assign the new mine object to the matrix
					matrix[randomX][randomY] = new Object(minedSpot)
						
		};
			
			return matrix

	} // END placemines	


	// Render the mines
	function renderMines(matrix){

		// Cycle the matrix looking for the mined spots and render
		for (var x = 0; x < matrix.length; x++) {
			for (var y = 0; y < matrix.length; y++) {
				if (matrix[x][y]["mined"] === true) {
							
						// console.log("x is " + (x) + " y is " + (y))
						// Cheat - reveal the mines				
						// $(".row" + x).find(".cell" + y).css("background", "blue")	
					
				}

			}

		}
		return matrix

	} // End RenderMines

	// Logic for the clues
	function renderClues(matrix){

		for (var x = 0; x < matrix.length; x++) {
			for (var y = 0; y < matrix[0].length; y++) {
				
				if (matrix[x][y]["mined"] === false) {
						var counter = 1
						// Check down
						if (x !== (matrix.length - 1) && matrix[x+1][y]["mined"] === true) {
							addNumberClue(x, y)
						}
						// check down right
						if (x !== (matrix.length - 1) && y !== (matrix.length - 1) && matrix[x+1][y+1]["mined"] === true) {
							addNumberClue(x, y)
						}
						// check down left
						if (x !== (matrix.length - 1) && y !== 0 && matrix[x+1][y-1]["mined"] === true) {
							addNumberClue(x, y)
						}
						// check right
						if (y !== (matrix.length - 1) && matrix[x][y+1]["mined"] === true) {
							addNumberClue(x, y)
						}
						// check left
						if (y !== 0 && matrix[x][y-1]["mined"] === true) {
							addNumberClue(x, y)
						}
						// check up left
						if (x !== 0 && y !== 0 && matrix[x-1][y-1]["mined"] === true) {
							addNumberClue(x, y)
						}
						// check up
						if (x !== 0 && matrix[x-1][y]["mined"] === true) {
							addNumberClue(x, y)
						}
						// check up right
						if (x !== 0 && y !== (matrix.length - 1) && matrix[x-1][y+1]["mined"] === true) {
							addNumberClue(x, y)
						}		

				}
			}
		}

		// Keeps a count of a clues surrounding mines and updates
		function addNumberClue(x, y){
			matrix[x][y]["nextToMines"] = counter
			counter++
			matrix[x][y]["clue"] = true

			return counter
		}

		return matrix
	} // End RenderClues


	function revealSquares(){
		
		resetVars()
		floodFill(x, y)

		// this reveals the squares (from the user click start point)
		function floodFill(x, y){

		// this var allows us to stop revealing after we hit one clue square	
		var onClue = false

			if( x >= 0 && x <= (matrix.length - 1) && y >= 0 && y <= (matrix.length - 1) ){
				// if our square is empty and unrevealed
				if ( matrix[x][y]["mined"] === false && matrix[x][y]["revealed"] === false && matrix[x][y]["flagged"] === false ){
						// if we're a freespot next to mines
						if (matrix[x][y]["nextToMines"] > 0 && onClue === false){
							// set the square to revealed, else we'll continue into infinity
							matrix[x][y]["revealed"] = true;
							$(".row" + x).find(".cell" + y).css("background", "rgb(69, 226, 69)")
							// reveal the clue

							clueColor(x, y)
							// Now we are finished on our clue square, we DONT want to continue to the next clue square, otherwise we'll flood the board
							// and the only hidden squares will be the mines, a very easy game then
							onClue = true
						}
						// In this case we're on a non-clue square, so just reveal
						if (matrix[x][y]["nextToMines"] === 0 && onClue === false){

							matrix[x][y]["revealed"] = true;
							$(".row" + x).find(".cell" + y).css("background", "rgb(69, 226, 69)")

						} else { return }

					// Recursive operations that fill the board - quite ineffcient but works
					floodFill(x - 1, y);
					floodFill(x + 1, y);
            		floodFill(x, y - 1);
            		floodFill(x, y + 1);

				} else { return }				

			}

		}
			
		// These vars start off the reveal function
		function resetVars(){

			x = parseInt(clickedRow)
			y = parseInt(clickedCell)
			
		}
		// Add the varied colours to the clues
		function clueColor(x, y){
			if (matrix[x][y]["nextToMines"] === 1) {
				$(".row" + x).find(".cell" + y).find(".clueSpan").addClass("clueOne").text(matrix[x][y]["nextToMines"])
			}
			else if (matrix[x][y]["nextToMines"] === 2) {
				$(".row" + x).find(".cell" + y).find(".clueSpan").addClass("clueTwo").text(matrix[x][y]["nextToMines"])
			}
			else if (matrix[x][y]["nextToMines"] === 3) {
				$(".row" + x).find(".cell" + y).find(".clueSpan").addClass("clueThree").text(matrix[x][y]["nextToMines"])
			}
			else if (matrix[x][y]["nextToMines"] === 4) {
				$(".row" + x).find(".cell" + y).find(".clueSpan").addClass("clueFour").text(matrix[x][y]["nextToMines"])
			}
			else if (matrix[x][y]["nextToMines"] === 5) {
				$(".row" + x).find(".cell" + y).find(".clueSpan").addClass("clueFive").text(matrix[x][y]["nextToMines"])
			}
			else if (matrix[x][y]["nextToMines"] === 6) {
				$(".row" + x).find(".cell" + y).find(".clueSpan").addClass("clueSix").text(matrix[x][y]["nextToMines"])
			}
			else if (matrix[x][y]["nextToMines"] === 7) {
				$(".row" + x).find(".cell" + y).find(".clueSpan").addClass("clueSeven").text(matrix[x][y]["nextToMines"])
			}
			else if (matrix[x][y]["nextToMines"] === 8){$(".row" + x).find(".cell" + y).find(".clueSpan").addClass("clueEight").text(matrix[x][y]["nextToMines"])
			}
		}


	} // End revealSquares

	function winConditionCheck(){

		// How many squares have been revealed
		countRevealedSquares = 1;

		for (var x = 0; x < matrix.length; x++) {
			for (var y = 0; y < matrix.length; y++) {
				// Iterate and check if a squares revealed - addone each time
				 if (matrix[x][y]["revealed"] === true){
				 	countRevealedSquares++
				 }
			}	
		}
		// If we've revealed every square except for the mine squares (still unrevealed of course) then we win!
		if ((countRevealedSquares-1) === ( ( (matrix.length) * (matrix.length) ) - numMines ) ){
			winner = true;
			gameOver();
		}
	
	} // END winConditionCheck


	function gameOver(){
		// Stop the timer
		var finishTime = ($("#timer-digits").html())

		clearTimeout(t);
		// If we lost..
		if ( winner === false && inProgress === true ) {		
			inProgress = false
			$("#start-reset-button").removeClass( "bee-pause bee-smile" ).addClass( "bee-lose" )
			sfx() // play sound
			updateContainer.show()
			updateBox.addClass("loser-box")
			updateBox.text("You Lose! The bee's are swarming!")
			// Iterate and reveal the remaining mines
			for (var x = 0; x < matrix.length; x++) {
				for (var y = 0; y < matrix.length; y++) {
					if (matrix[x][y]["mined"] === true) {
						
						$(".row" + x).find(".cell" + y).addClass("hive-mine")
						
					}
				}
			}

		}
		// If we won...
		else if (winner === true) {
			inProgress = false
			updateBox.addClass("winner-box")
			updateContainer.show()
			updateBox.text("Final time: " + finishTime + ". Well done!")
			
		}
	} // End Gameover


}); // END document.ready

