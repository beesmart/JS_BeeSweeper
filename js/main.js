

window.onload = function(){

var board = $("#main-container"),
	firstClick = false;
	

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
											}; // Set this square as start square
			matrix[clickedRow][clickedCell]["clicked"] = true;
			firstClick = true;
			matrix = placeMines(matrix)
			renderMines(matrix)
			renderClues(matrix)
			revealSquares()

		} // FirstClick check


	}) // End (.cell).click


	function placeMines(matrix) {


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
		// Generate a random X and Y co-ord
		for (var i = 0; i < 10; i++) {
			
			var randomX = Math.round(Math.random() * 8),
				randomY = Math.round(Math.random() * 8);
			// check we dont place a mine in our start point
		
				
				
						
					// while (matrix[randomX][randomY]["mined"] === true){
					// 	randomX = Math.round(Math.random() * 8);
					// 	randomY = Math.round(Math.random() * 8);
					// 	console.log("stopped repeated mine placement")
					// 	checkStartPlace()

					// }

					while (matrix[randomX][randomY]["clicked"] === true || matrix[randomX][randomY]["mined"] === true){
						randomX = Math.round(Math.random() * 8);
						randomY = Math.round(Math.random() * 8);
						console.log("stopped starting sq mine placement")
						
					} 


					
						matrix[randomX][randomY] = {
																	mined: true,
																	clue: false,
																	clicked: false,
																	revealed: false,
																	nextToMines: 0
																}
						
					
					
					
						
					
					
				

				
			
				
			

			// check we dont place a mine on a spot that already has an existing mine
			
			
			// assign the new mine object to the matrix
			

			
		};
		// fill the spaces that are free (not previously mined == undefined) with freeSpot objects 
		
		
			
			return matrix

	} // END placemines	



	// Render the mines
	function renderMines(matrix){

		// Cycle the matrix looking for the mined spots and render
		for (var x = 0; x < matrix.length; x++) {
			for (var y = 0; y < matrix.length; y++) {
				if (matrix[x][y]["mined"] === true) {
							
						// console.log("x is " + (x) + " y is " + (y))				
						$(".row" + x).find(".cell" + y).css("background", "blue")	
					
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
			$(".row" + x).find(".cell" + y).text(counter++)
			matrix[x][y]["clue"] = true

			return counter
		}
		return matrix
	} // End RenderClues


	function revealSquares(){
		
		resetVars()
		floodFill(x, y)


		function floodFill(x, y){

		var onClue = false

			if( x >= 0 && x <= 8 && y >= 0 && y <= 8 ){
				
				if ( matrix[x][y]["mined"] === false && matrix[x][y]["revealed"] === false ){
					
						if (matrix[x][y]["nextToMines"] > 0 && onClue === false){

							matrix[x][y]["revealed"] = true;
							$(".row" + x).find(".cell" + y).css("background", "red")
							onClue = true
						}

						if (matrix[x][y]["nextToMines"] === 0 && onClue === false){

							matrix[x][y]["revealed"] = true;
							$(".row" + x).find(".cell" + y).css("background", "red")

						} else { return }



					floodFill(x - 1, y);
					floodFill(x + 1, y);
            		floodFill(x, y - 1);
            		floodFill(x, y + 1);

				} else { return }
				

			}

		}
			




			
			

		function resetVars(){

			x = parseInt(clickedRow)
			y = parseInt(clickedCell)
			
		}

	} // End revealSquares



} // End

