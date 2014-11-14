

window.onload = function(){

var board = $("#main-container"),
	mineCounter = $("#numMines"),
	updateBox = $("#update-box"),
	resetButton = $("#start-reset-button"),
	
	firstClick = false,
	winner = false,
	numMines = 10,
	inProgress = false;
	

var minedSpot = {
	mined: true,
	clue: false,
	clicked: false,
	revealed: false
};

var freeSpot = {
	mined: false,
	clue: false,
	clicked: false,
	revealed: false,
	nextToMines: 0
};

	function createBoard(v){

	  	// Create 9 rows
	    for (var i = 0; i < v; i++){
	       row = document.createElement("div");
	       row.className = "row " + "row" + i;
	       row.setAttribute("data-row", i)   
	       // Create cells
	       for(var j=0; j < v; j++){
	        cell = document.createElement("button");
	        clueSpan = document.createElement("span");
	     	// token = document.createElement("div");
	        cell.className = "cell " + "cell" + j;
	        clueSpan.className = "clueSpan ";
	        cell.setAttribute("data-cell", j)
	        // token.className = "token";
	        row.appendChild(cell);
	        cell.appendChild(clueSpan);
	        // cell.appendChild(token);

	       }

	       board.append(row)
	    }
	    // Create the matrix - Our "back-end" logic that connects to the front-end grid we created above.
	    // We work with the matrix to deal wth the computations and conditional logic that allows our
	    // game to come alive.
	    matrix = new Array(9);
		for (var i = 0; i < matrix.length; i++) {
		matrix[i] = new Array(9);
		}


		mineCounter.text(numMines)

	} //createBoard END


createBoard(9)
anyCell = $(".cell")


// ------------------ CLICK EVENTS --------------------//
// *************************************************** //


	$( ".cell" ).click(function() {

		// alert($(this).attr('class') + $(this).parent().attr('class'))
		clickedRow = parseInt($(this).parent().attr('data-row')) 
		clickedCell = parseInt($(this).attr("data-cell"))

		
		if (firstClick === false && inProgress === false) {

			matrix[clickedRow][clickedCell] = new Object(freeSpot)


			// Set this square as start square
			matrix[clickedRow][clickedCell]["clicked"] = true;
			firstClick = true;
			timer();
			matrix = placeMines(matrix)
			renderMines(matrix)
			renderClues(matrix)
			revealSquares()
			inProgress = true

			

		} // FirstClick check


		// Now the User has started the game proper, so we're hitting this else condition after every click
		else {
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


	}) // End (.cell).click

		// reset the game
		resetButton.click(function(){

			window.location.reload(true)

		})
		
		// mousedown and up listeners to make the bee's expression animate
		anyCell = $(".cell")
		anyCell.mousedown(function() {
		    resetButton.removeClass( "bee-smile" ).addClass( "bee-pause" )
		})
		anyCell.mouseup(function() {
			resetButton.removeClass( "bee-pause" ).addClass( "bee-smile" )
		})


// ------------------ FUNCTIONS -----------------------//
// *************************************************** //


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
												nextToMines: 0
											};
				}
			}
		}

		
		// Generate Mines
		for (var i = 0; i < numMines; i++) {
			// Generate a random X and Y co-ord
			var randomX = Math.round(Math.random() * 8),
				randomY = Math.round(Math.random() * 8);
			
	
					// check we dont place a mine in our start point or a previous mine
					while (matrix[randomX][randomY]["clicked"] === true || matrix[randomX][randomY]["mined"] === true){
						randomX = Math.round(Math.random() * 8);
						randomY = Math.round(Math.random() * 8);
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
						if (x !== 8 && matrix[x+1][y]["mined"] === true) {
							addNumberClue(x, y)
						}
						// check down right
						if (x !== 8 && y !== 8 && matrix[x+1][y+1]["mined"] === true) {
							addNumberClue(x, y)
						}
						// check down left
						if (x !== 8 && y !== 0 && matrix[x+1][y-1]["mined"] === true) {
							addNumberClue(x, y)
						}
						// check right
						if (y !== 8 && matrix[x][y+1]["mined"] === true) {
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
						if (x !== 0 && y !== 8 && matrix[x-1][y+1]["mined"] === true) {
							addNumberClue(x, y)
						}		


				}
			}
		}
		// Keeps a count of a clues surrounding mines and updates
		function addNumberClue(x, y){
			matrix[x][y]["nextToMines"] = counter
			// $(".row" + x).find(".cell" + y).text(counter++) 1ST VER
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

			if( x >= 0 && x <= 8 && y >= 0 && y <= 8 ){
				// if our square is empty and unrevealed
				if ( matrix[x][y]["mined"] === false && matrix[x][y]["revealed"] === false ){
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

			else if (matrix[x][y]["nextToMines"] === 8){$(".row" + x).find(".cell" + y).find(".clueSpan").addClass("clueEight").text(matrix[x][y]["nextToMines"])}
			
		}


	} // End revealSquares

	function winConditionCheck(){

		countRevealedSquares = 1;

		for (var x = 0; x < matrix.length; x++) {
			for (var y = 0; y < matrix.length; y++) {

				 if (matrix[x][y]["revealed"] === true){
				 	countRevealedSquares++
				 }
			}	
		}

		if ((countRevealedSquares-1) === ( ( (matrix.length) * (matrix.length) ) - numMines ) ){
			winner = true;
			gameOver();
		}
	
	} // END winConditionCheck

	function gameOver(){
		clearTimeout(t);

		if ( winner === false && inProgress === true ) {		
			inProgress = false
			$("#start-reset-button").removeClass( "bee-pause bee-smile" ).addClass( "bee-lose" )
			sfx()
			updateBox.addClass("loser-box")
			updateBox.text("You made the Bee's angry! Shame on you!")
			for (var x = 0; x < matrix.length; x++) {
			for (var y = 0; y < matrix.length; y++) {
				if (matrix[x][y]["mined"] === true) {
							
						$(".row" + x).find(".cell" + y).addClass("hive-mine")
						
						}}}

		}

		else if (winner === true) {
			inProgress = false
			updateBox.addClass("winner-box")
			updateBox.text("What a careful chap! Well done")
			
		}
	} // End Gameover



var h1 = document.getElementById('timer-digits'),
    seconds = 0, minutes = 0, hours = 0,
    t;

function add() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }
    
    h1.textContent = (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

    timer();
}
function timer() {
    t = setTimeout(add, 1000);
}


function sfx(){

	var audio = document.createElement("audio");
	audio.src = "../JS_BeeSweeper/resources/beeswarm.ogg";
	// audio.addEventListener("ended", function () {
	// 	document.removeChild(this);
	// }, false);
	audio.play();
}




} // End

