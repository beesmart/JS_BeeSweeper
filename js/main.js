

window.onload = function(){

var board = $("#main-container"),
	firstClick = false,
	winner = false,
	numMines = 10
	

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
	        cell = document.createElement("div");
	     	// token = document.createElement("div");
	        cell.className = "cell " + "cell" + j;
	        cell.setAttribute("data-cell", j)
	        // token.className = "token";
	        row.appendChild(cell);
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


	} //createBoard END


createBoard(9)


	$( ".cell" ).click(function() {

		// alert($(this).attr('class') + $(this).parent().attr('class'))
		clickedRow = parseInt($(this).parent().attr('data-row')) 
		clickedCell = parseInt($(this).attr("data-cell"))

		$(this).css("background", "rgb(45, 174, 45)") // change cell background
		
		if (firstClick === false) {

			matrix[clickedRow][clickedCell] = freeSpot = {
												
												mined: false,
												clue: false,
												clicked: true,
												revealed: false,
												nextToMines: 0
											}; 

			// Set this square as start square
			matrix[clickedRow][clickedCell]["clicked"] = true;
			firstClick = true;
			matrix = placeMines(matrix)
			renderMines(matrix)
			renderClues(matrix)
			revealSquares()
			

		} // FirstClick check

		else {

			if (matrix[clickedRow][clickedCell]["mined"] === true) {
				alert("dead")
				gameOver()
			} 


			else { revealSquares();
				   winConditionCheck();
			}
			
		}


	}) // End (.cell).click


	function placeMines(matrix) {

		// fill the spaces that are free (== undefined) with freeSpot objects
		for (var x = 0; x < matrix.length; x++) {
			for (var y = 0; y < matrix.length; y++) {
				if (matrix[x][y] === undefined){
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

		// create 10 mines
		
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
					matrix[randomX][randomY] = {
												mined: true,
												clue: false,
												clicked: false,
												revealed: false,
												nextToMines: 0
															  }
						
	
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
							$(".row" + x).find(".cell" + y).css("background", "red")
							// reveal the clue
							$(".row" + x).find(".cell" + y).text(matrix[x][y]["nextToMines"])
							// Now we are finished on our clue square, we DONT want to continue to the next clue square, otherwise we'll flood the board
							// and the only hidden squares will be the mines, a very easy game then
							onClue = true
						}
						// In this case we're on a non-clue square, so just reveal
						if (matrix[x][y]["nextToMines"] === 0 && onClue === false){

							matrix[x][y]["revealed"] = true;
							$(".row" + x).find(".cell" + y).css("background", "red")

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

		if ((countRevealedSquares-1) === ( ( (matrix.length) * (matrix.length) ) - numMines ) ){alert("win!")}
	
	} // END winConditionCheck

	function gameOver(){
		if ( winner === false ){
			alert("You lose")
		}
		else if (winner === true){
			alert("You win")
		}
	} // End Gameover



} // End

